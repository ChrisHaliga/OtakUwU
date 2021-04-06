const puppeteer = require('puppeteer');
const US = require('./updateServer.js');

let main = (async () => {
   // console.log('studio!!!!');
    const browser = await puppeteer.launch({defaultViewport: null });
    const page = await browser.newPage();
    await page.setViewport( { width: 1920, height: 100000 } );
    const url = 'https://play.hbomax.com/page/urn:hbo:page:studio-ghibli';
    await page.goto(url, {waitUntil: 'networkidle2'});
    
    var titles = [];
    const urls = await page.evaluate(
        () => Array.from(
            document.querySelectorAll('a.default.class2.class3'),
            a => a.getAttribute('aria-label')
        )
    );
    if (urls.length > 0) {
        urls.forEach((item) => {
            if (item != null) {
                titles.push({
                    title: item
                });
            }
        });
    }
    await browser.close();
    
    const platform = {
        websiteName:'HBO Max', 
        link:'https://www.hbomax.com/',
        icon: 'HBOMax'
    };
    //console.log(titles);
    //return titles;
    US.updateServer(titles, platform);

});

module.exports.main = main;