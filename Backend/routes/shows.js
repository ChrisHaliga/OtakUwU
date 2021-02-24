const router = require('express').Router();
let Show = require('../models/show.model');

router.route('/').get((req, res) => {
    Show.find()
    .then(shows => res.json(shows))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const title = "Hunter x Hunter";
    const link = "";
    const icon = "";
    const newShow = new Show({
        title,
        link,
        icon,
    });

    newShow.save()
    .then(() => res.json('Show added'))
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;