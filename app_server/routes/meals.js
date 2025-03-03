const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('meals', { title: 'Meals - Travlr Getaways' });
});

module.exports = router;