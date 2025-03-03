const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travel');
const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

router.get('/', travelController.travel);

router.get('/:tripCode', async (req, res) => {
  try {
    const trip = await Trip.findOne({ code: req.params.tripCode }).exec();
    if (!trip) {
      return res.status(404).render('error', { message: 'Trip not found' });
    }
    res.render('trip_detail', { trip, title: `${trip.name} - Travlr Getaways` });
  } catch (err) {
    console.error('Error loading trip:', err);
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;