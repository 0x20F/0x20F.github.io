var alerts;
var earth;
var cetus;

check();

function check() {
    $.getJSON("https://ws.warframestat.us/pc", function(data) {
        alerts = data["alerts"];

        earth = data["earthCycle"];
        cetus = data["cetusCycle"];

        console.log(alerts);
    }).done(function() {
        // Cleanup or preparation here?
        // renderAlerts(alerts);

        // HAVE A LOADING CHECK HERE 
        // WHEN IT REACHES IT EVERYTHING IS READY SO HIDE THE LOADING ICONS N SHIT
    });
}





/* ####
#######
#######   Initiate Day Night Timers
#######   TODO: ADD CHECKS FOR WHEN IT SWITCHES (call the api again)
####*/
setInterval(function() {
    let now = new Date().getTime();
    let countTime = new Date(earth.expiry).getTime();

    let time = earth.isDay ? "Day" : "Night";
    let next = time === "Day" ? "Night" : "Day";

    let distance = countTime - now;

    // that means the time switched so ask api again (have a function for that)
    if(distance <= 0) {
        // Do summin
        check();
    }

    let hours = pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 2);
    let minutes = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
    let seconds = pad(Math.floor((distance % (1000 * 60)) / 1000), 2);

    $(`#earth .current`).text(time);
    $(`#earth .timer`).text(hours + ":" + minutes + ":" + seconds + " (until " + next + ")");
}, 1000);


setInterval(function() {
    let now = new Date().getTime();
    let countTime = new Date(cetus.expiry).getTime();

    let time = cetus.isDay ? "Day" : "Night";
    let next = time === "Day" ? "Night" : "Day";

    let distance = countTime - now;

    // that means the time switched so ask api again (have a function for that)
    if(distance <= 0) {
        // Do summin
        check();
    }

    let hours = pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 2);
    let minutes = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
    let seconds = pad(Math.floor((distance % (1000 * 60)) / 1000), 2);

    $(`#cetus .current`).text(time);
    $(`#cetus .timer`).text(hours + ":" + minutes + ":" + seconds + " (until " + next + ")");
}, 1000);







function pad(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}


