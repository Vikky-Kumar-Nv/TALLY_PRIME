// api/index.js - Vercel serverless function
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'GST Billing API is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Test API route
app.get('/api/test', (req, res) => {
  res.status(200).json({
    message: 'Test API endpoint working!',
    status: 'OK'
  });
});

// Export the Express app as a serverless function
module.exports = app;
