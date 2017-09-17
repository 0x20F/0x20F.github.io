/*-------------------------


CLEANUP ON AISLE FOUR PLEASE


---------------------------*/
var jsonElements;
fillJson();
function fillJson() {
    var onSuccess = function(data) {
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
        for (var i = 0; i < 7; i++) {
            var row = $(".row-" + i);

            for (var j = 0; j < 18; j++) {
                var currentZone = i.toString() + j.toString();
                var currentElement = elements[jsonIndex];

                if (contains(deadzones, currentZone)) {
                    switch(currentZone) {
                        case "52":
                            row.append(nrPlaceholderOne);
                            break;
                        case "62":
                            row.append(nrPlaceholderTwo);
                            break;
                        default:
                            row.append(emptyBox);
                            break;
                    }
                    continue;
                }

                var atomNumber = currentElement.number;
                var atomicMass = currentElement.atomic_mass.toFixed(4).slice(0, -1);
                var atomSymbol = currentElement.symbol;
                var category = currentElement.category;
                

                var currentTemplate = template.replace("$number", atomNumber)
                    .replace("$letter", atomSymbol)
                    .replace("$weight", atomicMass);

                row.append(currentTemplate);

                // Add the corersponding color class
                row.children().last().addClass(formatCategory(category));
                jsonIndex++;
            }
        }
    }
    if (jsonIndex == 88) {

        for (var i = 7; i < 9; i++) {
            var row = $(".row-" + i);

            for (var j = 0; j < 15; j++) {
                var currentElement = elements[jsonIndex];

                var atomNumber = currentElement.number;
                var atomicMass = currentElement.atomic_mass.toFixed(4).slice(0, -1);
                var atomSymbol = currentElement.symbol;
                var category = currentElement.category;

                var currentTemplate = template.replace("$number", atomNumber)
                    .replace("$letter", atomSymbol)
                    .replace("$weight", atomicMass);

                row.append(currentTemplate);

                row.children().last().addClass(formatCategory(category));
                jsonIndex++;
            }
        }
    }

    /*
    - Give IDs to every element after theyve spawned
    */
    $(".element-box").each(function(i) {
        $(this).attr("id", i);
    });
});



$(document).on("click", ".element-box", function(){

    var curr = jsonElements[$(this).attr("id")];
    var info = [curr.appearance, curr.atomic_mass, curr.boil,
    curr.discovered_by, curr.melt, curr.molar_heat, curr.named_by,
    curr.phase, curr.spectral_image,
    curr.shells];
    
    $("#sidebar #element #symbol").html(curr.symbol);
    $("#sidebar #element #name").html(curr.name);
    $("#sidebar #source").attr("href", curr.source);

    
    $("#sidebar .info").each(function(i) {
        $(this).html(" " + info[i]);
    });

});

function formatCategory(category) {
    if (category.startsWith("unknown,")) {
        return "unknown";
    }
    return category.replace(/\ /g, "-");
}



