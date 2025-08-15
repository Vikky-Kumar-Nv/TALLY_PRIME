// Minimal test server for Vercel
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Server is working!', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Test API route
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'API is working!', 
    status: 'OK' 
  });
});

// Export for Vercel (no app.listen needed)
module.exports = app;
