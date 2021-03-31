const schedule = require('node-schedule');
const fs = require('fs');

const funimation = require("./funimation");
const netflix = require("./netflixScraper");
const prime = require("./primeScraper");
const mal = require("./mal");


let scrape = () => {
    fs.readFile('Backend/scraper/last-scraped.txt', 'utf8', (err, data) => {
        cur_time = Date.now()
        if(err || new Date(data) - cur_time >= 86100000){ //One day - 5 min
            
            funimation.main();
            netflix.main();
            prime.scraper(); 
            mal.scrape();
            
            fs.writeFile('Backend/scraper/last-scraped.txt', cur_time, function (err) {
                if (err) 
                    error = err;
                else
                    console.log('\n~~~ Finished Scraping ~~~\n');
            });
        }
    });
    
}



exports.scrape = ()=>{
    scrape();
    schedule.scheduleJob('0 0 * * *', () => {// run everyday at midnight
        scrape();
    });
}