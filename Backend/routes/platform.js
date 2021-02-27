const router = require('express').Router();
let Platform = require('../models/platform.model');

//get platforms 
router.route('/').get((req, res) => {
    Platform.find()
    .then(platforms => res.json(platforms))
    .catch(err => res.status(400).json('Error: ' + err));
});

//routes for web scrapers to add/ update/ delete 