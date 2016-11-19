import express from 'express';

const homeRoute = express.Router();

/**
  * Route for the homepage.
  */
homeRoute.get('/', (req, res) => {
  res.json({ message: 'Welcome to Document Management App.' });
});

export default homeRoute;
