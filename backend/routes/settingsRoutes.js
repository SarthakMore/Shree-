const express = require('express');
const router = express.Router();
const CabSettings = require('../models/CabSettings');
const { isMongoConnected } = require('../config/db');

// Default fallback settings in memory
let inMemorySettings = {
  frontSeatFare: 649,
  middleSeatFare: 499,
  thirdSeatFare: 399,
  cabStatus: 'AVAILABLE',
  statusNote: 'VinFast Limo Green EV is accepting reservations for upcoming hourly slots.'
};

// @route   GET /api/settings
// @desc    Get current cab fares & availability status
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      let settings = await CabSettings.findOne();
      if (!settings) {
        settings = await CabSettings.create(inMemorySettings);
      }
      return res.json({ success: true, data: settings });
    } else {
      return res.json({ success: true, data: inMemorySettings });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/settings
// @desc    Update fares & cab availability status from Admin Panel
router.put('/', async (req, res) => {
  try {
    const { frontSeatFare, middleSeatFare, thirdSeatFare, cabStatus, statusNote } = req.body;

    const updatedFields = {
      frontSeatFare: parseInt(frontSeatFare) || 649,
      middleSeatFare: parseInt(middleSeatFare) || 499,
      thirdSeatFare: parseInt(thirdSeatFare) || 399,
      cabStatus: cabStatus || 'AVAILABLE',
      statusNote: statusNote || ''
    };

    if (isMongoConnected()) {
      let settings = await CabSettings.findOne();
      if (settings) {
        settings = await CabSettings.findByIdAndUpdate(settings._id, updatedFields, { new: true });
      } else {
        settings = await CabSettings.create(updatedFields);
      }
      return res.json({ success: true, message: 'Settings updated in MongoDB', data: settings });
    } else {
      inMemorySettings = { ...inMemorySettings, ...updatedFields };
      return res.json({ success: true, message: 'Settings updated in Database store', data: inMemorySettings });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update settings', error: err.message });
  }
});

module.exports = router;
