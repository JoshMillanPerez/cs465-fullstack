const express = require('express'); // Express app
const router = express.Router(); // Router logic
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

// This is where we import the controllers we will route
const authController = require('../controllers/authentication')
const tripsController = require('../controllers/trips');

// define routes for our trips endpoint
router
    .route('/login')
    .post(authController.login)

router
    .route('register')
    .post(authController.register)
    .

router
    .route('/trips')
    .get(tripsController.tripsList) //Get Methos routes tripList
    .post(auth, tripsController.tripsAddTrip);

 // GET Method routes tripFindByCode - require parameter
 router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)  // Handle the request properly
    .get(auth, tripsController.tripsUpdateTrip);

module.exports = router;