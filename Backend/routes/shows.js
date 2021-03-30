const router = require('express').Router();
let Show = require('../models/show.model');
let {checkFunimation} = require('../scraper/checkFunimation');
let crunchyroll = require('../scraper/crunchyroll')
let {mhtmlScrape} = require('../scraper/general');
const paginate = require('express-paginate');

router.post('/', async (req, res, next) => {

    let query = req.body.search_str ? {title: {$regex: req.body.search_str}} : {}; 

    try {
        console.log(req.body)
        const [ results, itemCount ] = await Promise.all([
        Show.find(query)
            
        .limit(req.query.limit).skip(req.skip).lean().exec(),
        Show.count({})
        ]);
        
        const pageCount = Math.ceil(itemCount / req.query.limit);
        
        if (req.accepts('json')) {
            res.json({
              object: 'list',
              has_more: paginate.hasNextPages(req)(pageCount),
              data: results,
              count:pageCount
            });
          } else {
            res.render('shows', {
              shows: results,
              pageCount,
              itemCount,
              pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
            });
          }
     
    }
    catch (err) {
        next(err);
      }

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
    res.json(mhtmlScrape(req.body.html, req.body.phase, "crunchyroll"));
})

router.route('/funimation').post((req,res) => {
    res.json(checkFunimation(req.body.mhtml));
})


module.exports = router;