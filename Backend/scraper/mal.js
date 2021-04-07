'https://www.anime-planet.com/anime/all?sort=title&order=asc&page=1'
const request = require('request');
const cheerio = require('cheerio');
let Show = require('../models/show.model');




var customHeaderRequest = request.defaults({
    headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'}
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let getimg = (shows)=> {
    if(shows.length < 1) {
        console.log("Finished Scraping My Anime List.");
        return;
    }
    if(!shows[0].icon || !shows[0].icon.includes("http")){
        async function connect(){
          await sleep(30000);
          let title = shows[0].title;
          let url = 'https://myanimelist.net/search/all?q=' + (title.split(" ").join("%20")) + '&cat=all';
          customHeaderRequest.get(url, function(err, resp, body) {
              if (!err && resp.statusCode==200) {
                  const $ = cheerio.load(body);          
                  const icon = $('article').find("img").attr("data-src");
                  if(icon){
                    Show.updateOne({title:title},{icon:icon})
                    .then(succ => console.log(`MAL: ${title} updated.`))
                    .catch(err => console.log(`Error occured updating '${shows[0].title}'${err}`));
                  }
              }
          });
        }
        connect();
    }
    
    getimg(shows.slice(1));
    
}
exports.scrape = () =>{
    Show.find()
    .then(shows => {
        console.log("Starting Scraping My Anime List.")
        getimg(shows);
    })
    .catch(err => console.log(err));  

}
   /* const $ = cheerio.load(body);
     links = $('.cardName');
    $(links).each(function(i, link){
      console.log($(link).text());/
   // });
    //links = $('a');
   // console.log(($('.caption', body).text()));
  }
  else {
    console.log('error');
    console.log(err);
  }
});
  /for (var i = 2; i < 5 ; ++i) {
    var url1 = 'https://www.anime-planet.com/anime/watch-online/?page=' + i;
    customHeaderRequest.get(url1, function(err, resp, body) {
  if (!err && resp.statusCode==200) {
    console.log('success');
    //console.log(body);
    const $ = cheerio.load(body);
     links = $('.cardName');
    $(links).each(function(i, link){
      console.log($(link).text());
    });
    //links = $('a');
   // console.log(($('.caption', body).text()));
  }
  else {
    console.log('error');
    console.log(err);
  }
});
  }*/