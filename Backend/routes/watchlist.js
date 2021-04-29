const router = require('express').Router();
let Watchlist = require('../models/watchlist.model');
let Show= require('../models/show.model');
const mongoose = require('mongoose');
const { route } = require('./shows');
const { useReducer } = require('react');

//get all watchlists http://localhost:3001/watchlists/
router.route('/').get((req, res) => {
    Watchlist.find()
    .then(watchlists => res.json(watchlists))
    .catch(err => res.statusCode);
});

//add watchlist http://localhost:3001/watchlists/add/
router.route('/add').post((req, res) => {
    const title = req.body.title;

    User.findOne({token: req.body.token})

    .then(user=>{
        if(user)
        {
            const newWatchlist = new Watchlist({
                title
            });
            newWatchlist.timestamp = Date.now;
        
            newWatchlist.save()
            .then(() => res.json ('Watchlist added!'))
            .catch(err => res.status(400).json('Error: ' + err));
        }
    })
    .catch(err => res.json(err));
});

//get specific watchlist 
router.route('/:id').get((req, res) => {
    Watchlist.findById(req.params.id)
      .then(exercise => res.json(exercise))
      .catch(err => res.status(400).json('Error: ' + err));
});

//delete specific watchlist 
router.route('/:id').delete((req, res) => {
    Watchlist.findByIdAndDelete(req.params.id)
    .then(() => res.json('Watchlist deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//update a specific watchlist
router.route('/update/:id').post((req, res) => {
    Watchlist.findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(() => res.json('Watchlist updated!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//add a show to the watchlist
router.route('/addShow').post((req, res) => {

    // User.findOne({token: req.body.token})
    
    // .then(user=>{
    //     if(user) 
    //     {
            // Show.findOne({title:req.body.show_title})
            // .then(show=>{
            //     Watchlist.findOneAndUpdate({title:req.body.watchlist_title}, {$push:{shows:show._id}})
            //     // Show.updateOne({_id:show._id, }, {$push: {links:platform._id}});  .send("Show added")
            //     .then(res.json)
            //     .catch(err=> res.json(err));
            // })
            // .catch(err=> res.json(err));
    //     }
    // })
    // .catch(err=>res.json(err))

    Show.findOne({title:req.body.show_title})
    .then(show => {
        Watchlist.findOneAndUpdate({title:req.body.watchlist_title}, {$push:{shows:show._id}})
        .then(res.json("Show added"))
        .catch(err=> res.json(err));
    })
    .catch(err=> res.json(err));
})

//delete a show from the watchlist
router.route('/removeShow').delete((req, res) => {
    User.findOne({token: req.body.token})
    
    .then(user=>{
        if(user) 
        {
            show.findOne({title:req.body.show_title})
            .then(show=>{
                Watchlist.findOneAndUpdate({title:req.body.watchlist_title, admins: {$in:[user._id]}}, {$push:{shows:show._id}})
                .then(res.json.send("Show deleted"))
                .catch(err=> res.json(err));
            })
            .catch(err=> res.json(err));
        }
    })
    .catch(err=>res.json(err))
})

module.exports = router;