let main = () => {
	
    var cheerio = require('cheerio');
    var fs = require('fs'); 
    var US = require('./updateServer.js'); //import update server file
    //fun.html came from https://www.funimation.com/shows/all-shows/?qid=None (just the first page)
    
    fs.readFile('fun.html', 'utf8', function(err, data) {
    
        if (err) {
            console.log('error');
            console.log(err);
        }
        else {
            var $ = cheerio.load(data);
            var titles = [];
            console.log('success');
            links = $('.name a');
            $(links).each(function(i, link) {
            var splitString = ($(link).text().split(/[\r\n]+/))
            var sample = [];
            for (var i = 0; i < splitString.length; ++i) {
                sample.push(splitString[i].trim())
            }
            var trimmedTitle = sample.join(' ');
            titles.push({
                title: trimmedTitle
            });
        });
        console.log(titles.length);
        //console.log(titles[0]);
        // console.log(titles);
        const platform = {
            websiteName:'Funimation', 
            link:'https://www.funimation.com/',
            icon: 'default' //(figure out an icon to save here for the site)
        };
        var testTitles = [titles[0], titles[1], titles[2], titles[3]]; //for testing purposes i only passed in 4
        US.updateServer(testTitles, platform);
        
        }
    });
    }
    
    module.exports.main = main;