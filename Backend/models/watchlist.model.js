const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WatchListSchema = new Schema({
 
    id: {
        type:Integer,
        required: true,
        unique: true
    },
    title: {
        type:String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    shows:[{type: Schema.Types.ObjectId, ref:'Show', required: true}],
    permissions: {     // object with lists of users with  admin,editor,viewer permissions
    admins: [User],
    editors:[User],
    viewers:[User]
   }

   });



    const WatchList = mongoose.model('Watchlist',WatchListSchema);
    module.exports = WatchList;