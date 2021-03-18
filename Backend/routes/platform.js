const router = require('express').Router();
let Platform = require('../models/platform.model');

//get all platforms http://localhost:3001/platforms/
router.route('/').get((req, res) => {
    Platform.find()
    .then(platforms => res.json(platforms))
    .catch(err => res.statusCode);
    // .catch(err => res.status(400).json('Error: ' + err));
    // res.render('Platforms');
});

//add platform http://localhost:3001/platforms/add/
router.route('/add').post((req, res) => {
    const websiteName = req.body.websiteName;
    const link = req.body.link;
    const icon = req.body.icon;

    const newPlatform = new Platform({
        websiteName,
        link,
        icon,
    });
    newPlatform.timestamp = Date.now;
    
    newPlatform.save()
    .then(() => res.body.json('Platform added!'))
    .catch(err => res.status(400).json('Error: ' + err));

});

router.route('/:websiteName').get((req, res) => {
    Platform.findOne({websiteName: req.params.websiteName})
      .then(platform => res.json(platform))
      .catch(err => res.status(400).json('Error: ' + err));
  });

//get specific platform http://localhost:3001/platforms/{id}
router.route('/:id').get((req, res) => {
    Platform.findById(req.params.id)
      .then(platform => res.json(platform))
      .catch(err => res.status(400).json('Error: ' + err));
  });

//update specific platform http://localhost:3001/platforms/update/{id}
router.route('/update/:id').post((req, res) => {
    Platform.findById(req.params.id)
    .then(platform => {
      platform.websiteName = req.body.websiteName;
      platform.link = req.body.link;
      platform.icon = req.body.icon;
      platform.timestamp = Date.now;

      platform.save()
        .then(() => res.body.json('Platform updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
//delete specific platform http://localhost:3001/platforms/{id}
router.route('/:id').delete((req, res) => {
    Platform.findByIdAndDelete(req.params.id)
    .then(() => res.body.json('Platform deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;