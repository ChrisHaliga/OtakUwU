let Platform = require('../models/platform.model');
let Show = require('../models/show.model');

/*  To use this function, make sure the parameters are as follows:

        anime_list - [{title:<string>}] - Later this can include genre and stuff like that, so for scalability
                                          this is an array of objects instead of an array of strings.
        target_platform = {websiteName:<string>, link:<string>} 


    How to import: import { updateServer } from "updateServer";

    Example of use: 
        let ridaas_anime_list = [{title:"My Hero Academia"}, {title:"Naruto"}, {title:"JoJo's Bizzare Adventure"}];
        let ridaas_target_platform = {websiteName:"Crunchy Roll", "www.crunchyroll.com"};
        
        updateServer(ridaas_anime_list, ridaas_target_platform);
*/      

let updateServer = (anime_list, target_platform) => {
    
    Platform.findOne({websiteName:target_platform.name})
    .then(platform => {
        if(!platform){
            const newPlatform = new Platform(target_platform);
            newPlatform.save() // Not sure if this is async, so there might be an error from immediately trying to use this platform.
        }
        for(anime of anime_list){
            Show.findOne({title:anime.title})
            .then(show => {
                if(!show){ // If the show isn't in the db, make it
                    const newShow = new Show({
                        title: title,
                        link: [platform._id]
                    });
                    newShow.save()
                }
                else{
                    if(!show.links.includes(platform._id)){ // This show exists, so check if this platform is already there,
                        Show.updateOne({_id:show._id, }, {$push: {links:platform._id}}) // and if it is, push this platform into the links array.
                        .catch(err => console.log("Error: Issue updating show."))
                    }
                }
            })
            .catch(err => console.log("Error: Issue finding or saving show."))
        }
    })
    .catch(console.log("Error: Issue finding or saving platform."))
}

module.exports.updateServer = updateServer;