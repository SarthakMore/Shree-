const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['EV SUV', 'Luxury Limo', 'Executive Sedan', 'Outstation Minivan'],
    default: 'EV SUV'
  },
  photo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'
  },
  ratePerKm: {
    type: Number,
    required: true,
    default: 14
  },
  capacity: {
    type: Number,
    default: 7
  },
  hourlyRate: {
    type: Number,
    default: 450
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'FULL', 'MAINTENANCE'],
    default: 'AVAILABLE'
  },
  features: {
    type: [String],
    default: ['100% Electric EV', 'Zero Emissions', 'Leather Captain Seats', 'High Speed Wi-Fi', 'AC Climate Control']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema);
