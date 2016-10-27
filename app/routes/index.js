const express = require('express'),
  homeRoute = express.Router();

// Route for home page
homeRoute.get('/', (req, res) => {
  res.json({ message: 'Welcome to Document Management App.' });
});

module.exports = homeRoute;