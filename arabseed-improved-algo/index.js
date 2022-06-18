const puppeteer = require('puppeteer');


const b = async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto("https://m.arabseed.sbs/selary/%d9%85%d8%b3%d9%84%d8%b3%d9%84-%d9%81%d8%aa%d8%ad-%d8%a7%d9%84%d8%a7%d9%86%d8%af%d9%84%d8%b3/",{ waitUntil: 'networkidle2',});
    await page.screenshot({ path: 'example.png' });
    let bodyHTML = await page.evaluate(() =>  document.documentElement.outerHTML);


    console.log(bodyHTML)

    console.log(page.url());
    await browser.close();
  }

  b()