const router = require('express').Router();
let Watchlist = require('../models/watchlist.model');
let Show = require('../models/show.model');
let User = require('../models/user.model');
const {v4:uuidv4} = require( "uuid");
const mongoose = require('mongoose');
const { useReducer } = require('react');
const { errors } = require('puppeteer');

//get all watchlists 
router.route('/').get((req, res) => {
    Watchlist.find()
    .then(watchlists => res.json(watchlists))
    .catch(err => res.statusCode);
});

router.route('/:username').get((req, res) => {
    const username = req.params.username;
    console.log('inside get by user ' + username);
    if (username) {
        User.findOne({username: req.params.username})
        .then(user=>{
            if(user)
            {
                Watchlist.find({"permissions.editors": user._id})
                .populate({path: "shows", model: Show})
                .exec(function (err, watchlists) {
                if (err) {res.json({Error: err})}
                else {
                    res.json(watchlists)
                    }
                })
            }
            else {
                return res.status(400).json({error: "User not logged in"});
            }
        })
        .catch(err => res.json(err));
    }

});

//add watchlist 
router.route('/add').post((req, res) => {
    const title = req.body.title;
    const token = req.body.token;
    if (token) {
        User.findOne({token: req.body.token})
        .then(user=>{
            if(user)
            {
                const newWatchlist = new Watchlist({
                    title
                });
                newWatchlist.timestamp = Date.now;
                newWatchlist.id = uuidv4();
                newWatchlist.permissions.editors.push(user._id);
                newWatchlist.save()
                .then((response) => {
                    user.watchlists.push(response._id);
                    user.save().then(()=>res.json('Watchlist added for user')).catch(err => res.status(400).json('User Save Error: ' + err));
                    //res.json('Watchlist added!');
                })
                .catch(err => res.status(400).json('Watchlist Save Error: ' + err));
            }
            else {
                return res.status(400).json({error: "User not logged in"});
            }
        })
        .catch(err => res.json(err));
    }
    else {
        return res.status(400).json({error: "User not logged in"});
    }
    
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

//add a show to the watchlist
router.route('/addShow').post((req, res) => {
    const token = req.body.token; //extra check to make sure user is logged in
    console.log(token);
    console.log(req.body.show_title);
    console.log(req.body.id);
    if (token) {
        console.log("has token");
    User.findOne({token: req.body.token})
    .then(user=>{
        if(user) 
        {
            console.log("has user")
            Show.findOne({title:req.body.show_title})
            .then(show => {
                Watchlist.findOne({id:req.body.id})
                .then(watchlist => {
                        if(watchlist)
                        {
                            console.log("has watchlist")
                            if(watchlist.shows)
                            {
                                console.log("has shows")
                                if(!watchlist.shows.includes(show._id))
                                {
                                    console.log("show is being added to watchlist")
                                    Watchlist.findOneAndUpdate({id:req.body.id, "permissions.editors": user._id}, {$push:{shows:show._id}})
                                    .then(res.json("Show added"))
                                    .catch(err=> res.json(err));
                                }
                                else 
                                {
                                    console.log("show is already in watchlist")

                                    res.json.send()
                                }
                            }
                        }
                    })
                .catch(err => res.json(err));
            })
            .catch(err=> res.json(err));
        }
        else {
            return res.status(400).json({error: "User not logged in"});
        }
    })
    .catch(err=>res.json(err))
    }
    else {
        return res.status(400).json({error: "User not logged in"});
    }
})

//delete a show from the watchlist
router.route('/removeShow').post((req, res) => {
    const token = req.body.token;
    if (token) {  
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
                                Watchlist.findOneAndUpdate({id:req.body.id, "permissions.editors": user._id}, {$pull:{shows:show._id}})
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
        else {
            return res.status(400).json({error: "User not logged in"});
        }
    })
    .catch(err=>res.json(err))
    }
    else {
        return res.status(400).json({error: "User not logged in"});
    }
})
//delete specific watchlist 
router.route('/:id').post((req, res) => {
    const token = req.body.token;
    if (token) {
        User.findOne({token: req.body.token})
        .then(user=>{ 
            if (user) {
                console.log('inside user' + user.username);
                //var index = user.watchlists.indexOf(req.body._id);  //pass in _id in body and id in params
                //if (index != -1) {    //if current user is the owner of this list

                    Watchlist.findOneAndDelete({id: req.params.id})
                    .then((response) => {
                        if (response) {
                            console.log('inside response');
                            console.log(response);
                            res.json('Watchlist deleted.'); 
                            //user.watchlists.splice(index, 1);
                            //user.save().then(()=>res.json('Watchlist removed for user')).catch(err => res.status(400).json('Error: ' + err));
                        }
                        else {
                            return res.status(400).json({error: "Watchlist not found"});
                        } 
                    })
                    .catch(err => res.status(400).json(err));
               /* }
                else {
                    return res.status(400).json({error: "Cannot remove the watchlist if you are not the owner"});
                } */
            }
            else {
                return res.status(400).json({error: "User not logged in"});    
            }
        })
        .catch(err => res.json(err));
    }
    else {
        return res.status(400).json({error: "User not logged in"}); 
    }
});

module.exports = router;