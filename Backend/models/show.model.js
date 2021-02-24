const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ShowSchema = new Schema({

title: {
    type:String,
    required: true
},

links:[ 
    {
        platform: {type: Schema.Types.ObjectId, ref:'Platform', required: true}
    }
],
icon: // This is the path to an image located somewhere in a folder in backend
{
    type: String,
    required: true,
    unique: true,
}

});

const Show = mongoose.model('show',ShowSchema);
module.exports = Show;