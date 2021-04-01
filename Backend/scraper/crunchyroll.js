let {clean} = require("./general");
const fs = require('fs');

exports.scrape = (html, phase, links) => {
    let error = 0;
    if(phase == "start"){
        fs.writeFile('Backend/scraper/crunchyroll.tmp', html, function (err) {
            if (err) 
                error = err;
            else
                console.log('initializing');
        });
    }
    else if(phase == "finish"){
        fs.readFile('Backend/scraper/crunchyroll.tmp', 'utf8', (err, data) => {
            animes = data.split("<li id=3D\"media_group").slice(1);
            my_list = [];

            for(anime of animes)
                my_list.push(clean(anime));

            let save = (list) => {
                if(list.length < 1) return;
                const my_show = list[0]
                console.log(my_show);
                Show.findOne({"title":my_show})
                .then(show => {
                    if(!show){
                        const title = my_show;
                        const icon = "default";
                        
                        const newShow = new Show ({title, links, icon});
                        newShow.save()
                        .then(() => save(list.slice(1)))
                        .catch(err => console.log(err));

                    }else if(!show.links.includes(links[0])){
                        Show.findByIdAndUpdate(show._id, {$push:{links:"605e4280f80821d95ff291d9"}})
                        .then(save(list.slice(1)))
                        .catch(err=>console.log(err));
                    }else{
                        save(list.slice(1));
                    }
                })
                .catch(err=>console.log(err));
            }
            save(my_list);
            
            `fs.writeFile('Backend/scraper/crunchyroll.html', data, function (err) {
                if (err) error = err;
                console.log('finalizing');
                fs.unlink('Backend/scraper/crunchyroll.tmp',function(err){
                    if(err) return console.log(err);
                    console.log("done.");
                });
            });`
        });
    }
    else{
        fs.appendFile('Backend/scraper/crunchyroll.tmp', html, function (err) {
            if (err) 
                error = err;
            else
                console.log('appending');
        });
    }
    return({"response":"", "error": error});
}