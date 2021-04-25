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
        required: true
        // unique: true
    },

    profilePic: {
        type:String,
    },
    
    bio: {
        type:String
    },

    token: 
    {
        type: String,
        unique: true,
        sparse: true
    },

    watchlists: [
        {
            type: Schema.Types.ObjectId, 
            ref:'Watchlist', 
            required: false
        }
    ],

    linkedAccounts: [ //may not use this right away
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
                    type: String,
                    required: true,
                }

            }),
            required: false
        }
    ]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;