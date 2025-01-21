const fs =require('fs');
const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

/* GET travel view */
const travel = (req, res) => {
    res.render('Travel', {title: pagetitle, trips});
};

module.exports = {
    travel
};