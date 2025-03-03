const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('rooms', { title: 'Rooms - Travlr Getaways' });
});

module.exports = router;