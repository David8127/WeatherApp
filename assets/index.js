var inputEl = $("#cityInput");
var searchBtn = $("#searchBtn");
var currentDay = moment().format("dddd, MMM Do, YYYY");
var weatherNow;
var futureCast;
var apikey;

function getApiKey() {
    var keyHash = "cysFzulTAZ_IHud4mXm6S";
    fetch(
        `https://ljgvrb40q2.execute-api.us-west-2.amazonaws.com/dev/keyprr/${keyHash}`
    )
        .then((res) => res.json())
        .then(({ data }) => (apikey = data));
}

getApiKey();

function today() {
    document.getElementById("today").textContent = moment().format("dddd, MMMM Do");
}

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

};


function searchWeatherByLatLon(lat, lon) {
    var requestURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apikey}&units=imperial`;
    fetch(requestURL)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data)
            weatherNow = data.current;
            futureCast = data.daily;
            console.log(weatherNow);
            currentWeather();
            displayForcast();
        });
};

async function currentWeather() {
    var currentCard = document.getElementById("currently")
    currentCard.innerHTML = `
        <ul class = "list-group">
        <li class = "weatherDate list-group-item">Current Report:</li>
        <li class = "description list-group-item">${weatherNow.weather[0].description} ${generateIcons(weatherNow.weather[0].main)}</li>
        <li class = "temp list-group-item">Temp: ${weatherNow.temp}\u00B0F</li>
        <li class = "wind list-group-item"> Wind Speed: ${weatherNow.wind_speed} mph</li>
        <li class = "humidity list-group-item">Humidity: ${weatherNow.humidity} </li>
        </ul>
        `
}

async function displayForcast() {
    // console.log("You searched for the forcast of", cityName);
    var weatherCard = document.getElementsByClassName("card");
    for (let i = 1; i < 6; i++) {
        weatherCard[i].innerHTML = `
            <ul class = "list-group">
                <li class = "weatherDate list-group-item"> </li>
                <li class = "description list-group-item text-center">${futureCast[i].weather[0].description} ${generateIcons(futureCast[i].weather[0].main)} </li>
                <li class = "temp list-group-item">Temp: ${futureCast[i].temp.day}\u00B0F</li>
                <li class = "wind list-group-item"> Wind Speed: ${futureCast[i].wind_speed}mph </li>
                <li class = "humidity list-group-item">Humidity: ${futureCast[i].humidity} </li>
            </ul>
            `
    }
    showDates();
};

function generateIcons(weather) {
    switch (weather) {
        case "Atmosphere":
            return '🌫';
        case "Clear":
            return '🌞';
        case "Clouds":
            return '☁';
        case "Drizzle":
            return '🌦';
        case "Rain":
            return '🌧';
        case "Snow":
            return '🌨';
        case "Thunderstorm":
            return '⛈';
        default: ''
            break;
    }
}

function showDates() {
    //Populating the dates:
    var dateDisplay = $(".weatherDate");
    for (let i = 1; i < dateDisplay.length; i++) {
        dateDisplay[i].textContent = moment().add([i], 'd').format("ddd, MMM Do");
    }
}

searchBtn.on("click", function () {
    var inputVal = inputEl.val();
    searchCity(inputVal);

    // document.getElementById("weatherDate1").textContent = moment().format("ddd, MMM Do");
    // document.getElementById("weatherDate2").textContent = moment().add(1, 'd').format("ddd, MMM Do");
    // document.getElementById("weatherDate3").textContent = moment().add(2, 'd').format("ddd, MMM Do");
    // document.getElementById("weatherDate4").textContent = moment().add(3, 'd').format("ddd, MMM Do");
    // document.getElementById("weatherDate5").textContent = moment().add(4, 'd').format("ddd, MMM Do");
    // document.getElementById("weatherDate6").textContent = moment().add(5, 'd').format("ddd, MMM Do");
})

today();