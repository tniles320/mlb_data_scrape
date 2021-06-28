const fs = require("fs");
const rp = require("request-promise-native");
const functions = require("./dbEntry");

async function apiCall() {
  const teamData = [];

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

  results.records.forEach((result) => {
    if (result.standingsType === "regularSeason") {
      result.teamRecords.forEach((team) => {
        teamData.push({
          teamId: team.team.id,
          team: team.team.name,
          winStreak: '"' + team.streak.streakCode + '"',
          wins: team.wins,
          losses: team.losses,
          winPercentage: team.winningPercentage,
          gamesPlayed: team.gamesPlayed,
        });
      });
    }
  });

  fs.writeFile("teams.json", JSON.stringify(teamData, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(
      "Team data has been saved succesfully! View it at './teams.json'"
    );
  });

  functions.dbEntry(teamData);

  console.log("Done!");
}

module.exports = {
  apiCall,
};
