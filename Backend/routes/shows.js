const router = require('express').Router();
const fs = require('fs');
let Show = require('../models/show.model');
let {checkFunimation} = require('../scraper/checkFunimation');
let crunchyroll = require('../scraper/crunchyroll')

router.route('/').get((req, res) => {
    Show.find()
    .then(shows => res.json(shows))
    .catch(err => res.status(400).json('Error: ' + err));
});

//add shows 
router.route('/add').post((req, res) => {
    const title = req.body.title; 
    const links = req.body.links;
    const icon = req.body.icon;

    const newShow = new Show ({
        title,
        links,
        icon,
    });
    newShow.timestamp = Date.now;

    newShow.save()
    .then(() => res.json ('Show added!'))
    .catch(err => res.status(400).json('Error: ' + err));

});

//get specific show 
router.route('/:id').get((req, res) => {
    Show.findById(req.params.id)
      .then(exercise => res.json(exercise))
      .catch(err => res.status(400).json('Error: ' + err));
});

//update a show
router.route('/update/:id').post((req, res) => {
    Show.findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(() => res.json('Show updated!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//delete specific show 
router.route('/:id').delete((req, res) => {
    Show.findByIdAndDelete(req.params.id)
    .then(() => res.json('Show deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/crunchyroll').post((req,res) => {
    res.json(crunchyroll(req.body.html, req.body.phase, ["605e4280f80821d95ff291d9"]));
})

router.route('/funimation').post((req,res) => {
    res.json(checkFunimation(req.body.mhtml));
})


module.exports = router;