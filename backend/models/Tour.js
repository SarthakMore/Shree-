const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  photo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop'
  },
  duration: {
    type: String,
    default: '1 Day Trip'
  },
  description: {
    type: String,
    default: 'Premium private tour package with door-to-door pick up and drop.'
  },
  highlights: {
    type: [String],
    default: ['Doorstep Pick & Drop', '100% AC Comfort', 'Experienced Driver', 'Custom Stopovers']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tour', tourSchema);
