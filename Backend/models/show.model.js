const { interfaces } = require('mocha');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ShowSchema = new Schema({

title: {
    type:String,
    unique: true,
    required: true
},

links:[{type: Schema.Types.ObjectId, ref:'Platform', required: true}],

description:{type:String},

icon: {type: String}, // Not required because we may not find one. Not Unique because two platforms may use different names for the same anime.

});

const Show = mongoose.model('show',ShowSchema);
module.exports = Show;