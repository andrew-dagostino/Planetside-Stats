$(document).ready(() => {
    if(character_data.returned > 0 && events_data.returned > 0) {
        let character = character_data.character_list[0];
        let stat = character.stats.stat;
        let events = events_data.characters_event_list.sort((a, b) => a.timestamp - b.timestamp);

        // Customize colouring based on player's faction
        switch (character.faction_id) {
            case "1":
                $("#navbar").addClass("navbar-dark").removeClass("navbar-light");
                $("#navbarSearchButton").addClass("btn-outline-light").removeClass("btn-outline-dark");
                $(".faction-primary").css("backgroundColor", "#612597");
                $(".faction-border").css("borderColor", "#612597");
                $(".faction-bg").css("backgroundColor", "#180350");
                $(".faction-text-primary").css("color", "#FFFFFF");
                break;
            case "2":
                $("#navbar").addClass("navbar-dark").removeClass("navbar-light");
                $("#navbarSearchButton").addClass("btn-outline-light").removeClass("btn-outline-dark");
                $(".faction-primary").css("backgroundColor", "#1D4698");
                $(".faction-border").css("borderColor", "#1D4698");
                $(".faction-bg").css("backgroundColor", "#0B1A39");
                $(".faction-text-primary").css("color", "#FFFFFF");
                break;
            case "3":
                $("#navbar").addClass("navbar-dark").removeClass("navbar-light");
                $("#navbarSearchButton").addClass("btn-outline-light").removeClass("btn-outline-dark");
                $(".faction-primary").css("backgroundColor", "#B90D01");
                $(".faction-border").css("borderColor", "#B90D01");
                $(".faction-bg").css("backgroundColor", "#800000");
                $(".faction-text-primary").css("color", "#FFFFFF");
                break;
            case "4":
                $("#navbar").addClass("navbar-light").removeClass("navbar-dark");
                $("#navbarSearchButton").addClass("btn-outline-dark").removeClass("btn-outline-light");
                $(".faction-primary").css("backgroundColor", "#FFFFFF");
                $(".faction-border").css("borderColor", "#FFFFFF");
                $(".faction-bg").css("backgroundColor", "#FFFFFF");
                $(".faction-text-primary").css("color", "#000000");
                break;
        }

        // Retrieve event from data and sort by kills/deaths
        let kills = events.filter(event => event.table_type === "kills");
        let deaths = events.filter(event => event.table_type === "deaths");
        let dates = events.map(event => event.timestamp * 1000);

        // Calculate card stats
        let kdr = (kills.length / Math.max(deaths.length, 1)).toFixed(3);
        $("#kdrCard").text(kdr);

        let kpm = (kills.length / ((events[events.length-1].timestamp - events[0].timestamp) / 60)).toFixed(3);
        $("#kpmCard").text("WIP");

        let hsr = (kills.filter(event => event.is_headshot == "1").length / Math.max(kills.length, 1) * 100).toFixed(3);
        $("#hsrCard").text(hsr + "%");

        let acc = (stat.filter(stat => stat.stat_name == "weapon_hit_count")[0].value_monthly / stat.filter(stat => stat.stat_name == "weapon_fire_count")[0].value_monthly * 100).toFixed(3)
        $("#accCard").text(acc + "%");

        let ivi = Math.floor(acc * hsr);
        $("#iviCard").text(ivi);

        // Create kills/deaths timeline
        let numKills = 0;
        let numDeaths = 0;

        let kdOptions = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: "Kills",
                    data: kills.map(event => {
                        return {
                            t: event.timestamp * 1000,
                            y: ++numKills
                        }
                    }),
                    pointRadius: 0,
                    backgroundColor: "rgba(255, 99, 132, 0.2)"
                },
                {
                    label: "Deaths",
                    data: deaths.map(event => {
                        return {
                            t: event.timestamp * 1000,
                            y: ++numDeaths
                        }
                    }),
                    pointRadius: 0,
                    backgroundColor: "rgba(54, 162, 235, 0.2)"
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'M/D ha'
                            }
                        },
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            drawTicks: false,
                            drawOnChartArea: false
                        },
                        distribution: 'series'
                    }]
                },
                elements: {
                    line: {
                        spanGaps: true,
                        tension: 0 // disables bezier curves
                    }
                }
            }
        };
        let kdChart = new Chart($("#kdChart"), kdOptions);
        let kdModalChart = new Chart($("#kdModalChart"), kdOptions);

        // Create kdr timeline
        numKills = 0;
        numDeaths = 0;

        let kdrOptions = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: "KDR",
                    data: events.map(event => {
                        event.table_type === "kills" ? numKills++ : numDeaths++;

                        return {
                            t: event.timestamp * 1000,
                            y: (numKills / Math.max(numDeaths, 1)).toFixed(3)
                        }
                    }),
                    pointRadius: 0,
                    backgroundColor: "rgba(223, 209, 227, 0.8)"
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'M/D ha'
                            }
                        },
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            drawTicks: false,
                            drawOnChartArea: false
                        },
                        distribution: 'series'
                    }]
                },
                elements: {
                    line: {
                        spanGaps: true,
                        tension: 0 // disables bezier curves
                    }
                }
            }
        };
        let kdrChart = new Chart($("#kdrChart"), kdrOptions);
        let kdrModalChart = new Chart($("#kdrModalChart"), kdrOptions);
    }

    // Redirect to player stats page
    $("#navbarSearchForm").on("submit", () => {
        window.location.replace("/player/"+$("#navbarSearchInput").val());
        return false;
    });
});