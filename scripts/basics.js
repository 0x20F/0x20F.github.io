// This feels like such a bad idea
            // Deadzones for the top 7 rows of the table
            var deadzones = ["01", "02", "03", "04", "05", "06", "07", "08",
            "09", "010", "011", "012", "013", "014", "015", "016",
           "12", "13", "14", "15", "16", "17", "18", "19", "110", "111",
           "22", "23", "24", "25", "26", "27", "28", "29", "210", "211",
            "52", "62"];
           
           var template = "<div class=\"element-box\">" +
               "<div class=\"atom-number\">" +
                   "$number" +
               "</div>" +
               "<div class=\"atom-symbol\">" +
                   "$letter" +
               "</div>" +
               "<div class=\"atom-mass\">" +
                   "$weight" +
               "</div>" +
           "</div>";
           
           var emptyBox = "<div class=\"empty-box\"></div>";

           
           function contains(array, needle) {
               for(var i = 0; i < array.length; i++) {
                   if(array[i] == needle) {
                       console.log(array[i] + " == " + needle);
                       return true;
                   }
               }
               return false;
           }