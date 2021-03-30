const puppeteer = require('puppeteer');
const US = require('./updateServer.js');
let main = (async () => {
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
            titles.push({
                title:  item
            });
        });
    }
    // page.$$('a.default.class2.class3').then((urls) => {
    await page.screenshot({ path: 'amazonpage1.png' });
    await browser.close();
    
    const platform = {
        websiteName:'HBO Max', 
        link:'https://www.hbomax.com/',
        icon: 'HBO Max'
    };
    console.log(titles);
    US.updateServer(titles, platform);

})();

module.exports.main = main;