const router = require('express').Router();
let Watchlist = require('../models/watchlist.model');
const mongoose = require('mongoose');
const { route } = require('./shows');

//get all watchlists http://localhost:3001/watchlists/
router.route('/').get((req, res) => {
    Watchlist.find()
    .then(watchlists => res.json(watchlists))
    .catch(err => res.statusCode);
});

//add watchlist http://localhost:3001/watchlists/add/
router.route('/add').post((req, res) => {
    const title = req.body.title;

    const newWatchlist = new Watchlist({
        title
    });
    newWatchlist.timestamp = Date.now;

    newWatchlist.save()
    .then(() => res.json ('Watchlist added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


//get specific watchlist 
router.route('/:id').get((req, res) => {
    Watchlist.findById(req.params.id)
      .then(exercise => res.json(exercise))
      .catch(err => res.status(400).json('Error: ' + err));
});

//update a specific watchlist
router.route('/update/:id').post((req, res) => {
    Watchlist.findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(() => res.json('Watchlist updated!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//delete specific watchlist 
router.route('/:id').delete((req, res) => {
    Watchlist.findByIdAndDelete(req.params.id)
    .then(() => res.json('Watchlist deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//save a show to the watchlist

//delete a show from the watchlist

module.exports = router;