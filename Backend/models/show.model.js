const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({websiteName : String, link : String});
const ShowSchema = new Schema({

title: {
    type:String,
    required: true

},
links:[LinkSchema],
icon:{
    data:Buffer,
    contentType:String
}

});

const Show = mongoose.model('show',ShowSchema);
module.exports = Show;