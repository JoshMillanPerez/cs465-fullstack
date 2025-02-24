const express = require('express'); // Express app
const router = express.Router(); // Router logic

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');

// define routes for our trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList) //Get Methos routes tripList
    .post(tripsController.tripsAddTrip);

 // GET Method routes tripFindByCode - require parameter
 router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)  // Handle the request properly
    .get(tripsController.tripsUpdateTrip);

module.exports = router;