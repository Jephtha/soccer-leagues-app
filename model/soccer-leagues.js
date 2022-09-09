const client = require('../util/db.js');
var db;

/**
 * A function to return the collection in the databse
 * that is going to be queried. Each collection represents
 * a soccer league in the United States.
 * @param league- a variable
 * @returns a pointer to a collection in the database
 */
async function get_collection(league) {
    db = await client.getDb();
    return await db.collection(league);
}


/**
 * A function to return all the teams in a particular league
 * @param league- a variable
 * @returns an array of all the teams in a particular league
 */
async function getAllTeams(league) {
    let collection = await get_collection(league);
    let result = await collection.find({}, {projection: {_id: 0, team: 1}}).toArray();
    return result;
}

/**
 * A function to return specific details about a team
 * @param league- a variable
 * @param team- a variable
 * @returns an array of details about a team
 */
async function getTeamDetails(league, team){
    let collection = await get_collection(league);
    let result = await collection.find({"team": team}).project({ _id: 0, team: 1, city: 1, state: 1, joined: 1, year_joined:1, head_coach: 1, stadium: 1, stadium_capacity: 1, wikipedia_url: 1, logo_url: 1, id: 1}).toArray();
    return result;
}

/**
 * A function to return a url link to a team's website
 * @param league- a variable
 * @param team- a variable
 * @returns an array containing a url link
 */
async function getTeamUrl(league, team){
    let collection = await get_collection(league);
    let result = await collection.find({"team": team}).project({_id: 0, url: 1}).toArray();
    return result;
}

/**
 * A function to return latitude and longitude
 * coordiates that corresponds to the team stadium
 * @param league- a variable
 * @param team- a variable
 * @returns an array containing coordinates of a team location
 */
async function getTeamLocation(league, team){
    let collection = await get_collection(league);
    let result = await collection.find({"team": team}).project({_id: 0, latitude: 1, longitude: 1}).toArray();
    return result;
}

/**
 * A function to return all the soccer leagues in the United States.
 * @returns an array US leagues
 */
async function getUsLeagues()  {
    let db = await client.getDb();
    let result = await db.listCollections().toArray();
    return result;
}

let teams = ["Atlanta United FC", "CF Montréal", "Chicago Fire FC", "Colorado Rapids", "Columbus Crew", "D.C. United", "FC Cincinnati", "FC Dallas", "Houston Dynamo FC", "Inter Miami CF", "LA Galaxy", "Los Angeles FC", "Minnesota United FC", "Nashville SC", "New England Revolution", "New York City FC", "New York Red Bulls", "Orlando City SC", "Philadelphia Union", "Portland Timbers", "Real Salt Lake", "San Jose Earthquakes", "Seattle Sounders FC", "Sporting Kansas City", "Toronto FC", "Vancouver Whitecaps FC"];
let ids = ["ATL", "MTL", "CHI", "COL", "CLB", "DC", "CIN", "DAL", "HOU", "MIA", "LA", "LAFC", "MIN", "NSH", "NE", "NYC", "RBNY", "ORL", "PHI", "POR", "RSL", "SJ", "SEA", "SKC", "TOR", "VAN"];

async function getTeamPlayers(team) {
    let i = ids[teams.indexOf(team)];
    let db = await client.getDb();
    let collectionz = await db.collection("players"); 
    let result = await collectionz.aggregate ([
        { $match: 
            { $and: [
                {Club: i},
                {Year: { $gt: 2019}}
            ]}
        },
        {
            $project: {
                _id: 0,
                Player: 1
            }
        }

    ]).toArray();
    return result;
}


async function displayPlayerStats(player) {
    let db = await client.getDb();
    collectionz = await db.collection("players"); 
    let result = await collectionz.aggregate ([
        { $match: 
            { $and: [
                {Player: player},
                {Year: { $gt: 2019}},
                {GP: { $ne: 0}}
            ]}
        },
        {
            $project: {
                _id: 0,
                Player: 1,
                POS: 1,
                GP: 1,
                GS: 1,
                MINS: 1,
                SHTS: 1,
                SOG: 1,
                YC: 1,
                RC: 1,
                FC: 1,
                FS: 1,

            }
        }

    ]).toArray();
    return result;
}

async function displayTableStanding(year) {
    let db = await client.getDb();
    let collectionz = await db.collection("tables"); 
    let result = await collectionz.aggregate ([
        { $match: 
            { $and: [
                {Conference: "Overall"},
                {Year: year}
            ]}
        },
        {
            $project: {
                _id: 0,
                Pos: 1,
                Team: 1,
                GP: 1,
                W: 1,
                L: 1,
                GF: 1,
                GA: 1,
                GD: 1,
                Pts: 1
            }
        }

    ]).toArray();
    return result
}

module.exports = {getAllTeams, getTeamDetails, getTeamLocation, getTeamUrl, getUsLeagues, getTeamPlayers, displayPlayerStats, displayTableStanding}