const fs = require('fs');
let Show = require('../models/show.model');
const { exit } = require('process');

const crunchyroll = {
    websiteName:"crunchyroll", 
    _id:"605e4280f80821d95ff291d9", 
    start_delim:`mediaTitle&quot;:&quot;`, 
    end_delim:`&quot;,`
}

const funimation = {
    websiteName:"funimation", 
    _id:"605e4280f80821d95ff291d9", 
    start_delim:`class="text-link ellipsis">`, 
    end_delim:`</a>`
}

function clean(str) {
    str = str.split("amp;").join("").split("&quot;").join( "\"").split("=E2=80=99").join("\'").split("  ").join("")
    .split("\" ").join("\'").split("=3D\"\'").join(" ").split('\\').join("").split("u2010").join("-").split("u2161").join("2")
    .split("u2019").join("\'").split("=E2=80=93").join("-").split("=3D").join("=").split("=EF=BC=8A").join(" * ").split("=E2=99=A5").join(" ")
    .split("=E2=80=A6").join("...").split("=E2=80=94").join("-").split("=E2=80=9C").join("\"").split("=E2=80=9D").join("\"");
    
    return str.substring(str[0]==" "?1:0, str[-1]==" "?-1:str.length);
}

exports.mhtmlScrapeAnime = (html, phase, page, platform) => {

    switch(platform){
        case "crunchyroll": platform = crunchyroll; break;
        case "funimation": platform = funimation; break;
    }

    let error = 0;
    if(phase == "start" ){
        fs.writeFile(`Backend/scraper/lists/${platform.websiteName}${page>1?`_${page}`:""}.tmp`, html, function (err) {if (err) error = err;});
    }
    else{
        fs.appendFile(`Backend/scraper/lists/${platform.websiteName}${page>1?`_${page}`:""}.tmp`, html, function (err) {if (err)error = err;});
    }
    if(phase == "finish"){
        fs.readFile(`Backend/scraper/lists/${platform.websiteName}${page>1?`_${page}`:""}.tmp`, "utf-8", (err, data) => {
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
                anime = clean(anime.split(platform.end_delim)[0]);
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
            
            fs.writeFile(`Backend/scraper/lists/${platform.websiteName}${page>1?`_${page}`:""}.list`, my_list.join('\n'), function (err) {
                if (err) error = err;
                console.log('finalizing');
                fs.unlink(`Backend/scraper/lists/${platform.websiteName}${page>1?`_${page}`:""}.tmp`,function(err){
                    if(err) error =err;
                    console.log("done.");
                });
            });
        });
    }
    return({"response":"", "error": error});
}

exports.mhtmlScrapeContent = (html, phase, page, platform) => {
    let error = 0;
    html = clean(html.replace(/=(\r\n|\n|\r)/gm, ""));

    if(phase == "start" ){
        fs.writeFile(`Backend/scraper/html/info_${page}.html`, html, function (err) {
            if (err) error = err;
        });
    }
    else{
        fs.appendFile(`Backend/scraper/html/info_${page}.html`, html, function (err) {
            if (err) error = err;
        });
    }
    if(phase == "finish"){
        fs.readFile(`Backend/scraper/html/info_${page}.html`, "utf-8", (err, data) => {
            animes = data.split(`</li><li data-type="anime'data-id=`).slice(1); //cuts out the garbage before the anime
            
            my_list = []; //Where the finished list will go

            for(anime of animes){

                let name = description = image = anime;
                if(name.includes(`<h5 class='theme-font'>`)){
                    name = name.split(`<h5 class='theme-font'>`)[1].split(`</`)[0];
                    if(description.includes(`</li></ul><p>`)){
                        description = description.split(`</li></ul><p>`)[1].split(`</`)[0];
                        if(description.includes("https://www.anime-planet.com/") || description.includes("This entry currently doesn't have a synopsis. Check back soon!") || description.length > 1000)
                            description = "No Description";
                    }    
                    else
                        description = "No Description";
                    if(image.includes(`'data-src="`))
                        image = "https://www.anime-planet.com" + image.split(`'data-src="`)[1].split(`'`)[0];
                    else
                        image = null;
                    my_list.push({"title":name, "description": description, "icon":image});
                }
                else
                    console.log(`Error: Name Token on Page: ${page}`);                              
            }
                
            
            /* let save = (list, j_init) => {
                if(list.length < 1) return; //Finish

                Show.find({ $query: {}, $orderby: {title : -1} })
                .then(shows => {
                    if(shows){
                        for(let i = 0; i < list.length; i++){
                            for(let j = j_init; j < shows.length; j++){
                                if(list[i].title.includes(shows[j].title)){
                                    Show.findByIdAndUpdate(shows[j]._id, {$set:{description:list[i].description, icon:list[i].icon}})
                                    .then(() => {console.log(`Updated ${shows[j].title}'s description and icon.`); save(list.slice(i), j);})
                                    .catch(err=>console.log(err));
                                }
                                if(list[i].title.localeCompare(shows[j].title) < 0) break;
                            }
                        }
                    }
                })
                .catch(err=>console.log(err));
            }

            save(my_list, 0); //Start */
            
            fs.writeFile(`Backend/scraper/lists/info/info_${page}.list`, `${my_list.map(l =>`${l.title}>:|:<${l.description}>:|:<${l.icon}`).join('|||||')}]`, function (err) {
                if (err) error = err;
                /* fs.unlink(`Backend/scraper/info_${page}.tmp`,function(err){
                    if(err) error =err;
                    console.log("done.");
                }); */
            });
        });
    }
    return({"response":"", "error": error});
}

exports.updateDatabase = ()=>{
    let list = [];
    fs.readdir('Backend/scraper/lists/info/', (err, files) => {
        console.log(files)
        if(!err){
            let i = 0
            function doFile(files_left){
                if(!files_left.length)
                    return;
                console.log(files_left[0]);
                fs.readFile(`Backend/scraper/lists/info/${files_left[0]}`, "utf-8", (err, data) => {
                    if(!err){
                        let issues = false;
                        data = data.split("|||||")
                        let i = 0;
                        data = data.map(show => {
                            show = data[i].split(">:|:<");
                            if(show.length != 3){
                                issues = true;
                                return null;
                            }

                            let set = {"description": show[1]}
                            if(show[2] != "https://cdn.anime-planet.com/images/anime/default/default-anime-spring.png")
                                set = {"description": show[1], "icon": show[2]};

                            return {updateOne: {
                                "filter" : { "title" : show[0] },
                                "update" : { $set : set }
                            }}
                        }).filter(show => {return show != null});
                        
                        Show.bulkWrite(data)
                        .then(ret => {
                            if(ret)
                                console.log(`Bulk Wrote ${files_left[0]} to database.`);
                            if(!issues){
                                fs.unlink(`Backend/scraper/lists/info/${files_left[0]}`,function(err){
                                    if(err) console.log(`\nError occured attempting to delete ${files_left[0]}\n`);
                                });
                            }
                        })
                        .catch(err=> {console.log("Error bulk updating shows.");issues = true;})
                        .finally(() => {doFile(files_left.slice(1))})
                    }
                    else
                        console.log(`Scraping Error: Issue reading file ${files[i]}.`)
                })
            }
            doFile(files);
        }
        else
            console.log("Scraping Error: Issue reading directory.")
    })
    

}