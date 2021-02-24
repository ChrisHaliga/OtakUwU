const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlatformSchema = new Schema({

    name: 
    {
        type: String,
        required: true,
        unique: true,
    },

    link: 
    {
        type: String,
        required: true,
        unique: true,
    },

    icon: // This is the path to an image located somewhere in a folder in backend
    {
        type: String,
        required: true,
        unique: true,
    }

},{timestamps: true});

const Platform = mongoose.model('Platform', PlatformSchema);
module.exports = Platform;