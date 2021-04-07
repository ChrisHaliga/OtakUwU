const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const fs = require('fs');
const US = require('./updateServer.js');
var numericalRegex = '^(0|[1-9][0-9]*)$'
const anime_titles = [];

const scrape = (($) => 
{
    // scrape
    // Get first search result
    var search_res = $('.s-result-item').html();
    // console.log(`First search result: ${search_res}`)
    if (search_res !== undefined)
    {
        //on each page, get search results
        //for each search result
        $('.s-result-item').each(
            function (i, element) {
                //get child link
                var title = $(this).find($('.a-size-medium')).html();
                
                // if name already exists in Amazon
                // technically not necessary
                if (anime_titles.includes(title))
                {
                    // some animes have the same name but are different versions, so getting the year
                    var year_div = $(this).find($('div .a-color-secondary'));
                    if (year_div != undefined)
                    {
                        var year = $(year_div).children().first().text();
                        title = title + year;
                        // title = `${title} (${year})`;
                    }
                }

                i++;
                if (title != null)
                {
                    if (!anime_titles.includes(title))
                    {
                        anime_titles.push({
                            title: title.replace(/(\r\n|\n|\r|\t)/gm, "").trim(),
                        });
                    }

                }
                
                }
        )
        const platform = {
            websiteName:'Amazon Prime Video', 
            link:'https://www.amazon.com/gp/video/storefront/',
            icon: 'AmazonPrimeVideo'
        };

        US.updateServer(anime_titles, platform);
    }
    else {
            console.log("Unable to fetch results. Please try again!")
    }

})

let primeScraper  = () => {
    let scraper = (async () => {
        const amazonPrimeLink = "https://www.amazon.com/s?k=anime&i=instant-video&bbn=2858778011&rh=p_n_theme_browse-bin%3A2650364011%2Cp_n_ways_to_watch%3A12007865011&dc&qid=1617156936&rnid=12007862011&ref=sr_nr_p_n_ways_to_watch_1"
        var number_of_pages = 0;
        var currentPage = 0;
        try {
            const browser = await puppeteer.launch({ headless: true});
            const page = await browser.newPage();
        
            await page.goto(amazonPrimeLink, {
                waitUntil: 'domcontentloaded'
            }); //loads first page

            //load html of first page into cheerio
            content = await page.content();
            $ = cheerio.load(content);

            // get number of pages
            var pages = $('.a-disabled').last().text();
            if (pages.match(numericalRegex))
                number_of_pages = pages;
            console.log('number of pages ', number_of_pages);
            do
            {
                console.log('current page: ', currentPage);
                currentPage++;
                await Promise.all([
                    await page.waitForSelector('.a-last'), //.a-last = next button
                    content = await page.content(),
                    $ = cheerio.load(content),
                    scrape($),
                    // await page.waitForNavigation(),
                    await page.click('.a-last')
                ])
                
            } 
            while (currentPage < number_of_pages); 

            await browser.close();
        
        } catch (error)
        { 
            console.log(error);
        }
    })

scraper();
}

module.exports.main = primeScraper;
