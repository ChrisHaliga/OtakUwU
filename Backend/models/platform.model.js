const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlatformSchema = new Schema({

<<<<<<< HEAD
    name: 
=======
    websiteName: 
>>>>>>> 1502c044e05209b8f5540f6bd62d0504322b7203
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
<<<<<<< HEAD

    icon: // This is the path to an image located somewhere in a folder in backend
=======
    icon: 
>>>>>>> 1502c044e05209b8f5540f6bd62d0504322b7203
    {
        type: String,
        required: true,
        unique: true,
    }

<<<<<<< HEAD
},{timestamps: true});
=======
 },{timestamps: true});
>>>>>>> 1502c044e05209b8f5540f6bd62d0504322b7203

const Platform = mongoose.model('Platform', PlatformSchema);
module.exports = Platform;