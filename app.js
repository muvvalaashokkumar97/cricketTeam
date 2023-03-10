const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(dbPath);
      console.log(typeof open);
      console.log(typeof app);
    });
  } catch (e) {
    console.log(`DB error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getAllPlayers = `select * from cricket_team;`;
  const result = await db.all(getAllPlayers);
  response.send(result);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayers = `
  INSERT INTO 
  cricket_team (player_name,jersey_number,role) 
  values (
      '${playerName}',
       ${jerseyNumber},
      '${role}');`;
  await db.run(addPlayers);
  response.send("Player Added to Team");
});

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playersDetails = `
  select * from cricket_team where player_id = ${playerId}`;
  const player = await db.get(playersDetails);
  response.send(player);
});

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playersDetails;
  const updatePlayerDetails = `
  UPDATE cricket_team 
  set 
  player_name = '${playerName}',
  jersey_number =${jerseyNumber},
  role ='${role}'
  where player_id = ${playerId}`;
  await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playersDetails = `
  delete from cricket_team where player_id = ${playerId}`;
  await db.run(playersDetails);
  response.send("Player Removed");
});
