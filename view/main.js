

$(document).ready(function(){
    var newMap;
    var teamList =[];

    /**
     * Call all functions and initialize some values
     */

    var value = $('#leagues').find("option:selected").val();
    listTeams(value);
    initMap(value);

    teamSelect();
    displayTableStandings();
    
    //when a different league in the drop down list has been selected, list all the teams in the league
    $("#leagues").change(function() {
        value = $('#leagues').find("option:selected").val();
        console.log(value)
        listTeams(value);
        newMap.off();
        newMap.remove();
        initMap(value);
    });

    //when a different team in the drop down list has been selected, print the url of the team and display a list of players in the team
    $("#teamDropDown").change(function() {
        id = $('#teamDropDown').find("option:selected").text();
        console.log(id);
        displayList(id);
        teamUrl(id);
    });

    //when the search button has been pressed, display the stats of the search player
    $("#submit").click(function(event){
        event.preventDefault();
        var playerName = $("#query").val();
        playerStats(playerName);
    });

    function removeRows(){
        for (i=0; i < 30; i++){
            $(`#team${i}`).remove();
        }
    }

    function removeList(){
            $(`.list`).remove();
    }

    /**
     * display a table of all the teams and their details
     */
    function listTeams(){
        //a request to get the names of all the teams
        $.ajax({
            url: '/all_teams/'+value,
            type: 'GET',
            contentType: 'application/json',
            success: function(response){
                removeRows();
                $('#tbody').hide();
                for(let i = 0; i < response.length; i++) {
                    let objs = response[i];
                    
                    //a request to get the details of each team in a league
                    $.ajax({
                        url: `/details/${value}/${objs}`,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function(response2){
                            let obj = response2;
                            var joined;
                            if (obj.joined == undefined) {
                                joined = obj.year_joined;
                            }else {
                                joined = obj.joined;
                            }

                            $('#tbody').append(
                                `<tr id="team${i}">
                                    <td><a href="${obj.url}"><img src="${obj.logo_url}" width="32" height="32" alt="${obj.team}"/></a></td>
                                    <td id="${obj.id}">${obj.team}</td>
                                    <td>${obj.city}</td>
                                    <td>${obj.state}</td>
                                    <td>${obj.stadium}</td>
                                    <td>${obj.stadium_capacity}</td>
                                    <td>${joined}</td>
                                    <td>${obj.head_coach}</td>
                                    <td><a href="${obj.wikipedia_url}" target="_blank">Wiki page</a></td>
                                </tr>`
                            );
                        }
                    });
                }
                $("#tbody").fadeIn("slow");
            },
            error: function(xhr, status, error){
                alert(xhr.responseText);
                console.log(error);
            }
        });
    };

    /**
     * a function that populates a drop down list with all the teams in the mls
     */
    function teamSelect(){
        $.ajax({
            url: '/all_teams/mls',
            type: 'GET',
            contentType: 'application/json',
            success: function(response){
                for(let i = 0; i < response.length; i++) {
                    let objs = response[i];

                    //a request to get the details of a team
                    $.ajax({
                        url: `/details/mls/${objs}`,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function(response2){
                            let obj = response2;

                            teamList[i] = obj;

                            $("#teamDropDown").append(new Option(obj.team, obj.id));
                        }
                    });
                }
            },
            error: function(xhr, status, error){
                alert(xhr.responseText);
                console.log(error);
            }
        });
    };

    /**
     * Displays an unordered list of all the players in a particular
     * 
     * @param {String} team The name of team whose players we are going to display
     */
    function displayList(team) {
        removeList();
        if (team == "Austin FC" || team == "Charlotte FC") {
            $('#players').append("<p class='list style='text-align:center'> We don't have information on newly formed teams in our database. Especially teams formed 2021 and later. For more information you can go to the team website linked above. There is no information on the players in this team </p>")
        } else {
            $.ajax({
                url: `/player_list/${team}`,
                type: 'GET',
                contentType: 'application/json',
                success: function(response){
                    $('#players').append('<ul class="list"></ul>')
                    $('.list').hide();
                    for (i=0; i < response.length; i++){
                        $('.list').append('<li class="playerName">'+response[i]+'</li>')
                    }
                    $('.list').fadeIn("slow");
                },
                error: function(xhr, status, error){
                    alert(xhr.responseText);
                    console.log(error);
                }
            });
        }
    }

    //print the link to the team Url
    function teamUrl(team){
        $.ajax({
            url: `/team_link/mls/${team}`,
            type: 'GET',
            contentType: 'application/json',
            success: function(response){

                $("#team_link").remove();
                console.log(response.url);
                $('#info').append('<a id="team_link" href="'+response.url+'" target="_blank">'+team+'</a>')
            },
            error: function(xhr, status, error){
                alert(xhr.responseText);
                console.log(error);
            }
        });
    }

    /**
     * I will add maps of all the teams in the league using geojson
     * 
     * @param {String} league The league whose map we will print
     * 
     */

    function initMap(league) {
        if (league == "mls") {
            file = "mls.geojson";
        } else if (league == "nwsl") {
            file = "nwsl.geojson";
        } else if(league == "usl") {
            file = "usl.geojson";
        }

        newMap = L.map('map').setView([38.9188702,-77.0708398], 5);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href=”http://osm.org/copyright”>OpenStreetMap</a> contributors'
        }).addTo(newMap);

        $.getJSON(file, function(data){
            // L.geoJson function is used to parse geojson file and load on to map
            var datalayer = L.geoJson(data ,{
                onEachFeature: function(feature, featureLayer) {
                    featureLayer.bindPopup(feature.properties.team);
                }
            }).addTo(newMap);
            newMap.fitBounds(datalayer.getBounds());
        });

    };

    /**
     * Displays a table with the stats of the selected player
     * 
     * @param {String} playerName The Name of the player whose stats we are going to display
     */
    function playerStats(playerName){
        $.ajax({
            url: `/player_stats/${playerName}`,
            type: 'GET',
            contentType: 'application/json',
            success: function(response){
                let obj = response;

                $("#stats_table").remove();

                $('.stats').append(
                    `<table id="stats_table">
                        <thead>
                            <tr>
                                <td>Player</td>
                                <td>Position</td>
                                <td>Games Played</td>
                                <td>Games Started</td>
                                <td>Minutes</td>
                                <td>Shots</td>
                                <td>Shots On Goal</td>
                                <td>Yellow Cards</td>
                                <td>Red Cards</td>
                                <td>Fouls Committed</td>
                                <td>Fouls Suffered</td>
                            </tr>
                        </thead>
                        <tbody id="stats_body">

                        </tbody>
                    </table>`
                );

                $('#stats_body').append(
                    `<tr>
                        <td>${obj.Player}</td>
                        <td>${obj.POS}</td>
                        <td>${obj.GP}</td>
                        <td>${obj.GS}</td>
                        <td>${obj.MINS}</td>
                        <td>${obj.SHTS}</td>
                        <td>${obj.SOG}</td>
                        <td>${obj.YC}</td>
                        <td>${obj.RC}</td>
                        <td>${obj.FC}</td>
                        <td>${obj.FS}</td>
                    </tr>`
                );
            },
            error: function(xhr, status, error){
                alert(xhr.responseText);
                console.log(error);
            }
        });
    }

    /**
     * Displays a table of the standings of all the teams in the mls 
     * 
     */
    function displayTableStandings(){
        $.ajax({
            url: '/table_standing/2020',
            type: 'GET',
            contentType: 'application/json',
            success: function(response){
                $('#tbody2').hide();
                for(let i = 0; i < response.length; i++) {
                    let obj = response[i];
                    $('#tbody2').append(
                        `<tr>
                            <td>${obj.Pos}</td>
                            <td>${obj.Team}</td>
                            <td>${obj.GP}</td>
                            <td>${obj.W}</td>
                            <td>${obj.L}</td>
                            <td>${obj.GF}</td>
                            <td>${obj.GA}</td>
                            <td>${obj.GD}</td>
                            <td>${obj.Pts}</td>
                        </tr>`
                    );
                    
                }
                $('#tbody2').fadeIn("slow");
            },
            error: function(xhr, status, error){
                alert(xhr.responseText);
                console.log(error);
            }
        });
    };

})