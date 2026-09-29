const mongoose = require('mongoose');

const cabSettingsSchema = new mongoose.Schema({
  frontSeatFare: {
    type: Number,
    default: 650
  },
  middleSeatFare: {
    type: Number,
    default: 550
  },
  thirdSeatFare: {
    type: Number,
    default: 450
  },
  ratePerKm: {
    type: Number,
    default: 14
  },
  cabStatus: {
    type: String,
    enum: ['AVAILABLE', 'FULL'],
    default: 'AVAILABLE'
  },
  statusNote: {
    type: String,
    default: 'VinFast Limo Green EV is accepting reservations for upcoming hourly slots.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CabSettings', cabSettingsSchema);
