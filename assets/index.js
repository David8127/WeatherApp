var inputEl = $("#cityInput");
var searchBtn = $("#searchBtn");
var currentDay = moment().format("dddd, MMM Do, YYYY");
var apikey;
//variables for collected weather data
var weatherNow;
var futureCast;

function getApiKey() {
    var keyHash = "cysFzulTAZ_IHud4mXm6S";
    fetch(
        `https://ljgvrb40q2.execute-api.us-west-2.amazonaws.com/dev/keyprr/${keyHash}`
    )
        .then((res) => res.json())
        .then(({ data }) => (apikey = data));
}

getApiKey();

//triggers weather data search for city inputted by user
searchBtn.on("click", function () {
    var inputVal = inputEl.val();
    searchCity(inputVal);
})

//get today's date and render it at the top of the page
function today() {
    document.getElementById("today").textContent = moment().format("dddd, MMMM Do");
}

//uses api to get latitude and longitude coodrdinates of searched city
function searchCity(city, limit = 5) {
    addToHistory(city)
    var requestURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apikey}`
    fetch(requestURL)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            var lon = data[0].lon;
            var lat = data[0].lat;
            searchWeatherByLatLon(lat, lon);
        })
        .catch(error => {
            alert(`Couldn't find that city`)
        });
};

//get the weather data for the searched city based on its lat & lon
function searchWeatherByLatLon(lat, lon) {
    var requestURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apikey}&units=imperial`;
    fetch(requestURL)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data)
            //current and projected weather data assigned to variables
            weatherNow = data.current;
            futureCast = data.daily;
            //functions that take in the data and display it
            currentWeather();
            displayForecast();
        });
};


var previousSearchHistory = localStorage.getItem('history')
if (previousSearchHistory) {
    previousSearchHistory = JSON.parse(previousSearchHistory)
} else {
    previousSearchHistory = []
}

//add searched cities to local storage and create history for each
function addToHistory(city) {
    //analyzes local storage history; creates new items in local storage
    var searchHistory = localStorage.getItem('history')
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory)
        //loop though array, dont add city to history that's already been searched
        for (var i = 0; i < searchHistory.length; i++) {
            if (searchHistory[i] === city) {
                return ''
            }
        }
        searchHistory.push(city)
        localStorage.setItem('history', JSON.stringify(searchHistory))
    } else {
        searchHistory = [city]
        localStorage.setItem('history', JSON.stringify(searchHistory))
    }
    //creates button for each unique city name
    //each button can be clicked again to search for that city's data
    for (var i = 0; i < searchHistory.length; i++) {
        var historyBtn = document.createElement('button')
        var historyCity = searchHistory[i]
        historyBtn.textContent = historyCity
        historyBtn.addEventListener('click', function (event) {
            searchCity(event.target.textContent)
        })
        var historySection = document.getElementById('history')
        var buttonContainer = document.createElement('p')
        buttonContainer.appendChild(historyBtn)
        historySection.appendChild(buttonContainer)
    }
};

//displays current weather in the inputted area 
async function currentWeather() {
    var currentCard = document.getElementById("currently")
    currentCard.innerHTML = `
        <ul class = "list-group text-center">
        <li class = "weatherDate list-group-item">Current Report:</li>
        <li class = "description list-group-item">${weatherNow.weather[0].description} ${generateIcons(weatherNow.weather[0].main)}</li>
        <li class = "temp list-group-item">Temp: ${weatherNow.temp}\u00B0F</li>
        <li class = "wind list-group-item"> Wind Speed: ${weatherNow.wind_speed} mph</li>
        <li class = "humidity list-group-item">Humidity: ${weatherNow.humidity} </li>
        </ul>
        `
}

//displays the five-day forecast
async function displayForecast() {
    var weatherCard = document.getElementsByClassName("card");
    for (let i = 1; i < 6; i++) {
        weatherCard[i].innerHTML = `
            <ul class = "list-group text-center">
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

//lists icons based on general weather description from API data
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
};

//display dates for the 5-day forecast
function showDates() {
    //Populating the dates:
    var dateDisplay = $(".weatherDate");
    for (let i = 1; i < dateDisplay.length; i++) {
        dateDisplay[i].textContent = moment().add([i], 'd').format("ddd, MMM Do");
    }
}

today();