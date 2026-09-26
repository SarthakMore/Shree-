const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  travelDetails: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Resolved'],
    default: 'New'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
