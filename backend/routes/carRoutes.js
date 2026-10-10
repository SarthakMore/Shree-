const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { isMongoConnected } = require('../config/db');
const { requireAdmin } = require('../middleware/adminAuth');

const defaultCarPhoto = 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop';
const galleryFallbackPhotos = [
  defaultCarPhoto,
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop'
];

function cleanPhotos(photos) {
  return Array.isArray(photos)
    ? photos.filter(photo => typeof photo === 'string' && photo.trim()).map(photo => photo.trim()).slice(0, 5)
    : [];
}

function normalizePhotos(photos, fallbackPhoto) {
  const normalized = cleanPhotos(photos);
  const primaryPhoto = normalized[0] || (typeof fallbackPhoto === 'string' && fallbackPhoto.trim()) || defaultCarPhoto;
  if (!normalized.length) normalized.push(primaryPhoto);
  if (normalized.length < 2) {
    const secondPhoto = galleryFallbackPhotos.find(photo => photo !== primaryPhoto) || defaultCarPhoto;
    normalized.push(secondPhoto);
  }
  return { photo: primaryPhoto, photos: normalized.slice(0, 5) };
}

function isValidAvailabilityDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Default initial fleet cars
let inMemoryCars = [
  {
    _id: 'car_1',
    name: 'Premium 7-Seater SUV',
    category: 'Premium SUV',
    photo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop'
    ],
    ratePerKm: 14,
    capacity: 7,
    hourlyRate: 450,
    status: 'AVAILABLE',
    availableFrom: '',
    features: ['Premium comfort', 'Well-maintained interior', 'Skilled driver available', 'High Speed Wi-Fi']
  },
  {
    _id: 'car_2',
    name: 'Toyota Innova Crysta ZX',
    category: 'Luxury Limo',
    photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop'
    ],
    ratePerKm: 18,
    capacity: 7,
    hourlyRate: 650,
    status: 'AVAILABLE',
    availableFrom: '',
    features: ['Luxury Captain Seats', 'Rear AC Vents', 'Dual Sunroof', 'Outstation Special']
  },
  {
    _id: 'car_3',
    name: 'Maruti Suzuki Ertiga ZXi',
    category: 'Executive Sedan',
    photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'
    ],
    ratePerKm: 12,
    capacity: 6,
    hourlyRate: 350,
    status: 'AVAILABLE',
    availableFrom: '',
    features: ['Affordable comfort', 'Dual AC', 'Clean interior', 'Luggage space']
  }
];

// GET /api/cars - Get all cars
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const cars = await Car.find().sort({ createdAt: -1 });
      if (cars && cars.length > 0) {
        const data = cars.map(car => {
          const item = car.toObject();
          Object.assign(item, normalizePhotos(item.photos, item.photo));
          return item;
        });
        return res.json({ success: true, data });
      }
    }
    return res.json({ success: true, data: inMemoryCars });
  } catch (err) {
    return res.json({ success: true, data: inMemoryCars });
  }
});

// POST /api/cars - Add a new car (Admin service)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, category, photo, photos, ratePerKm, capacity, hourlyRate, status, availableFrom, features } = req.body || {};
    if (!name) {
      return res.status(400).json({ success: false, message: 'Car name is required' });
    }

    const carStatus = status || 'AVAILABLE';
    if (!['AVAILABLE', 'FULL', 'MAINTENANCE'].includes(carStatus)) {
      return res.status(400).json({ success: false, message: 'Please choose a valid car availability status.' });
    }
    if (carStatus !== 'AVAILABLE' && !isValidAvailabilityDate(availableFrom)) {
      return res.status(400).json({ success: false, message: 'Enter the exact date this car will be available again.' });
    }
    if (availableFrom && !isValidAvailabilityDate(availableFrom)) {
      return res.status(400).json({ success: false, message: 'Enter a valid availability date.' });
    }

    const carPhotos = cleanPhotos(photos || (photo ? [photo] : []));
    if (carPhotos.length < 2) {
      return res.status(400).json({ success: false, message: 'At least two car photos are required.' });
    }

    const newCarData = {
      name,
      category: category || 'Premium SUV',
      ...normalizePhotos(carPhotos, photo),
      ratePerKm: Number(ratePerKm) || 14,
      capacity: Number(capacity) || 7,
      hourlyRate: Number(hourlyRate) || 450,
      status: carStatus,
      availableFrom: carStatus === 'AVAILABLE' ? '' : availableFrom,
      features: Array.isArray(features) ? features : (features ? features.split(',') : ['100% AC Comfort', 'Clean Interior'])
    };

    if (isMongoConnected()) {
      try {
        const createdCar = await Car.create(newCarData);
        return res.status(201).json({ success: true, message: 'Car added to fleet', data: createdCar });
      } catch (dbErr) {
        // Fallback to memory
      }
    }

    const memoryCar = { ...newCarData, _id: 'car_' + Date.now() };
    inMemoryCars.unshift(memoryCar);
    return res.status(201).json({ success: true, message: 'Car added to fleet (in-memory)', data: memoryCar });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cars/:id - Update car
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if ('status' in updateData) {
      if (!['AVAILABLE', 'FULL', 'MAINTENANCE'].includes(updateData.status)) {
        return res.status(400).json({ success: false, message: 'Please choose a valid car availability status.' });
      }
      if (updateData.status === 'AVAILABLE') {
        updateData.availableFrom = '';
      } else if (!isValidAvailabilityDate(updateData.availableFrom)) {
        return res.status(400).json({ success: false, message: 'Enter the exact date this car will be available again.' });
      }
    } else if ('availableFrom' in updateData && updateData.availableFrom && !isValidAvailabilityDate(updateData.availableFrom)) {
      return res.status(400).json({ success: false, message: 'Enter a valid availability date.' });
    }
    if ('photos' in updateData || 'photo' in updateData) {
      const updatedPhotos = cleanPhotos(updateData.photos || (updateData.photo ? [updateData.photo] : []));
      if (updatedPhotos.length < 2) {
        return res.status(400).json({ success: false, message: 'At least two car photos are required.' });
      }
      Object.assign(updateData, normalizePhotos(updatedPhotos, updateData.photo));
    }

    if (isMongoConnected()) {
      try {
        const updated = await Car.findByIdAndUpdate(id, updateData, { new: true });
        if (updated) {
          return res.json({ success: true, message: 'Car updated', data: updated });
        }
      } catch (dbErr) { }
    }

    const index = inMemoryCars.findIndex(c => c._id === id);
    if (index !== -1) {
      inMemoryCars[index] = { ...inMemoryCars[index], ...updateData };
      return res.json({ success: true, message: 'Car updated in memory', data: inMemoryCars[index] });
    }

    return res.status(404).json({ success: false, message: 'Car not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cars/:id - Delete car
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      try {
        await Car.findByIdAndDelete(id);
      } catch (dbErr) { }
    }
    inMemoryCars = inMemoryCars.filter(c => c._id !== id);
    return res.json({ success: true, message: 'Car deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
