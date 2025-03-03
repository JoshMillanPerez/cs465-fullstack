const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

const getUser = async (req, res) => {
  console.log('req.payload in getUser:', req.payload); // Debug payload
  if (!req.payload || !req.payload.email) {
    return res.status(401).json({ "message": "Unauthorized: No user payload" });
  }
  try {
    const user = await mongoose.model('user').findOne({ email: req.payload.email }).exec();
    if (!user) {
      return res.status(404).json({ "message": "User not found" });
    }
    return user.name;
  } catch (err) {
    console.error('Error finding user:', err);
    return res.status(500).json({ "message": "Server error", "error": err.message });
  }
};

const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({}).exec();
    console.log('API trips loaded:', trips.map(trip => ({ code: trip.code, name: trip.name, image: trip.image })));
    return res.status(200).json(trips);
  } catch (err) {
    console.error('Error retrieving trips:', err);
    return res.status(500).json({ "message": "Server error", "error": err.message });
  }
};

const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.find({ 'code': req.params.tripCode }).exec();
    console.log('Trip by code loaded:', trip.map(t => ({ code: t.code, name: t.name, image: t.image })));
    return res.status(200).json(trip);
  } catch (err) {
    console.error('Error retrieving trip:', err);
    return res.status(500).json({ "message": "Server error", "error": err.message });
  }
};

const tripsAddTrip = async (req, res) => {
  const username = await getUser(req, res);
  if (typeof username === 'object') return username; // Error response
  try {
    const trip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });
    console.log('Trip added:', { code: trip.code, name: trip.name, image: trip.image });
    return res.status(201).json(trip);
  } catch (err) {
    console.error('Error adding trip:', err);
    return res.status(400).json({ "message": "Bad request", "error": err.message });
  }
};

const tripsUpdateTrip = async (req, res) => {
  const username = await getUser(req, res);
  if (typeof username === 'object') return username; // Error response
  try {
    const trip = await Trip.findOneAndUpdate(
      { 'code': req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }
    ).exec();
    if (!trip) {
      console.log('Trip not found for update:', req.params.tripCode);
      return res.status(404).json({ "message": "Trip not found" });
    }
    console.log('Trip updated:', { code: trip.code, name: trip.name, image: trip.image });
    return res.status(200).json(trip);
  } catch (err) {
    console.error('Error updating trip:', err);
    return res.status(500).json({ "message": "Server error", "error": err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};