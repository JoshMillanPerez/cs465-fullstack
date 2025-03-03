const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('contact', { title: 'Contact - Travlr Getaways' });
});

module.exports = router;