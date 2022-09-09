const soccerLeague = require('../model/soccer-leagues');//.soccerLeague;

/**
 * A function that lists all teams playing in a particular
 * league with the information we have on file. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
 module.exports.list_all_teams = async (req, res) => {  
    let leagues = req.params.league;
    let objs = await soccerLeague.getAllTeams(leagues);
    let x = [];
    if (objs.length > 0){
        console.log(objs.length+' item(s) sent.');
        for (i=0; i<objs.length; i++){
            x.push(objs[i].team);
        }
        res.send(x);  
    } else {
        res.send("No teams were found for the league")
    }        
};

/**
 * A function that gets a team name and returns all
 * the details about the requested team. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
 module.exports.get_team_details = async (req, res) => {
    let leagues = req.params.league;
    let team_to_match = req.params.team;

    let obj = await soccerLeague.getTeamDetails(leagues, team_to_match);
    if (obj == undefined || obj == "" || obj == null || obj == []) {
        console.log("No team details were found");
        res.send("No team details were found");
        
    }
    else {
        res.send(obj[0]); 
    }
};

/**
 * A function that gets a team name and returns
 * the url of the team's website 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.get_team_url = async (req, res) => {
    let leagues = req.params.league;
    let team_to_match = req.params.team;

    let obj = await soccerLeague.getTeamUrl(leagues, team_to_match);
    if (obj == undefined || obj == "" || obj == null || obj == []) {
        console.log("No team url was found");
        res.send("No team url was found");
        
    }
    else {
        res.send(obj[0]); 
    }
};

/**
 * A function that gets a team name and returns 
 * the location in lat and long values about the requested team. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
 module.exports.get_team_location = async (req, res) => {
    let leagues = req.body.league;
    let team_to_match = req.body.team_name;

    let obj = await soccerLeague.getTeamLocation(leagues, team_to_match);
    if (obj == undefined || obj == "" || obj == null || obj == []) {
        console.log("No team location was found");
        res.send("No team location was found");
        
    }
    else {
        res.send(obj[0]); 
    }
};

/**
 * A function that returns a list of all
 * the soccer leagues in the United States.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
 module.exports.list_all_leagues = async (req, res) => {  
    let objs = await soccerLeague.getUsLeagues();
    let x = [];
    if (objs.length > 0){
        console.log(objs.length+' item(s) sent.');
        for (i=0; i<objs.length; i++){
            if (objs[i].name != "players" && objs[i].name != "tables") {
                x.push(objs[i].name);
            }
        }
        res.send(x);
    }else{
        //res.send({msg: 'There is no team named', data: obj});
        res.send('No leagues were found');
    }     
};

module.exports.get_team_players = async (req, res) => {
    let team = req.params.team_name;
    
    let obj = await soccerLeague.getTeamPlayers(team);
    let x = [];
    if (obj.length > 0){
        console.log(obj.length+' item(s) sent.');
        for (i=0; i<obj.length; i++){
            x.push(obj[i].Player);
        }
        res.send(x);  
    } else {
        res.send("No players were found for this team")
    }
};

module.exports.get_player_stats = async (req, res) => {
    let player = req.params.playerName;

    let obj = await soccerLeague.displayPlayerStats(player);
    res.send(obj[0]);
    console.log("hi")
};

module.exports.get_table_standing = async (req, res) => {
    let year = parseInt(req.params.season);

    let obj = await soccerLeague.displayTableStanding(year);
    res.send(obj);
    //console.log(obj);
};