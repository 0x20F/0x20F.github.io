var user_info_url = "https://artstation.com/users/username/quick.json";

var usernames = Array();

$.ajax({
    url: "../data/collectors.json",
    type: "GET",
    crossDomain: true,
    dataType: "json"
}).done(function(data) {
    console.log("MAGIC");
});