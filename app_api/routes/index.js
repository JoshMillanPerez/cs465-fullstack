const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth header received:', authHeader);
  if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);
      req.payload = decoded; // Manually set req.payload
      next();
    } catch (e) {
      console.error('Token verification failed:', e.message);
      return res.status(401).json({ "message": "Unauthorized: Invalid token" });
    }
  } else {
    console.log('No valid Bearer token found');
    return res.status(401).json({ "message": "Unauthorized: No token provided" });
  }
};

router.route('/login').post(authController.login);
router.route('/register').post(authController.register);
router.route('/trips')
    .get(tripsController.tripsList)
    .post(auth, (req, res) => {
      console.log('POST /api/trips payload:', req.payload);
      tripsController.tripsAddTrip(req, res);
    });
router.route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(auth, (req, res) => {
      console.log('PUT /api/trips/:tripCode payload:', req.payload);
      tripsController.tripsUpdateTrip(req, res);
    });

module.exports = router;