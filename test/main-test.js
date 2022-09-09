var assert = require('assert');
const request = require('request');
// const { soccerLeague } = require('../model/contact');

describe('Soccer Leagues App Tests with Mocha', function(){
    describe('Test API calls', function(){
        describe('Soccer Leagues', async function(){
            var myurl = 'http://localhost:3500';
            it('Fail 1. GET - /details (No team with name)', function(){
                let data = {
                    team_name: "Random Team",
                    league: "mls"
                };
                request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/details',
                    body:    JSON.stringify(data)
                }, function(error, response, bod){
                    assert.strictEqual(bod, 'No team details were found');
                });
            });
            it('Fail 2. GET - /team_link (No team with name)', function(){
                let data = {
                    team_name: "Random Team",
                    league: "mls"
                };
                request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/team_link',
                    body:    JSON.stringify(data) 
                }, function(error, response, body){
                    assert.strictEqual(body, 'No team url was found');
                });
            });
            it('Fail 3. GET - /location (No team with name)', function(){
                let data = {
                    team_name: "Random Team",
                    league: "mls"
                };
                request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/location',
                    body:    JSON.stringify(data) 
                }, function(error, response, body){
                    assert.strictEqual(body, 'No team location was found');
                });
            });
            it('Fail 4. GET - /all_teams (No list of teams in database)', function(){
                let data = {
                    league: "mlsv"
                };
                request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/all_teams',
                    body:    JSON.stringify(data) 
                }, function(error, response, body){
                    assert.strictEqual(body, 'No teams were found for the league');
                });
            });
            it('Success 1. GET - /details', function(){
                let data = {
                    team_name: "New York City FC",
                    league: "mls"
                };
                let team = {
                    team : "New York City FC",
                    stadium : "Yankee Stadium",
                    stadium_capacity : 30321,
                    joined : 2015,
                    head_coach : "Ronny Deila",
                    url : "https://www.nycfc.com/",
                    city : "New York City",
                    state : "New York",
                    latitude : 40.82916667,
                    longitude : -73.92638889,
                };
                request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/details',
                    body:    JSON.stringify(data) 
                }, function(error, response, bod){
                    obj = JSON.parse(bod);
                    //obj = body;
                    assert.strictEqual(obj[0].team, team.team);
                    assert.strictEqual(obj[0].stadium, team.stadium);
                    assert.strictEqual(obj[0].stadium_capacity, team.stadium_capacity);
                    assert.strictEqual(obj[0].joined, team.joined);
                    assert.strictEqual(obj[0].head_coach, team.head_coach);
                });
            });
            it('Success 2. GET - /team_link', function(){
                let data = {
                    team_name: "New York City FC",
                    league: "mls"
                };
                let team = {
                    team : "New York City FC",
                    stadium : "Yankee Stadium",
                    stadium_capacity : 30321,
                    joined : 2015,
                    head_coach : "Ronny Deila",
                    uri : "https://www.nycfc.com/",
                    city : "New York City",
                    state : "New York",
                    latitude : 40.82916667,
                    longitude : -73.92638889,
                };
                request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/team_link',
                    body:    JSON.stringify(data) 
                }, function(error, response, bod){
                    obj = JSON.parse(bod);
                    assert.strictEqual(obj[0].url, team.uri);
                });
            });
            // it('Success 3. GET - /details nwsl', function(){
            //     let data = {
            //         team_name: "Washington Spirit",
            //         league: "nwsl"
            //     };
            //     let team = {
            //         team : "Washington Spirit",
            //         city : "Washington",
            //         state : "D.C.",
            //         latitude : 38.86833333,
            //         longitude : -77.01222222,
            //         stadium : "Audi Field",
            //         stadium_capacity : 20000,
            //         founded : 2012,
            //         joined : 2013,
            //         head_coach : "Kris Ward",
            //         url : "https://washingtonspirit.com/"
            //     };
            //     request.get({
            //         headers: {'content-type': 'application/json'},
            //         url:     myurl+'/details',
            //         body:    JSON.stringify(data) 
            //     }, function(error, response, bod){
            //         obj = JSON.parse(bod);
            //         assert.strictEqual(obj[0].team, team.team);
            //         assert.strictEqual(obj[0].stadium, team.stadium);
            //         assert.strictEqual(obj[0].stadium_capacity, team.stadium_capacity);
            //         assert.strictEqual(obj[0].joined, team.joined);
            //         assert.strictEqual(obj[0].head_coach, team.head_coach);
            //     });
            // });
            it('Success 4. GET - /location', function(){
                let data = {
                    team_name: "New York City FC",
                    league: "mls"
                };
                let team = {
                    team : "New York City FC",
                    stadium : "Yankee Stadium",
                    stadium_capacity : 30321,
                    joined : 2015,
                    head_coach : "Ronny Deila",
                    uri : "https://www.nycfc.com/",
                    city : "New York City",
                    state : "New York",
                    latitude : 40.82916667,
                    longitude : -73.92638889,
                };
                request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/location',
                    body:    JSON.stringify(data) 
                }, function(error, response, bod){
                    obj = JSON.parse(bod);
                    assert.strictEqual(obj[0].latitude, team.latitude);
                    assert.strictEqual(obj[0].longitude, team.longitude);
                });
            });
            it('Success 5. GET - /all_teams (Greater than 0)', function(){
                let data = {
                    league: "mls"
                };
                request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/all_teams',
                    body:    JSON.stringify(data) 
                }, function(error, response, bod){
                    obj = JSON.parse(bod);
                    assert.notEqual(obj.length, 0);
                });
            });
            it('Success 6. GET - /leagues (Greater than 0)', function(){
                request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/leagues',
                   // body:    JSON.stringify(data) 
                }, function(error, response, bod){
                    obj = JSON.parse(bod);
                    assert.notEqual(obj.length, 0);
                });
            });
        });
    });
});