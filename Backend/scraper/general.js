const fs = require('fs');

const crunchyroll = {
    websiteName:"crunchyroll", 
    _id:"605e4280f80821d95ff291d9", 
    start_delim:`mediaTitle&quot;:&quot;`, 
    end_delim:`&quot;,`
}

const funimation = {
    websiteName:"funimation", 
    _id:"605e4280f80821d95ff291d9", 
    start_delim:`class=3D"text-link ellipsis">`, 
    end_delim:`</a>`
}




exports.mhtmlScrape = (html, phase, platform) => {

    switch(platform){
        case "crunchyroll": platform = crunchyroll; break;
        case "funimation": platform = funimation; break;
    }

    let error = 0;
    if(phase == "start" ){
        fs.writeFile(`Backend/scraper/${platform.websiteName}.tmp`, html, function (err) {
            if (err) 
                error = err;
            else
                console.log('initializing');
        });
    }
    else{
        fs.appendFile(`Backend/scraper/${platform.websiteName}.tmp`, html, function (err) {
            if (err) 
                error = err;
            else
                console.log('appending');
        });
    }
    if(phase == "finish"){
        fs.readFile(`Backend/scraper/${platform.websiteName}.tmp`, "utf-8", (err, data) => {
            // garbage_0 <start_delim> anime_1 <end_delim> garbage_1 <start_delim> anime_2 ... <start_delim> anime_n <end_delim> garbage_n
            data = data.replace(/=(\r\n|\n|\r)/gm, "").split("\"").join("&quot;")
            animes = data.split(platform.start_delim).slice(1); //cuts out the garbage_0 makes an array of anime with end_delims and garbage
            
            /* fs.writeFile(`Backend/scraper/${platform.websiteName}.html`, data, function (err) {
                if (err) 
                    error = err;
                else
                    console.log(err);
            }); */
            
            my_list = []; //Where the finished list will go

            for(anime of animes){
                anime = anime.split(platform.end_delim)[0];
                anime = anime.split("amp;").join("").split("&quot;").join( "\"").split("=E2=80=99").join("\'").split("  ").join("")
                    .split("\" ").join("\'").split("=3D\"\'").join(" ").split('\\').join("").split("u2010").join("-").split("u2161").join("2")
                    .split("u2019").join("\'");
                anime.substring(anime[0]==" "?1:0, anime[-1]==" "?-1:anime.length);
                if(anime.length < 100) 
                    my_list.push(anime);
                else 
                    console.log("an error occured");
            }
                

            let save = (list) => {
                if(list.length < 1) return; //Finish

                const title = list[0];

                Show.findOne({"title":title})
                .then(show => {
                    if(!show){
                        console.log(`creating new show for ${title}.`);
                        
                        const newShow = new Show ({title, links:[platform._id], icon:"default"});
                        newShow.save()
                        .then(() => save(list.slice(1)))
                        .catch(err => console.log(err));

                    }else if(!show.links.includes(links[0])){
                        console.log(`Adding ${platform.websiteName} to ${title}.`);

                        Show.findByIdAndUpdate(show._id, {$push:{links:platform._id}})
                        .then(save(list.slice(1)))
                        .catch(err=>console.log(err));
                    }else{
                        save(list.slice(1));
                    }
                })
                .catch(err=>console.log(err));
            }

            save(my_list); //Start
            
            fs.writeFile(`Backend/scraper/${platform.websiteName}.list`, my_list.join('\n'), function (err) {
                if (err) error = err;
                console.log('finalizing');
                fs.unlink(`Backend/scraper/${platform.websiteName}.tmp`,function(err){
                    if(err) error =err;
                    console.log("done.");
                });
            });
        });
    }
    return({"response":"", "error": error});
}