const router = require('express').Router();
let Show = require('../models/show.model');

router.route('/').get((req, res) => {
    // res.send("Hello");
    Show.find()
    .then(shows => res.json(shows))
    .catch(err => res.status(400).json('Error: ' + err));
});

//route to add shows 
// router.route('/add').post((req, res) => {
    //hardcoded variables (not to actually be used!)
//     const title = "Hunter x Hunter";
//     const link = "";
//     const icon = "../testdata/IMG_5897.jpeg";
//     const newShow = new Show({
//         title,
//         link,
//         icon,
//     });

//     newShow.save()
//     .then(() => res.json('Show added'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });


module.exports = router;