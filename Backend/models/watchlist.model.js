const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WatchlistSchema = new Schema({

    id: {
        type: String,
        required: true,
    },
    title: {
        type: String, required: true
    },
    public:{
        type: Boolean, required: false
    },
    shows:[{type: Schema.Types.ObjectId, ref:'Show', required: true}],
    permissions: {     // object with lists of users with editor, viewer permissions
    editors:[{type: Schema.Types.ObjectId, ref:'User', required: true}],
    viewers:[{type: Schema.Types.ObjectId, ref:'User', required: true}]
   }

   });

    const Watchlist = mongoose.model('Watchlist',WatchlistSchema);
    module.exports = Watchlist;