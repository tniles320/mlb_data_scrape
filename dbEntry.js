const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	// input password to connect to local database
	password: "",
	database: "mlb_standingsdb",
});

const functions = {
	dbEntry: (teamData) => {
		teamData.forEach((team) => {
			connection.query(
				`INSERT INTO teams(team_id, team_name, win_streak, wins, losses, win_percentage, games_played) VALUES(?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE win_streak=${team.winStreak}, wins=${team.wins}, losses=${team.losses}, win_percentage=${team.winPercentage}, games_played=${team.gamesPlayed}`,
				[
					team.teamId,
					team.team,
					team.winStreak,
					team.wins,
					team.losses,
					team.winPercentage,
					team.gamesPlayed,
				],
				(err, res) => {
					if (err) throw err;
				}
			);
		});
		console.log("Team data added");
	},
};

module.exports = functions;
