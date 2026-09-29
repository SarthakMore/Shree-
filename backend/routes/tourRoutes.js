const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const { isMongoConnected } = require('../config/db');

// Default initial travel packages
let inMemoryTours = [
  {
    _id: 'tour_1',
    title: 'Mahabaleshwar & Panchgani Scenic Escapade',
    destination: 'Mahabaleshwar',
    price: 4999,
    photo: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop',
    duration: '2 Days / 1 Night',
    description: 'Explore Venna Lake, Elephant Head Point, Mapro Garden & Panchgani Tableland with private EV limo.',
    highlights: ['Doorstep Pick & Drop', 'Mapro Garden Visit', 'Venna Lake Boating', '100% Private Limo AC']
  },
  {
    _id: 'tour_2',
    title: 'Shirdi Sai Temple Divine Pilgrimage',
    destination: 'Shirdi',
    price: 6499,
    photo: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop',
    duration: '2 Days / 1 Night',
    description: 'Comfortable VIP Darshan trip to Shirdi Sai Baba Temple & Shani Shingnapur with dedicated driver.',
    highlights: ['VIP Darshan Guidance', 'Shani Shingnapur Stop', 'Driver Allowance Included', 'Toll Taxes Included']
  },
  {
    _id: 'tour_3',
    title: 'Konkan Coastal Expressway Tour (Ganpatipule & Ratnagiri)',
    destination: 'Konkan',
    price: 7999,
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    duration: '3 Days / 2 Nights',
    description: 'Pristine white sand beaches, coastal forts, and fresh Alphonso mango orchards tour.',
    highlights: ['Ganpatipule Temple', 'Jaigad Fort Sunset', 'Water Sports Options', 'Seafood Delicacies']
  },
  {
    _id: 'tour_4',
    title: 'Lonavala & Khandala Monsoon Hills Package',
    destination: 'Lonavala',
    price: 3899,
    photo: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop',
    duration: '1 Day Full Package',
    description: 'Tiger Point, Bhushi Dam, Karla Caves and famous Lonavala Chikki tasting tour.',
    highlights: ['Tiger Point View', 'Bhushi Dam Waterfall', 'Karla Caves', 'Custom Stopovers']
  },
  {
    _id: 'tour_5',
    title: 'Ashtavinayak Sacred 8 Ganesha Temple Yatra',
    destination: 'Maharashtra Circuit',
    price: 9999,
    photo: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop',
    duration: '3 Days / 2 Nights',
    description: 'Complete pilgrimage covering Morgaon, Siddhatek, Pali, Mahad, Theur, Lenyadri, Ozar & Ranjangaon.',
    highlights: ['All 8 Temples Covered', 'Comfortable Night Stays', 'Pure Veg Restaurant Stops', 'Experienced Guide']
  },
  {
    _id: 'tour_6',
    title: 'Kolhapur Mahalaxmi Temple & Rankala Lake Express',
    destination: 'Kolhapur',
    price: 4499,
    photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
    duration: '1 Day Full Tour',
    description: 'Shree Mahalaxmi Ambabai Darshan, Panhala Fort heritage walk, and Rankala Lake sunset.',
    highlights: ['Mahalaxmi Temple VIP Line', 'Panhala Fort Fortification', 'Rankala Chowpatty', 'Authentic Kolhapuri Thali']
  }
];

// GET /api/tours - Get all tours
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const tours = await Tour.find().sort({ createdAt: -1 });
      if (tours && tours.length > 0) {
        return res.json({ success: true, data: tours });
      }
    }
    return res.json({ success: true, data: inMemoryTours });
  } catch (err) {
    return res.json({ success: true, data: inMemoryTours });
  }
});

// POST /api/tours - Add a new tour package (Admin service)
router.post('/', async (req, res) => {
  try {
    const { title, destination, price, photo, duration, description, highlights } = req.body || {};
    if (!title || !price) {
      return res.status(400).json({ success: false, message: 'Package title and price are required' });
    }

    const newTourData = {
      title,
      destination: destination || 'Maharashtra',
      price: Number(price),
      photo: photo || 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop',
      duration: duration || '1 Day Tour',
      description: description || 'Private luxury outstation tour package with door-to-door pick & drop.',
      highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split(',') : ['Doorstep Pick & Drop', '100% AC Comfort'])
    };

    if (isMongoConnected()) {
      try {
        const createdTour = await Tour.create(newTourData);
        return res.status(201).json({ success: true, message: 'Tour package added', data: createdTour });
      } catch (dbErr) {}
    }

    const memoryTour = { ...newTourData, _id: 'tour_' + Date.now() };
    inMemoryTours.unshift(memoryTour);
    return res.status(201).json({ success: true, message: 'Tour package added (in-memory)', data: memoryTour });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/tours/:id - Delete tour
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      try {
        await Tour.findByIdAndDelete(id);
      } catch (dbErr) {}
    }
    inMemoryTours = inMemoryTours.filter(t => t._id !== id);
    return res.json({ success: true, message: 'Tour package deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
