const express = require('express');
const router = express.Router();
const controller= require('../controller/travel');

/* GET home page. */ 
router.get('/', controller.travel);

module.exports = router;