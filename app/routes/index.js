const express = require('express');

const homeRoute = express.Router();

/**
  * Route for the homepage.
  */
homeRoute.get('/', (req, res) => {
  res.json({ message: 'Welcome to Document Management App.' });
});

module.exports = homeRoute;
