const mongoose = require('mongoose');

const cabSettingsSchema = new mongoose.Schema({
  frontSeatFare: {
    type: Number,
    default: 649
  },
  middleSeatFare: {
    type: Number,
    default: 499
  },
  thirdSeatFare: {
    type: Number,
    default: 399
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
