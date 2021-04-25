const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WatchListSchema = new Schema({

    title: {
        type:String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    picture: {
        type:String        
    },
    shows:[{type: Schema.Types.ObjectId, ref:'Show', required: true}],
    permissions: { // object with lists of users with admin,editor,viewer permissions
    admin: {type: Schema.Types.ObjectId, ref:'User', required: true},
    editors:[{type: Schema.Types.ObjectId, ref:'User', required: true}],
    viewers:[{type: Schema.Types.ObjectId, ref:'User', required: true}]
    }

    });



    const WatchList = mongoose.model('Watchlist',WatchListSchema);
    module.exports = WatchList;