var inputEl = $("#cityInput");
var searchBtn = $("#searchBtn");
var dateDisplay = $(".weatherDate");
var currentDay = moment().format("dddd, MMM Do, YYYY");
var weatherForcast;
var apikey;
var cityName;

function getApiKey() {
    var keyHash = "cysFzulTAZ_IHud4mXm6S";
    fetch(
        `https://ljgvrb40q2.execute-api.us-west-2.amazonaws.com/dev/keyprr/${keyHash}`
    )
        .then((res) => res.json())
        .then(({ data }) => (apikey = data));
}

getApiKey();

function searchCity(city, limit = 5) {
    var requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apikey}`
    fetch(requestURL)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            cityName = data[0].local_names.en
            var lon = data[0].lon;
            var lat = data[0].lat;
            searchWeatherByLatLon(lat, lon);
        });

}

function searchWeatherByLatLon(lat, lon) {
    var requestURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apikey}&units=imperial`;
    fetch(requestURL)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data)
            weatherForcast = data.current;
            console.log(weatherForcast)
        });
    //   displayWeatherData(data)
}


// dayForcast();

// function displayForcast() {
//     console.log("You searched for the forcast of", cityName);
//     dateDisplay.textContent = weatherForcast.




// }

// displayForcast();

searchBtn.on("click", function () {
    var inputVal = inputEl.val();
    searchCity(inputVal);

    //Populating the dates:
    document.getElementById("weatherDate1").textContent = moment().format("ddd, MMM Do");
    document.getElementById("weatherDate2").textContent = moment().add(1, 'd').format("ddd, MMM Do");
    document.getElementById("weatherDate3").textContent = moment().add(2, 'd').format("ddd, MMM Do");
    document.getElementById("weatherDate4").textContent = moment().add(3, 'd').format("ddd, MMM Do");
    document.getElementById("weatherDate5").textContent = moment().add(4, 'd').format("ddd, MMM Do");
    document.getElementById("weatherDate6").textContent = moment().add(5, 'd').format("ddd, MMM Do");
})