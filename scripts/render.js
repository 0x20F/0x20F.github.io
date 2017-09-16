var jsonIndex = 0;

        // Make a variable with the JSON so you dont have to GET it again.

        $.getJSON("assets/table.json", function (data) {
            var elements = data.elements;

            // Get the top 7 rows
            if (jsonIndex == 0) {
                for (var i = 0; i < 7; i++) {
                    var row = $(".row-" + i);
                    console.log("row-" + i);

                    for (var j = 0; j < 18; j++) {
                        if (contains(deadzones, i.toString() + j.toString())) {
                            console.log("DeadZone: " + i.toString() + j.toString());

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

                console.log("In here");
                for (var i = 7; i < 9; i++) {
                    var row = $(".row-" + i);

                    console.log("row-" + i);

                    for (var j = 0; j < 15; j++) {
                        console.log("Adding");
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
        });

        
        function getCategory(category) {
            if(category.startsWith("unknown,")) {
                return "unknown";
            }
            return category.replace(/\ /g, "-");
        }