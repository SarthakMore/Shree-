const express = require('express');
const router = express.Router();
const QuoteRequest = require('../models/QuoteRequest');
const { inMemoryStore, isMongoConnected } = require('../config/db');
const { requireAdmin } = require('../middleware/adminAuth');

// @route   POST /api/quotes
// @desc    Create custom quote request
router.post('/', async (req, res) => {
  try {
    const { name, phone, travelDetails } = req.body;
    if (!name || !phone || !travelDetails) {
      return res.status(400).json({ success: false, message: 'Please provide name, phone, and travel details' });
    }

    if (isMongoConnected()) {
      const newQuote = await QuoteRequest.create({ name, phone, travelDetails });
      return res.status(201).json({ success: true, message: 'Quote request submitted successfully', data: newQuote });
    } else {
      const newMemQuote = {
        _id: 'qt_' + Date.now(),
        name,
        phone,
        travelDetails,
        status: 'New',
        createdAt: new Date().toISOString()
      };
      inMemoryStore.quotes.push(newMemQuote);
      return res.status(201).json({ success: true, message: 'Quote request saved', data: newMemQuote });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit quote request', error: err.message });
  }
});

// @route   GET /api/quotes
// @desc    Get all quote requests
router.get('/', requireAdmin, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: quotes.length, data: quotes });
    } else {
      return res.json({ success: true, count: inMemoryStore.quotes.length, data: inMemoryStore.quotes });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

module.exports = router;
