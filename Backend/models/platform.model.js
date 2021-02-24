const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlatformSchema = new Schema({

    websiteName: 
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
    icon: 
{
    type: String,
    required: true,
    unique: true,
}

 },{timestamps: true});

const Platform = mongoose.model('Platform', PlatformSchema);
module.exports = Platform;