require('dotenv').config({path: __dirname + '/.env'})
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
let scraper = require('./scraper/mal');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use( express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  // .then(()=> app.listen(port, () => {console.log(`Server is running on port: ${port}`)}))
  .catch((error) => console.log("Error: " + error.message));

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//first route
const showRouter = require('./routes/shows');
const platformRouter = require('./routes/platform');

app.use('/shows', showRouter);
app.use('/platforms', platformRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});

module.exports = server;
