// The array containing the entire JSON
// Because we don't want to re-request it
// and have to wait a lil bit.
var jsonElements;

fillJson();

/**
 * Get the json and shove it in a variable
 * This is its own separate function
 * because I can't be bothered to
 * change it, deal with it.
 */
function fillJson() {
    var onSuccess = function (data) {
        jsonElements = data.elements;
    };
    $.getJSON("assets/table.json", onSuccess);
}



// to keep count how many json elements we've gone through
var jsonIndex = 0;

// Make a variable with the JSON so you dont have to GET it again.

$.getJSON("assets/table.json", function (data) {
    var elements = data.elements;

    /* --------------------------------------------------
    These if statements are like this because of the 
    way I organized the table json. the top 7 rows come 
    first and then the bottom two, instead of them being 
    in atom number order, and so, instead of having 2 json
    files the requests response time wouldnt match and the
    elements wouldnt be added in order.
    ----------------------------------------------------*/
    // Get the top 7 rows
    if (jsonIndex == 0) {

        // For every row
        for (var i = 0; i < 7; i++) {
            // Set what row we're on, based on the div classes in the html
            var row = $(".row-" + i);

            // For every column
            for (var j = 0; j < 18; j++) {
                // What x,y coordinates we're on (done shitty), My unique comparing system ._.
                var currentZone = i.toString() + j.toString();

                // Get the element from the json
                var currentElement = elements[jsonIndex];

                // If it's a deadzone
                if (contains(deadzones, currentZone)) {
                    // Check what type of deadzone it is
                    // and add a template from the basics.js file
                    switch (currentZone) {
                        case "52":
                            // This is where the 8th row should go, 57-71
                            row.append(nrPlaceholderOne);
                            break;
                        case "62":
                            // This is where the 9th row should go, 89-103
                            row.append(nrPlaceholderTwo);
                            break;
                        default:
                            // This means there shouldnt be anything there
                            row.append(emptyBox);
                            break;
                    }
                    // Loop shall continue since there is no point in doing all the work
                    // the templates have it all.
                    continue;
                }

                // Get the values from the currentElement JSON
                var atomNumber = currentElement.number;
                var atomicMass = currentElement.atomic_mass.toFixed(4).slice(0, -1);
                var atomSymbol = currentElement.symbol;
                var category = currentElement.category;

                // Replace the template values with new ones
                var currentTemplate = template.replace("$number", atomNumber)
                    .replace("$letter", atomSymbol)
                    .replace("$weight", atomicMass);

                // Add it to the html
                row.append(currentTemplate);

                // Add the corersponding color class
                row.children().last().addClass(formatCategory(category));
                jsonIndex++; // Move lower into the file
            }
        }
    }
    // If we've spawned all elements up to the last 2 rows of the table
    if (jsonIndex == 88) {

        // For every row
        for (var i = 7; i < 9; i++) {
            // Set what row we're on, based on the div classes in the html
            var row = $(".row-" + i);

            // For every column
            for (var j = 0; j < 15; j++) {
                // Get the element from the json
                var currentElement = elements[jsonIndex];

                // Get the values from the currentElement JSON
                var atomNumber = currentElement.number;
                var atomicMass = currentElement.atomic_mass.toFixed(4).slice(0, -1);
                var atomSymbol = currentElement.symbol;
                var category = currentElement.category;

                // Replace the template values with new ones
                var currentTemplate = template.replace("$number", atomNumber)
                    .replace("$letter", atomSymbol)
                    .replace("$weight", atomicMass);

                // Add it to the html
                row.append(currentTemplate);

                // Add the corersponding color class
                row.children().last().addClass(formatCategory(category));
                jsonIndex++; // Move lower into the file
            }
        }
    }


    // Give IDs to every element after they've spawned
    $(".element-box").each(function (i) {
        $(this).attr("id", i);
    });
});




/**
 * What happens whenever a new element is clicked
 * Update the data on the sidebar basically
 */
$(document).on("click", ".element-box", function () {

    // Get the clicked element from the array so we have access to the information
    var curr = jsonElements[$(this).attr("id")];

    // Store the needed information so its easy to loop through
    var info = [curr.appearance, curr.atomic_mass, curr.boil,
        curr.discovered_by, curr.melt, curr.molar_heat, curr.named_by,
        curr.phase, curr.spectral_img,
        curr.shells
    ];

    // Specify the unloopable information
    $("#sidebar #element #symbol").html(curr.symbol);
    $("#sidebar #element #name").html(curr.name);
    $("#sidebar #source").attr("href", curr.source);

    // Loop through all the info fields and add info in order
    $("#sidebar .info").each(function (i) {
        // If it's the spectral image (quick fix, (bad fix))
        // Check if there actually is a spectral image
        if(i == 8 && info[i] != null) {
            var link = " <a class=\"info-link\" href=\"" + info[i] + "\" target=\"_blank\">Click to follow link</a>";    
            $(this).html(link);
        } else {
            $(this).html(" " + info[i]);
        }
    });
});




// Set the last element clicked to something non existent
var last = null;

// Hiding and showing the sidebar
$(document).on("click", ".element-box", function () {
    var currId = $(this).attr("id");
    if (last == currId) {
        $("#sidebar").css("margin-left", "-20%");
        $("#help").html("Click an Element to see more information");
        // Reset the last clicked one, maybe you 
        // misclicked and now it doesnt open anymore
        last = null;
        return;
    } else {
        $("#sidebar").css("margin-left", "0");
        $("#help").html("Click the same Element twice to close the sidebar");
    }
    last = currId;
});




/**
 * Check what type of element it is and return
 * its CSS class equivalent
 * @param {String} category 
 */
function formatCategory(category) {
    if (category.startsWith("unknown,")) {
        return "unknown";
    }
    return category.replace(/\ /g, "-");
}