const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const fs = require('fs');
const US = require('./updateServer.js');

var primeScraper = (async () => {

    const amazonPrimeLink = "https://www.amazon.com/s?i=movies-tv&bbn=2958763011&rh=n%3A2958763011%2Cp_n_format_browse-bin%3A2650306011%2Cp_85%3A2470955011%2Cp_n_availability%3A8219609011&dc&qid=1616718146&rnid=8219608011&ref=sr_pg_1"

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const anime_titles = [];
    await page.goto(amazonPrimeLink, {
        waitUntil: 'domcontentloaded'
    })
    .then(() => {
        console.log("success! ")
    const content = page.content();
    content
        .then((success) => {
            // console.log("another success! ")
            const $ = cheerio.load(success)
            // console.log(cheerio.text($('body')));
                // Print the full HTML
            // console.log(`Site HTML: ${$.html()}\n\n`)

            // Get first search result
            var search_res = $('.s-result-item').html();
            console.log(`First search result: ${search_res}`)
            if (search_res !== undefined)
            {
                var number_of_results = $('a .s-result-item').length;
                console.log(number_of_results);

                //for each search result
                // var link = $('.s-result-item').children().last().html();
                // console.log(link);
                $('.s-result-item').each(
                    function (i, element) {
                        //get child link
                        var title = $(this).find($('.a-size-medium')).html();
                        
                        // if name already exists in Amazon
                        //technically not necessary
                        if (anime_titles.includes(title))
                        {
                            // some animes have the same name but are different versions, so getting the date
                            var year_div = $(this).find($('div .a-color-secondary'));
                            if (year_div != undefined)
                            {
                                var year = $(year_div).children().first().text();
                                title = `${title} (${year})`;
                            }
                        }
                        // anime_titles[i] = title;
                        console.log(title);
                        i++;
                        if (title != null)
                        {
                            anime_titles.push({
                                title: title.replace(/(\r\n|\n|\r|\t)/gm, "").trim(),
                            });
                        }
                        
                        }
                )

                console.log(anime_titles.length);
                const platform = {
                    websiteName:'Amazon Prime Video', 
                    link:'https://www.amazon.com/gp/video/storefront/',
                    icon: 'AmazonPrimeVideo'
                };
       
                anime_titles.forEach( title =>
                    console.log(title)
                )
                US.updateServer(anime_titles, platform);

                // fs.writeFile('anime_title.txt', anime_titles, function (err) {
                // if (err) return console.log(err);
                // console.log('titles > anime_title.txt');
                // });
            }
            else {
                    console.log("Unable to fetch results. Please try again!")
            }

        })
    })
    // await page.screenshot({ path: 'amazonpage1.png' });

    await browser.close();
    }
    )();

module.exports.scraper = primeScraper;