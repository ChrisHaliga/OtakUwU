require('dotenv').config({path: __dirname + '/.env'})
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
let mal_scraper = require('./scraper/mal');
// const {scraper} = require('./scraper/primeScraper');
const parser = require('body-parser');
const paginate = require('express-paginate');


let netflixScraper = require('./scraper/netflixScraper');




const app = express();
const port = process.env.PORT || 5000;
// console.log('scraper ',scraper);
app.use(cors());
app.use( express.json());
app.use(paginate.middleware(10, 20));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  // .then(()=> app.listen(port, () => {console.log(`Server is running on port: ${port}`)}))
  .catch((error) => console.log("Error: " + error.message));

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
  // scraper.primeScraper();
  //netflixScraper.main();
})

//first route
const showRouter = require('./routes/shows');
const platformRouter = require('./routes/platform');
const userRouter = require('./routes/user');
// const watchlistRouter = require('./routes/watchlist');

app.use('/shows', showRouter);
app.use('/platforms', platformRouter);
app.use('/users', userRouter);
// app.use('/watchlists', watchlistRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});

module.exports = server;
