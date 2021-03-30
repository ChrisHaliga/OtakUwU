let main = () => {
const request = require('request');
const cheerio = require('cheerio');
const US = require('./updateServer.js');

var url = 'https://www.netflix.com/browse/genre/7424?so=az';

var customHeaderRequest = request.defaults({
    headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'}
})

customHeaderRequest.get(url, function(err, resp, body) {
    if (!err && resp.statusCode==200) {
        //console.log('inside netflix scraper');
        var $ = cheerio.load(body);
        var titles = [];
        links = $('.nm-collections-title-name');
    
        $(links).each(function(i, link) {
            var current = ($(link).text());
            var contains = titles.some(({title}) => title === current);
            if (!contains) {
                titles.push({title: current});
            }
        });
        //console.log(titles);
        //console.log(JSON.stringify(titles, null, 4));
        const platform = {
            websiteName:'Netflix', 
            link:'https://www.netflix.com/',
            icon: 'Netflix'
        };
        US.updateServer(titles, platform);
    }
    else {
        console.log('error');
        console.log(err);
    }
});
}

module.exports.main = main;