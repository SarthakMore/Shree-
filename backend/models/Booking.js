const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Passenger name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  pickup: {
    type: String,
    required: [true, 'Pickup location is required']
  },
  drop: {
    type: String,
    required: [true, 'Drop location is required']
  },
  date: {
    type: String,
    required: [true, 'Travel date is required']
  },
  time: {
    type: String,
    default: '09:00 AM'
  },
  seatPosition: {
    type: String,
    enum: ['Front Row (VIP)', 'Middle Row (Comfort)', 'Third Row (Economy)'],
    default: 'Middle Row (Comfort)'
  },
  passengers: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    default: 1
  },
  vehicle: {
    type: String,
    default: 'Maruti Ertiga / Dzire'
  },
  totalFare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  specialNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
