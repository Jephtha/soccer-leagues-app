const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/mydb";
const client = new MongoClient(url, { useUnifiedTopology: true });
var db;

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });


/**
 * A function to stablish a connection with a MongoDB instance.
 */
async function connectToDB() {
    try {
        // Connect the client to the server
        await client.connect();
        // Our db name is going to be mydb
        db = client.db('mydb');
        console.log("Connected successfully to mongoDB");  
    } catch (err) {
        throw err; 
    } 
}
/**
 * This method just returns the database instance
 * @returns A Database instance
 */
async function getDb() {
    return db;
}

async function assign_id() {
    collectionz = await db.collection("mls");
    let team = ["Atlanta United FC", "CF Montréal", "Chicago Fire FC", "Colorado Rapids", "Columbus Crew", "D.C. United", "FC Cincinnati", "FC Dallas", "Houston Dynamo FC", "Inter Miami CF", "LA Galaxy", "Los Angeles FC", "Minnesota United FC", "Nashville SC", "New England Revolution", "New York City FC", "New York Red Bulls", "Orlando City SC", "Philadelphia Union", "Portland Timbers", "Real Salt Lake", "San Jose Earthquakes", "Seattle Sounders FC", "Sporting Kansas City", "Toronto FC", "Vancouver Whitecaps FC"];
    let id = ["ATL", "MTL", "CHI", "COL", "CLB", "DC", "CIN", "DAL", "HOU", "MIA", "LA", "LAFC", "MIN", "NSH", "NE", "NYC", "RBNY", "ORL", "PHI", "POR", "RSL", "SJ", "SEA", "SKC", "TOR", "VAN"];
    for (i=0; i<team.length; i++) {
        collectionz.updateOne({'team': team[i]}, {$set: {'id': id[i]}});
    } 
}

let teams = ["Atlanta United FC", "CF Montréal", "Chicago Fire FC", "Colorado Rapids", "Columbus Crew", "D.C. United", "FC Cincinnati", "FC Dallas", "Houston Dynamo FC", "Inter Miami CF", "LA Galaxy", "Los Angeles FC", "Minnesota United FC", "Nashville SC", "New England Revolution", "New York City FC", "New York Red Bulls", "Orlando City SC", "Philadelphia Union", "Portland Timbers", "Real Salt Lake", "San Jose Earthquakes", "Seattle Sounders FC", "Sporting Kansas City", "Toronto FC", "Vancouver Whitecaps FC"];
let ids = ["ATL", "MTL", "CHI", "COL", "CLB", "DC", "CIN", "DAL", "HOU", "MIA", "LA", "LAFC", "MIN", "NSH", "NE", "NYC", "RBNY", "ORL", "PHI", "POR", "RSL", "SJ", "SEA", "SKC", "TOR", "VAN"];

async function getTeamPlayers(team) {
    let i = ids[teams.indexOf(team)];
    collectionz = await db.collection("players"); 
    await collectionz.aggregate ([
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

    ]).toArray(function(err, res) {
        if (err) throw err;
        console.log(res);//(JSON.stringify(res));
        console.log(res.length);
    });
}

async function displayPlayerStats(player) {
    collectionz = await db.collection("players"); 
    await collectionz.aggregate ([
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

    ]).toArray(function(err, res) {
        if (err) throw err;
        console.log(res);//(JSON.stringify(res));
        console.log(res.length);
    });
}

async function displayTableStanding(year) {
    collectionz = await db.collection("tables"); 
    await collectionz.aggregate ([
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

    ]).toArray(function(err, res) {
        if (err) throw err;
        console.log(res);//(JSON.stringify(res));
        console.log(res.length);
    });
}

/**
 * This method closes the connection with the database
 */
async function closeDBConnection(){
    await client.close();
};

module.exports = {connectToDB, getDb, assign_id, getTeamPlayers, displayPlayerStats, displayTableStanding, closeDBConnection}