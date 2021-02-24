const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ShowSchema = new Schema({

title: {
    type:String,
    required: true
},

links:[ // I think its standard practice to seperate models into their own files, but if that worked, we can use it instead.
    {
        platform: {type: Schema.Types.ObjectId, ref:'Platform', required: true}
    }
],

icon:{          // It might be better to make this a string that represents the path to this image stored here on the server (not in database).
    data:Buffer,// Images are large and will slow down querying.
    contentType:String
}

});

const Show = mongoose.model('show',ShowSchema);
module.exports = Show;