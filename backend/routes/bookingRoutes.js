const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { inMemoryStore, isMongoConnected } = require('../config/db');
const { requireAdmin } = require('../middleware/adminAuth');

// @route   GET /api/bookings
// @desc    Get all bookings
router.get('/', requireAdmin, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: bookings.length, data: bookings });
    } else {
      return res.json({ success: true, count: inMemoryStore.bookings.length, data: inMemoryStore.bookings });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// @route   POST /api/bookings/delete-exported
// @desc    Delete only the bookings included in an admin CSV export
router.post('/delete-exported', requireAdmin, async (req, res) => {
  const { bookingIds } = req.body || {};
  const maxExportedBookings = 10000;

  if (
    !Array.isArray(bookingIds) ||
    bookingIds.length === 0 ||
    bookingIds.length > maxExportedBookings ||
    bookingIds.some(id => typeof id !== 'string' || !id.trim())
  ) {
    return res.status(400).json({ success: false, message: 'A valid list of exported booking IDs is required' });
  }

  const uniqueIds = [...new Set(bookingIds)];

  try {
    if (isMongoConnected()) {
      if (uniqueIds.some(id => !/^[a-f\d]{24}$/i.test(id))) {
        return res.status(400).json({ success: false, message: 'One or more booking IDs are invalid' });
      }

      const result = await Booking.deleteMany({ _id: { $in: uniqueIds } });
      return res.json({
        success: true,
        message: 'Exported bookings deleted successfully',
        deletedCount: result.deletedCount
      });
    }

    const originalCount = inMemoryStore.bookings.length;
    inMemoryStore.bookings = inMemoryStore.bookings.filter(booking => !uniqueIds.includes(booking._id));
    return res.json({
      success: true,
      message: 'Exported bookings deleted successfully',
      deletedCount: originalCount - inMemoryStore.bookings.length
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete exported bookings', error: err.message });
  }
});

// @route   POST /api/bookings
// @desc    Create a vehicle booking
router.post('/', async (req, res) => {
  if (process.env.SHARED_CAB_BOOKINGS_ENABLED !== 'true') {
    return res.status(503).json({
      success: false,
      message: 'Bookings are temporarily unavailable.'
    });
  }

  try {
    const { name, phone, pickup, drop, date, time, seatPosition, passengers, vehicle, totalFare, specialNotes, driverName } = req.body;

    if (!name || !phone || !pickup || !drop || !date) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Tiered seat pricing calculation
    let ratePerSeat = 499;
    if (seatPosition === 'Front Row (VIP)') ratePerSeat = 649;
    else if (seatPosition === 'Middle Row (Comfort)') ratePerSeat = 499;
    else if (seatPosition === 'Third Row (Economy)') ratePerSeat = 399;

    const calculatedFare = totalFare || ((passengers || 1) * ratePerSeat);

    if (isMongoConnected()) {
      const newBooking = await Booking.create({
        name,
        phone,
        pickup,
        drop,
        date,
        time: time || '09:00 AM',
        seatPosition: seatPosition || 'Middle Row (Comfort)',
        passengers: passengers || 1,
        vehicle: vehicle || 'Maruti Ertiga / Dzire',
        totalFare: calculatedFare,
        specialNotes: specialNotes || '',
        status: 'Pending',
        driverName: driverName || ''
      });
      return res.status(201).json({ success: true, message: 'Booking created successfully', data: newBooking });
    } else {
      const newMemBooking = {
        _id: 'bk_' + Date.now(),
        name,
        phone,
        pickup,
        drop,
        date,
        time: time || '09:00 AM',
        seatPosition: seatPosition || 'Middle Row (Comfort)',
        passengers: parseInt(passengers) || 1,
        vehicle: vehicle || 'Maruti Ertiga / Dzire',
        totalFare: calculatedFare,
        specialNotes: specialNotes || '',
        status: 'Pending',
        driverName: driverName || '',
        createdAt: new Date().toISOString()
      };
      inMemoryStore.bookings.unshift(newMemBooking);
      return res.status(201).json({ success: true, message: 'Booking reserved in Database engine', data: newMemBooking });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create booking', error: err.message });
  }
});

// @route   PUT /api/bookings/:id/status
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, driverName } = req.body;
    const { id } = req.params;
    const update = { status };

    if (typeof driverName !== 'undefined') {
      update.driverName = (driverName || '').trim();
    }

    if (isMongoConnected()) {
      const updatedBooking = await Booking.findByIdAndUpdate(id, update, { new: true });
      if (!updatedBooking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      return res.json({ success: true, data: updatedBooking });
    } else {
      const bookingIndex = inMemoryStore.bookings.findIndex(b => b._id === id);
      if (bookingIndex !== -1) {
        if (typeof driverName !== 'undefined') {
          inMemoryStore.bookings[bookingIndex].driverName = (driverName || '').trim();
        }
        inMemoryStore.bookings[bookingIndex].status = status;
        return res.json({ success: true, data: inMemoryStore.bookings[bookingIndex] });
      }
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
});

// @route   DELETE /api/bookings/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      await Booking.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Booking deleted successfully' });
    } else {
      inMemoryStore.bookings = inMemoryStore.bookings.filter(b => b._id !== id);
      return res.json({ success: true, message: 'Booking deleted from store' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete booking', error: err.message });
  }
});

module.exports = router;
