let Platform = require('../models/platform.model');
let Show = require('../models/show.model');
const mongoose = require('mongoose');

/*  To use this function, make sure the parameters are as follows:
        anime_list - [{title:<string>}] - Later this can include genre and stuff like that, so for scalability
        this is an array of objects instead of an array of strings.
        target_platform = {websiteName:<string>, link:<string>} 
    How to import: var US = require('./updateServer.js');
    Example of use: 
        let ridaas_anime_list = [{title:"My Hero Academia"}, {title:"Naruto"}, {title:"JoJo's Bizzare Adventure"}];
        let ridaas_target_platform = {websiteName:"Crunchy Roll", "www.crunchyroll.com"};
        
        US.updateServer(ridaas_anime_list, ridaas_target_platform);
*/      
let updateServer = async (anime_list, target_platform) => {
        try {
        let platform = await Platform.findOne({websiteName:target_platform.websiteName});
        //console.log(`findOne success--> ${platform}`);
        if(!platform) {
            try {
                //console.log('no platform found, creating new');
                const newPlatform = new Platform(target_platform);
                let savedPlatform = await newPlatform.save(); // Not sure if this is async, so there might be an error from immediately trying to use this platform.
                platform = savedPlatform;
            } catch (error) {
                console.log(`save platform error--> ${error}`);
            }
        }
        else {  //check for any titles no longer available on the platform
            try {
                var plat_id = platform._id;
                let shows = await Show.find({links: plat_id});
                if (shows) {
                    if (shows.length > 0) {
                        shows.forEach(current_show => {
                            // console.log('inside delete loop');
                            var contains = anime_list.some(({title}) => title === current_show.title);
                            if (!contains) {
                                //console.log('inside contains');
                                if (current_show.links.length > 1) {
                                    Show.updateOne({_id: current_show._id}, {$pull: {links:plat_id}}).catch(
                                    err => console.log(`Error pulling platfrom from array: ${err}`)
                                    );
                                }
                                else {  //only has one link which will be deleted so delete show entirely 
                                    //console.log('inside only 1 link');
                                    Show.findByIdAndDelete(current_show._id).catch(
                                   // res => console.log(`deleted document`),
                                    err => console.log(`Something went wrong: ${err}`)
                                    );
                                }
                            }   
                        });
                    }
                }
            } catch (error) {
                console.log(`find all shows error --> ${error}`);
                return error;
            }
        }
        
        for(anime of anime_list) {
            //console.log('inside for loop');
            //console.log(anime.title);
            try {
                console.log(anime.title);
                let show = await Show.findOne({title:anime.title});
                //console.log(`findOne show success--> ${show}`);
                if (!show) {
                    try {
                        //console.log('no show found, creating new');
                        const newShow = new Show({
                            title: anime.title,
                            links: [platform._id]
                            // icon: anime.title
                            //need to add icon
                        });
                        let savedShow = await newShow.save()
                        show = savedShow;
                        //console.log('after saving show');
                    } catch (error) {
                        console.log(`save show error--> ${error}`);
                    }
                }
                else {
                   // console.log('show exists');
                    if (show.links) {
                        //console.log('if data has links');
                        if(!show.links.includes(platform._id)){ // This show exists, so check if this platform is already there,
                           // console.log('inside show doesnt contain patform id');
                            try {
                                let updatedShow = await Show.updateOne({_id:show._id, }, {$push: {links:platform._id}});
                               // console.log(`updateone show success--> ${updatedShow}`);
                            } catch(error) {
                                console.log(`updateOne show error--> ${error}`);
                                return error; 
                            }
                        }
                    }
                    else {
                        //console.log('if data has no links');
                        try {
                                let updatedShow1 = await Show.updateOne({_id:show._id, }, {$set: {links:[platform._id]}});
                              //  console.log(`updateone show success--> ${updatedShow1}`);
                            } catch(error) {
                                console.log(`updateOne show error--> ${error}`);
                                return error; 
                            }
                    }
                }
            } catch(error) {
                console.log(`findOne show error--> ${error}`);
                return error;
            }
        }
        //return data;
    } catch (error) {
        console.log(`findOne platform error--> ${error}`);
        return error;
    }
}

module.exports.updateServer = updateServer;