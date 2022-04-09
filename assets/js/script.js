// Variables 
var searchButton = $(".searchButton");
var apiKey = "d899707429dae12637678613a5874634";
var searchInput = "";
var currentWeatherIconEl = $(".weathericon");
var currentTempEl = $("#todaytemp");
var currentWindEl = $("#todaywind");
var currentHumidityEl = $("#todayhumi");
var currentUvEl = $("#uvindex");
var currentDate = moment().format("M/D/YYYY");
var nextDate = moment().add(i + 1, 'days').format("M/D/YYYY");
var cityName = "";

var dailyDivs = [$('#day-1-div'), $('#day-2-div'), $('#day-3-div'), $('#day-4-div'), $('#day-5-div')]

var savedCities = JSON.parse(localStorage.getItem('savedCities')) || []

// Forloop for persisting the data onto HMTL page
for (var i = 0; i < savedCities.length; i++) {

    var city = savedCities[i];
    var cityNameEl = $("<li>")
    cityNameEl.addClass("list-group-item btn btn-primary col-12 btn-style btn-recent")
    cityNameEl.text(city)

    $(".list-group").append(cityNameEl);
}

// Key count for local storage 
var keyCount = 0;
// Search button click event
searchButton.click(function() {

    searchInput = $(".searchcity").val();

    var previouslySavedCities = JSON.parse(localStorage.getItem("savedCities")) || []
    previouslySavedCities.push(searchInput)
    localStorage.setItem("savedCities", JSON.stringify(previouslySavedCities))

    getUserLocation(searchInput);
});

function getSavedCityWeather() {
    getUserLocation($(this).text())
}

// get coordinates for user location
function getUserLocation(searchInput) {
    // Get location lon and lat
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchInput + "&limit=1&appid=" + apiKey;

    // Make fetch request
    fetch(apiUrl).then(function(response) {
        // Check for valid response
        if (response.ok) {
            response.json().then(function(data) {
                // Gets the lon and lat of the location
                var locationLat = data[0].lat;
                var locationLon = data[0].lon;
                console.log(data);
                console.log(data[0].name);
                cityName = data[0].name;
                // Convert from Int to Str
                var latString = locationLat.toString();
                var lonString = locationLon.toString();

                // Call function to get values
                getLocationWeather(latString, lonString);
            });
        } else {
            alert("Location not found!");
        }
    }).catch(function(error) {
        alert("Unable to get weather");
    });



};

function getLocationWeather(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                
                console.log(data);
                // City Name and date
                var currentCityNameEl = $(".subtitle");
                currentCityNameEl.text(cityName.toUpperCase() + " (" + currentDate + ")");
                // Weather Icon
                var currentWeatherIconEl = $("#current-icon");
                currentWeatherIconEl.attr("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png")


                // Current Temp
                var currentTempEl = $("#todaytemp");
                currentTempEl.text(data.current.temp + "F");
                // Current Wind
                var currentWindEl = $("#todaywind");
                currentWindEl.text(data.current.wind_speed + "MPH");
                // Current Humidity
                var currentHumidityEl = $("#todayhumi");
                currentHumidityEl.text(data.current.humidity + "%");
                // Current Uv
                var currentUvEl = $("#uvindex");
                currentUvEl.text(data.current.uvi);


                for (var i = 0; i < dailyDivs.length; i++) {
                    // converting Unix to date
                    var humanDateFormat = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");

                        // get child elements of current div being looped over
                    dailyDivs[i].find(".dateText").text(humanDateFormat);
                    dailyDivs[i].find(".weathericon").attr("src", "https://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + ".png");
                    dailyDivs[i].find(".tempText").text(data.daily[i + 1].temp.day);
                    dailyDivs[i].find(".windText").text(data.daily[i + 1].wind_speed);
                    dailyDivs[i].find(".humidityText").text(data.daily[i + 1].humidity);
                }
            })
        }
    })
}

$("#citiesList").on("click", ".list-group-item", getSavedCityWeather)