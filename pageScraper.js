const fs = require("fs");
const functions = require("./dbEntry");

const scraperObject = {
  url: "https://www.mlb.com/standings",
  async scraper(browser) {
    let page = await browser.newPage();

    console.log(`Navigate to ${this.url}...`);

    // Navigate to web page
    await page.goto(this.url);

    // Wait for the required DOM to be rendered
    await page.waitForSelector("main");

    let data = await page.$$eval(
      ".responsive-datatable__scrollable > div > table > tbody > tr",
      (tableData) => {
        teamData = [];

        tableData.map((data) => {
          teamData.push({
            teamId: parseInt(
              data
                .querySelector(".p-logo")
                .getAttribute("src")
                .match(/\d+/gi)[0]
            ),
            team: data
              .querySelector(".team--name > a")
              .getAttribute("data-team-name"),
            winStreak:
              '"' + data.querySelector(".col-7 > span").textContent + '"',
            losses: data.querySelector(".col-2 > span").textContent,
            wins: data.querySelector(".col-1 > span").textContent,
            winPercentage: data.querySelector(".col-3 > span").textContent,
            gamesPlayed:
              parseInt(data.querySelector(".col-1 > span").textContent) +
              parseInt(data.querySelector(".col-2 > span").textContent),
          });
        });
        return teamData;
      }
    );

    fs.writeFile("teams.json", JSON.stringify(data, null, 2), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log(
        "The data has been scraped and saved successfully! View it at './teams.json'"
      );
    });
    functions.dbEntry(data);
  },
};

module.exports = scraperObject;
