/*-------------------------


CLEANUP ON AISLE FOUR PLEASE


---------------------------*/
var el;
fillJson();
function fillJson() {
    var onSuccess = function(data) {
        el = data.elements;   
    };
    $.getJSON("assets/table.json", onSuccess);
}



// to keep count how many json elements we've gone through
var jsonIndex = 0;

// Make a variable with the JSON so you dont have to GET it again.

$.getJSON("assets/table.json", function (data) {
    var elements = data.elements;

    // Get the top 7 rows
    if (jsonIndex == 0) {
        for (var i = 0; i < 7; i++) {
            var row = $(".row-" + i);

            for (var j = 0; j < 18; j++) {
                if (contains(deadzones, i.toString() + j.toString())) {

                    if (i.toString() + j.toString() == "52") {
                        row.append(nrPlaceholderOne);
                    } else if (i.toString() + j.toString() == "62") {
                        row.append(nrPlaceholderTwo);
                    } else {
                        row.append(emptyBox);
                    }

                    continue;
                }
                var atomNumber = elements[jsonIndex].number;
                var atomicMass = elements[jsonIndex].atomic_mass.toFixed(4).slice(0, -1);
                var atomSymbol = elements[jsonIndex].symbol;
                var category = elements[jsonIndex].category;
                // Maybe
                //var atomicMass = elements[jsonIndex].name;


                var currentTemplate = template.replace("$number", atomNumber)
                    .replace("$letter", atomSymbol)
                    .replace("$weight", atomicMass);

                row.append(currentTemplate);

                // Add the corersponding color class
                row.children().last().addClass(getCategory(category));
                jsonIndex++;
            }
        }
    }

    // This needs to be here because if I have another request
    // Its going to load faster since the file will be shorter
    // And ruin everything.
    if (jsonIndex == 88) {

        for (var i = 7; i < 9; i++) {
            var row = $(".row-" + i);

            for (var j = 0; j < 15; j++) {
                var atomNumber = elements[jsonIndex].number;
                var atomicMass = elements[jsonIndex].atomic_mass.toFixed(4).slice(0, -1);
                var atomSymbol = elements[jsonIndex].symbol;
                var category = elements[jsonIndex].category;

                var currentTemplate = template.replace("$number", atomNumber)
                    .replace("$letter", atomSymbol)
                    .replace("$weight", atomicMass);

                row.append(currentTemplate);

                // Add the corersponding color class
                row.children().last().addClass(getCategory(category));
                jsonIndex++;
            }
        }
    }

    // Give IDS to all element boxes
    $(".element-box").each(function(i) {
        $(this).attr("id", i);
    });
});



$(document).on("mouseenter", ".element-box", function(){
    var curr = el[$(this).attr("id")];
    var info = [curr.appearance, curr.atomic_mass, curr.boil,
    curr.discovered_by, curr.melt, curr.molar_heat, curr.named_by,
    curr.phase, curr.source, curr.spectral_image,
    curr.shells];
    
    $("#element #symbol").html(curr.symbol);
    $("#element #name").html(curr.name);
    $("#sidebar .info").each(function(i) {
        $(this).html(" " + info[i]);
    });
});

function getCategory(category) {
    if (category.startsWith("unknown,")) {
        return "unknown";
    }
    return category.replace(/\ /g, "-");
}



