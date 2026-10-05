const express = require('express');
const router = express.Router();
const CabSettings = require('../models/CabSettings');
const { isMongoConnected } = require('../config/db');
const { requireAdmin } = require('../middleware/adminAuth');

// Default fallback settings in memory
let inMemorySettings = {
  frontSeatFare: 650,
  middleSeatFare: 550,
  thirdSeatFare: 450,
  ratePerKm: 14,
  cabStatus: 'AVAILABLE',
  statusNote: 'Premium car rentals are available with or without a professional driver.'
};

// GET /api/settings
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
    return res.json({ success: true, data: inMemorySettings });
  }
});

// Update settings handler function (supports PUT & POST)
const handleUpdateSettings = async (req, res) => {
  try {
    const { frontSeatFare, middleSeatFare, thirdSeatFare, ratePerKm, cabStatus, statusNote } = req.body || {};

    const updatedFields = {
      frontSeatFare: parseInt(frontSeatFare) || inMemorySettings.frontSeatFare,
      middleSeatFare: parseInt(middleSeatFare) || inMemorySettings.middleSeatFare,
      thirdSeatFare: parseInt(thirdSeatFare) || inMemorySettings.thirdSeatFare,
      ratePerKm: parseInt(ratePerKm) || inMemorySettings.ratePerKm,
      cabStatus: cabStatus || inMemorySettings.cabStatus,
      statusNote: statusNote !== undefined ? statusNote : inMemorySettings.statusNote
    };

    inMemorySettings = { ...inMemorySettings, ...updatedFields };

    if (isMongoConnected()) {
      try {
        let settings = await CabSettings.findOne();
        if (settings) {
          settings = await CabSettings.findByIdAndUpdate(settings._id, updatedFields, { new: true });
        } else {
          settings = await CabSettings.create(updatedFields);
        }
        return res.json({ success: true, message: 'Settings updated successfully', data: settings });
      } catch (dbErr) {
        return res.json({ success: true, message: 'Settings updated in memory store', data: inMemorySettings });
      }
    } else {
      return res.json({ success: true, message: 'Settings updated in memory store', data: inMemorySettings });
    }
  } catch (err) {
    return res.json({ success: true, message: 'Settings updated', data: inMemorySettings });
  }
};

// Route handlers for PUT and POST
router.put('/', requireAdmin, handleUpdateSettings);
router.post('/', requireAdmin, handleUpdateSettings);
router.put('/update', requireAdmin, handleUpdateSettings);
router.post('/update', requireAdmin, handleUpdateSettings);

module.exports = router;
