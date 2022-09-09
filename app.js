const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
app.use(bodyParser.json()); // support json encoded bodies

const soccerLeague = require('./controller/soccer_leagues');// Here we import our code with the contacts operations
const mongo = require('./util/db.js');

var server;

app.use(express.static(__dirname + '/view'));


async function loadDBClient() {
  await mongo.connectToDB();
  await mongo.assign_id();
};  
loadDBClient();

// contacts resource paths
app.get('/all_teams/:league', soccerLeague.list_all_teams);
app.get('/details/:league/:team', soccerLeague.get_team_details);
app.get('/team_link/:league/:team', soccerLeague.get_team_url);
app.get('/location/:league/:team', soccerLeague.get_team_location);
app.get('/leagues', soccerLeague.list_all_leagues);
app.get('/player_list/:team_name', soccerLeague.get_team_players);
app.get('/player_stats/:playerName', soccerLeague.get_player_stats);
app.get('/table_standing/:season', soccerLeague.get_table_standing);



try {
  server = app.listen(port, () => {
    console.log('Example app listening at http://localhost:%d', port);
  });
}catch(err){
  console.log(err)}



process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing Mongo Client.');
  mongo.closeDBConnection();
  server.close(() => {
    console.log('Http server closed.');
  });
});
