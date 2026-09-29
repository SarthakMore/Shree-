const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { isMongoConnected } = require('../config/db');
const { requireAdmin } = require('../middleware/adminAuth');

// Default initial fleet cars
let inMemoryCars = [
  {
    _id: 'car_1',
    name: 'VinFast Limo Green EV',
    category: 'EV SUV',
    photo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
    ratePerKm: 14,
    capacity: 7,
    hourlyRate: 450,
    status: 'AVAILABLE',
    features: ['100% Electric EV', 'Zero Emissions', 'Leather Reclining Seats', 'High Speed Wi-Fi']
  },
  {
    _id: 'car_2',
    name: 'Toyota Innova Crysta ZX',
    category: 'Luxury Limo',
    photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
    ratePerKm: 18,
    capacity: 7,
    hourlyRate: 650,
    status: 'AVAILABLE',
    features: ['Luxury Captain Seats', 'Rear AC Vents', 'Dual Sunroof', 'Outstation Special']
  },
  {
    _id: 'car_3',
    name: 'Maruti Suzuki Ertiga ZXi',
    category: 'Executive Sedan',
    photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
    ratePerKm: 12,
    capacity: 6,
    hourlyRate: 350,
    status: 'AVAILABLE',
    features: ['Budget Shared Comfort', 'Dual AC', 'Clean Hygiene interior', 'Luggage Carrier']
  }
];

// GET /api/cars - Get all cars
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const cars = await Car.find().sort({ createdAt: -1 });
      if (cars && cars.length > 0) {
        return res.json({ success: true, data: cars });
      }
    }
    return res.json({ success: true, data: inMemoryCars });
  } catch (err) {
    return res.json({ success: true, data: inMemoryCars });
  }
});

// POST /api/cars - Add a new car (Admin service)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, category, photo, ratePerKm, capacity, hourlyRate, status, features } = req.body || {};
    if (!name) {
      return res.status(400).json({ success: false, message: 'Car name is required' });
    }

    const newCarData = {
      name,
      category: category || 'EV SUV',
      photo: photo || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
      ratePerKm: Number(ratePerKm) || 14,
      capacity: Number(capacity) || 7,
      hourlyRate: Number(hourlyRate) || 450,
      status: status || 'AVAILABLE',
      features: Array.isArray(features) ? features : (features ? features.split(',') : ['100% AC Comfort', 'Clean Interior'])
    };

    if (isMongoConnected()) {
      try {
        const createdCar = await Car.create(newCarData);
        return res.status(201).json({ success: true, message: 'Car added to fleet', data: createdCar });
      } catch (dbErr) {
        // Fallback to memory
      }
    }

    const memoryCar = { ...newCarData, _id: 'car_' + Date.now() };
    inMemoryCars.unshift(memoryCar);
    return res.status(201).json({ success: true, message: 'Car added to fleet (in-memory)', data: memoryCar });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cars/:id - Update car
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isMongoConnected()) {
      try {
        const updated = await Car.findByIdAndUpdate(id, updateData, { new: true });
        if (updated) {
          return res.json({ success: true, message: 'Car updated', data: updated });
        }
      } catch (dbErr) { }
    }

    const index = inMemoryCars.findIndex(c => c._id === id);
    if (index !== -1) {
      inMemoryCars[index] = { ...inMemoryCars[index], ...updateData };
      return res.json({ success: true, message: 'Car updated in memory', data: inMemoryCars[index] });
    }

    return res.status(404).json({ success: false, message: 'Car not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cars/:id - Delete car
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      try {
        await Car.findByIdAndDelete(id);
      } catch (dbErr) { }
    }
    inMemoryCars = inMemoryCars.filter(c => c._id !== id);
    return res.json({ success: true, message: 'Car deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
