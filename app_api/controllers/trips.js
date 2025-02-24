const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async(req, res) => {
    const q = await Model
        .find({})
        .exec();
    
    if(!q) {
        return res
            .status(404)
            .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};

// GET: /trips/:tripCode - lists a single trip
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode})
        .exec();
    
    if(!q) {
        return res
            .status(404)
            .json(err);d
    } else {
        return res
            .status(200)
            .json(q);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};















const tripsAddTrip = async(req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description

    });

    const q = await newTrip.save();

        if(!q) {
            return res
                .status(404)
                .json(err);d
        } else {
            return res
                .status(200)
                .json(q);
        }
};
module.exports = {
        tripsList,
        tripsFindByCode,
        tripsAddTrip,
        tripsUpdateTrip
    };