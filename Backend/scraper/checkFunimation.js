var cheerio = require('cheerio');

module.exports = mhtml =>{
    var $ = cheerio.load(mhtml);
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
    return titles.length;
}