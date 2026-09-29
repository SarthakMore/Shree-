const mongoose = require('mongoose');

// In-Memory Database Fallback Store if MongoDB daemon is not connected
const inMemoryStore = {
  bookings: [
    {
      _id: 'bk_101',
      name: 'Amit Deshmukh',
      phone: '+91 98220 12345',
      pickup: 'Kolhapur (CBS)',
      drop: 'Pune (Swargate)',
      date: new Date().toISOString().split('T')[0],
      time: '09:00 AM',
      passengers: 2,
      vehicle: 'Maruti Ertiga (AC)',
      totalFare: 998,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'bk_102',
      name: 'Pooja Kulkarni',
      phone: '+91 94230 67890',
      pickup: 'Pune (Wakad)',
      drop: 'Kolhapur (Kawala Naka)',
      date: new Date().toISOString().split('T')[0],
      time: '01:00 PM',
      passengers: 1,
      vehicle: 'Maruti Suzuki Dzire',
      totalFare: 499,
      status: 'Pending',
      createdAt: new Date().toISOString()
    }
  ],
  quotes: []
};

let isMongoConnected = false;

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/anandyatra_db';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${mongoose.connection.host}`);
  } catch (err) {
    isMongoConnected = false;
    const errorName = err instanceof Error ? err.name : 'UnknownError';
    const errorCode = err && typeof err === 'object' && 'code' in err ? `, code ${err.code}` : '';
    console.error(`⚠️ MongoDB Connection Offline (${errorName}${errorCode}). Active MERN In-Memory Database Engine Running.`);
  }
};

module.exports = { connectDB, inMemoryStore, isMongoConnected: () => isMongoConnected };
