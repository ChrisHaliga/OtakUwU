const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    username: {
        type:String,
        required: true,
        unique: true
    },

    email: { //authentication
        type:String,
        required: true,
        unique: true
    },

    password: {
        type:String,
        required: true,
        unique: true
    },

    profilePic: {
        type:String,
    },

    watchlists: [
        {
            type: Schema.Types.ObjectId, 
            ref:'Watchlist', 
            required: false
        }
    ],

    linkedAccounts: [
        {
            type: new Schema({ //schema for linked account
                site: { // 
                    type: String,
                    required: true
                },
            
                username: {
                    type: String,
                    required: true,
                },
                password: {

                }

            }),
            required: false
        }
    ]
});

const User = mongoose.model('user', UserSchema);
module.exports = User;