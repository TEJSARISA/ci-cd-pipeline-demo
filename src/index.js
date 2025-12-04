/**
 * CI/CD Pipeline Demo Application
 * A simple web application for demonstrating automated build, test, and deployment
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API endpoint
app.get('/api/status', (req, res) => {
  res.json({
    message: 'CI/CD Pipeline Demo API is running',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Main entry point
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
