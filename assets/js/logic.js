// Headline News
$("#headline-news").on("click", function () {

    // queryURL is the url we'll use to query the API
    var queryURL = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=5G5trsY71XEGyCzsg97O2rky6AnWpUOt&limit=1";

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        // After data comes back from the request
        .then(function (response) {

            var shorter = response.results.slice(0, 1);
            for (var i = 0; i < shorter.length; i++) {


                //Creating a div to hold the movie
                var newsDiv = $("<div class='news'>");

                // Storing headline abstract data
                var headline = shorter[i].abstract;

                // Creating an element to have headline abstract display
                var abstract = $("<h3>").text(headline);

                // Displaying the abstract
                newsDiv.append(abstract);

                // Storing the source
                var source = shorter[i].url;

                // Creating an element to have headline url displayed
                var newsSource = $("<a>").text(source);
                newsSource.attr('href', source);

                // Displaying the URL
                newsDiv.append(newsSource);

                // Putting the entire headline above the previous headlines
                $("#headline-view").html(newsDiv);
            }
        })
})


// To Do List
function renderTodos(list) {
    $("#to-dos").empty(); // empties out the html

    // render our todos to the page
    for (var i = 0; i < list.length; i++) {
        // Create a new variable that will hold a "<p>" tag.
        // Then set the to-do "value" as text to this <p> element.
        var toDoItem = $("<p>");
        toDoItem.text(list[i]);

        // Create a button with unique identifiers based on what number it is in the list. Again use jQuery to do this.
        // Give your button a data attribute called data-to-do and a class called "checkbox".
        // Lastly add a checkmark inside.

        var toDoClose = $("<button>");

        toDoClose.attr("data-to-do", i);
        toDoClose.addClass("checkbox");
        toDoClose.text("✓");

        // Append the button to the to do item
        toDoItem = toDoItem.prepend(toDoClose);

        // Add the button and to do item to the to-dos div
        $("#to-dos").append(toDoItem);
    }
}

$("#add-to-do").on("click", function (event) {
    event.preventDefault();

    // Get the to-do "value" from the textbox and store it as a variable
    var toDoTask = $("#to-do").val().trim();

    // Adding our new todo to our local list variable and adding it to local storage
    list.push(toDoTask);

    // Update the todos on the page
    renderTodos(list);

    // Save the todos into localstorage.
    // We need to use JSON.stringify to turn the list from an array into a string
    localStorage.setItem("todolist", JSON.stringify(list));

    // Clear the textbox when done
    $("#to-do").val("");
});

// When a user clicks a check box then delete the specific content
$(document).on("click", ".checkbox", function () {
    // Get the number of the button from its data attribute and hold in a variable called  toDoNumber.
    var toDoNumber = $(this).attr("data-to-do");

    // Deletes the item marked for deletion
    list.splice(toDoNumber, 1);

    // Update the todos on the page
    renderTodos(list);

    // Save the todos into localstorage.
    // We need to use JSON.stringify to turn the list from an array into a string
    localStorage.setItem("todolist", JSON.stringify(list));
});

// Load the todos from localstorage.
// We need to use JSON.parse to turn the string retrieved  from an array into a string
var list = JSON.parse(localStorage.getItem("todolist"));

// Checks to see if the todolist exists in localStorage and is an array currently
// If not, set a local list variable to an empty array
// Otherwise list is our current list of todos
if (!Array.isArray(list)) {
    list = [];
}

// render our todos on page load
renderTodos(list);



// Weather

function getWeather() {

    var zip = $("#zip-input").val();
    console.log(zip);

    // QueryURL for openWeatherMap
    var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&APPID=df05309380466da4ebc0626f93b711ac";

    $.ajax({
        url: weatherQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        function kelvinConvert(kelvin) {
            return Math.round(kelvin - 273.15)
        };

        var city = $("<h1>").text(response.name);
        var currentTemp = $("<h2>").text("Current: " + (Math.round(((response.main.temp) - 273.15) * (1.8) + 32)));
        var highTemp = $("<h3>").text("High: " + (Math.round(((response.main.temp_max) - 273.15) * (1.8) + 32)));
        var lowTemp = $("<h3>").text("Low: " + (Math.round(((response.main.temp_min) - 273.15) * (1.8) + 32)));
        var details = $("<h3>").text(response.weather[0].description);

        // NOTE: CAN ALSO ADD CORRESPONDING WEATHER ICON. LOOK INTO IT IF THERE'S TIME.
        $("#weather-div").empty();
        $("#weather-div").append(city, currentTemp, highTemp, lowTemp, details);
    });
};

$("#find-zip").on("click", function (event) {
    event.preventDefault();

    // Running the getWeather function(passing in the weather as an argument)
    getWeather();
})


//Commute Time
var key = "Ak1mPSqAHW1l1MRNPcHfPyf5W6Awjxu4iGI-YqF_d7yb0LE5Ik5opIazkb8glEAQ";

function geoLocation(origin, destination) {
    var startRes = encodeURI(origin);
    var endRes = encodeURI(destination)
    var queryURL = "http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=" + startRes + "&wp.1=" + endRes + "&optimize=timewithTraffic&key=" + key;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var totalSeconds = response.resourceSets[0].resources[0].travelDurationTraffic;
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        $("#display").html("<h3>Total Commute time " + hours + ":" + minutes + ":" + seconds + "<h3>");
    });
}
//gets origin and destination input from user
$("#submit").on("click", function (event) {
    event.preventDefault();

    var origin = $("#startPoint").val().trim();
    var destination = $("#endPoint").val().trim();
    geoLocation(origin, destination);
});


// Clock
function startTime() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    clean_ap = (hr < 12) ? "AM" : "PM";
    ap = (hr < 12) ? "<span>AM</span>" : "<span>PM</span>";
    hr = (hr == 0) ? 12 : hr;
    hr = (hr > 12) ? hr - 12 : hr;
    //Add a zero in front of numbers<10
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clock").innerHTML = hr + ":" + min + ":" + sec + " " + ap;

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var curWeekDay = days[today.getDay()];
    var curDay = today.getDate();
    var curMonth = months[today.getMonth()];
    var curYear = today.getFullYear();
    var date = curWeekDay + ", " + curDay + " " + curMonth + " " + curYear;
    document.getElementById("date").innerHTML = date;

    var time = setTimeout(function () {
        startTime()
    }, 500);

    if(clean_ap == "AM") {
        $('body').css('background-image', 'url(assets/images/Project1BkgdImg.jpg)');
    }
    else {
        $('body').css('background-image', 'url()');
    }

}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


//Inspirational Quote
//var quote = TheySaidSo.render({
//    qod_category: "inspire"
//});

//function addQuote(){
//$("#quote-div").append(quote);
//};


// Exercise Video
        // javascript items for the player, which append to the div above
        var player = DM.player(document.getElementById("player"), {
            playlist: "x4w70f",
            width: "100%",
            height: "100%",
            params: {
                autoplay: false,
                mute: true,
            }
        });