const router = require('express').Router();
let Watchlist = require('../models/watchlist.model');
let Show = require('../models/show.model');
let User = require('../models/user.model');
const {v4:uuidv4} = require( "uuid");
const mongoose = require('mongoose');
const { useReducer } = require('react');

//get all watchlists 
router.route('/').get((req, res) => {
    Watchlist.find()
    .then(watchlists => res.json(watchlists))
    .catch(err => res.statusCode);
});

//add watchlist 
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
            newWatchlist.id = uuidv4()

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
    User.findOne({token: req.body.token})
     .then(user=>{
        if(user) 
         {
            Show.findOne({title:req.body.show_title})
            .then(show => {
                Watchlist.findOne({id:req.body.id})
                .then(watchlist => {
                        if(watchlist)
                        {
                            if(watchlist.shows)
                            {
                                if(!watchlist.shows.includes(show._id))
                                {
                                    Watchlist.findOneAndUpdate({id:req.body.id, editors: {$in:[user._id]}}, {$push:{shows:show._id}})
                                    .then(res.json("Show added"))
                                    .catch(err=> res.json(err));
                                }
                                else 
                                {
                                    res.json.send()
                                }
                            }
                        }
                    })
                .catch(err => res.json(err));
            })
            .catch(err=> res.json(err));
         }
     })
    .catch(err=>res.json(err))
})

//delete a show from the watchlist
router.route('/removeShow').post((req, res) => {
    User.findOne({token: req.body.token})
    .then(user=>{
        if(user) 
        {

        Show.findOne({title:req.body.show_title})
        .then(show => {
            Watchlist.findOne({id:req.body.id})
            .then(watchlist => {
                    if(watchlist)
                    {
                        if(watchlist.shows)
                        {
                            if(watchlist.shows.includes(show._id))
                            {
                                Watchlist.findOneAndUpdate({id:req.body.id}, {$pull:{shows:show._id}})
                                .then(res.json("Show removed"))
                                .catch(err=> res.json(err));
                            }
                            else 
                            {
                                res.json.send()
                            }
                        }
                    }
                })
            .catch(err => res.json(err));
        })
        .catch(err=> res.json(err));
        }
    })
    .catch(err=>res.json(err))
})

module.exports = router;