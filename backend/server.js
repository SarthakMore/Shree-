const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Shree Venkateswara EV MERN Backend API',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Shree Venkateswara EV MERN Backend running on http://localhost:${PORT}`);
});
