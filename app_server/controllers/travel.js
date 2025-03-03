const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

const travel = async (req, res) => {
    try {
        const trips = await Trip.find({}).exec();
        console.log('Trips loaded:', trips.map(t => ({ code: t.code, name: t.name, image: t.image })));
        if (!trips || trips.length === 0) {
            throw new Error('No trips found');
        }
        res.render('travel', { title: 'Travel - Travlr Getaways', trips });
    } catch (err) {
        console.error('Error loading trips:', err);
        res.status(500).render('error', { message: err.message });
    }
};

module.exports = { travel };