const express = require("express");
const fs = require("fs");
const rp = require("request-promise-native");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function main() {
  console.log("Making API request...");

  const results = await rp({
    uri: "https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2021&standingsTypes=regularSeason,springTraining,firstHalf,secondHalf&hydrate=division,conference,sport,league,team(nextSchedule(team,gameType=[R,F,D,L,W,C],inclusive=false),previousSchedule(team,gameType=[R,F,D,L,W,C],inclusive=true))",
    headers: {
      authority: "statsapi.mlb.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      accept: "*/*",
      origin: "https://www.mlb.com",
      referer: "https://www.mlb.com/",
      "accept-language": "en-US,en;q=0.9",
    },
    json: true,
  });

  const resultsArr = results.records;
  const teamData = [];

  resultsArr.forEach((result) => {
    if (result.standingsType === "regularSeason") {
      result.teamRecords.forEach((team) => {
        teamData.push({
          teamId: team.team.id,
          team: team.team.name,
          winStreak: team.streak.streakNumber,
          wins: team.wins,
          losses: team.losses,
          winPercentage: team.winningPercentage,
          gamesPlayed: team.gamesPlayed,
        });
      });
    }

    // if (index === resultsArr.teamRecords.length - 1) {
    //   //   await fs.promises.writeFile("output.json", JSON.stringify(results, null, 2));
    //   app.get("/", function (req, res) {
    //     // res.json(results.records[0].teamRecords);
    //     res.json(teamData);
    //   });
    // }
  });

  app.get("/", function (req, res) {
    // res.json(results.records);
    // res.json(results.records[0].teamRecords);
    res.json(teamData);
  });
  console.log("Done!");
}

main();

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
