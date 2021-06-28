const pageScraper = require("./pageScraper");
const apiObj = require("./apiCall");

async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    await pageScraper.scraper(browser);
    await browser.close();
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
    apiObj.apiCall();
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
