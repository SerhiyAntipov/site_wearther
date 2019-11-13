let weatherHour;
let btnGetWeather = document.querySelector('.search-btn');

let cityName = document.querySelector('.city-name');
let weatherDate = document.querySelector('.weather-date');
let temperature = document.querySelector('.temperature');
let iconWeather = document.querySelector('.icon-weather');
let humidity = document.querySelector('.humidity');
let wind = document.querySelector('.wind');
let sunrise = document.querySelector('.sunrise');
let sunset = document.querySelector('.sunset');
let newWeather = document.querySelector('.new-weather');
let day5 = document.querySelector('.day-5');
let threeHours = document.querySelector('.three-hours');
let yourCities;
let inputSearchCity = document.querySelector('.input-search-city');

let defaultCity = ['lviv']
let dataCitySet = new Set(defaultCity);
let cityList = document.querySelector('.city-list');

// start app =========================
if (localStorage.getItem("city-name") === null || localStorage["city-name"] === '[]') {
    localStorage.setItem("city-name", JSON.stringify(Array.from(dataCitySet)));
    xhttpRequesrtWeather(defaultCity[0]);
} else if (localStorage.getItem("city-name") != null) {
    let dataCityName = JSON.parse(localStorage["city-name"]);
    dataCitySet = new Set(dataCityName);
    xhttpRequesrtWeather(dataCityName[0]);
}

// get weather =========================
function xhttpRequesrtWeather(inputSearchCityValue) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.response);
            callbackWeather(response, inputSearchCityValue)
            creationCitylist()
            inputSearchCity.value = "";
        } else if (this.readyState == 4 && this.status == 404) {
            alert('Not Found')
        }
    };
    xhttp.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${inputSearchCityValue}&appid=0bf66710f118cd8dbd8d4055849f69aa`, true);
    xhttp.send();
};

function callbackWeather(response, inputSearchCityValue) {
    dataCitySet.add(inputSearchCityValue.toLowerCase())
    localStorage.setItem("city-name", JSON.stringify(Array.from(dataCitySet)));
    fillCityWeather(response);
    fetchWeatherHour(response.id)
};

// fill city weather ==================
function fillCityWeather(response) {
    cityName.textContent = response.name + ' ' + response.sys.country;

    let tempWeatherTime = new Date(response.dt * 1000)
    let dateString;
    dateString = tempWeatherTime.getDate() + "/";
    dateString += (tempWeatherTime.getMonth() + 1) + "/";
    dateString += tempWeatherTime.getFullYear() + "  ";
    dateString += tempWeatherTime.getHours() + ":";
    let tempMinute = tempWeatherTime.getMinutes()
    if (tempMinute < 10) {
        tempMinute = "0" + tempMinute;
    }
    dateString += tempMinute;
    weatherDate.textContent = dateString;

    temperature.innerHTML = `${(response.main.temp - 273.15).toFixed(1)}&deg; C`;
    iconWeather.setAttribute('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
    let sunr = new Date(response.sys.sunrise * 1000)
    let suns = new Date(response.sys.sunset * 1000)
    humidity.innerHTML = 'Humidity: ' + response.main.humidity + '&#37;';
    wind.textContent = 'Wind: ' + response.wind.speed + ' m/s';
    sunrise.textContent = 'Sunrise: ' + sunr.getHours() + ':' + sunr.getMinutes() + ':' + sunr.getSeconds();
    sunset.textContent = 'Sunset: ' + suns.getHours() + ':' + suns.getMinutes() + ':' + suns.getSeconds();
}

// search city ========================
btnGetWeather.addEventListener('click', function () {
    searchCity()
})

inputSearchCity.onkeypress = function (event) {
    if (event.charCode == 13) {
        searchCity()
    }
}

function searchCity() {
    inputSearchCityValue = document.querySelector('.input-search-city').value;
    if (inputSearchCityValue.length > 2) {
        xhttpRequesrtWeather(inputSearchCityValue)
    }
}

// visible/hide city List ============
cityList.addEventListener('click', function () {
    let listSelectedCities = document.querySelector('.selected-city');
    listSelectedCities.classList.toggle('visible-city-list');
    creationCitylist()
})

// creation city list ===================
function creationCitylist() {
    let listSelectedCities = document.querySelector('.selected-city');
    let selectedCities = JSON.parse(localStorage["city-name"])
    let tempCityList = ""
    for (let i = 0; i < selectedCities.length; i++) {
        tempCityList += `<li class="your-cities">${selectedCities[i]}<span></span></li>`
    }
    listSelectedCities.innerHTML = tempCityList;
    selectCities(listSelectedCities)
}

// select city ===================
function selectCities(listSelectedCities) {
    yourCities = document.querySelectorAll('.your-cities');
    yourCities.forEach(function (data) {
        data.addEventListener('click', function (event) {
            if (event.toElement.localName == 'li' && event.toElement.localName != 'span') {
                let tempCityName = event.target.firstChild.textContent;
                xhttpRequesrtWeather(tempCityName);
                // listSelectedCities.classList.toggle('visible-city-list');
                lastElementlocalStorage(tempCityName)
            } else if (event.toElement.localName == 'span') {
                let dellCity = event.toElement.parentElement.textContent
                dellSelectCities(dellCity, event)
            }
        })
    })
}

// New Weather ==================
newWeather.addEventListener('click', function () {
    xhttpRequesrtWeather(Array.from(dataCitySet)[0]);
})

// moving the selected city to the first element localStorage
function lastElementlocalStorage(tempCityName) {
    let tempLocalStorage = JSON.parse(localStorage["city-name"]);
    tempLocalStorage.forEach(function (data, i) {
        if (data == tempCityName) {
            tempLocalStorage.unshift(tempLocalStorage.splice(i, 1)[0]);
        }
    })
    dataCitySet = new Set(tempLocalStorage);
    localStorage.setItem("city-name", JSON.stringify(tempLocalStorage));
}

// dell selected city + (last city) ==============
function dellSelectCities(dellCity, event) {
    dataCitySet.delete(dellCity);
    event.target.parentElement.remove()
    let tempLocalStorage = JSON.parse(localStorage["city-name"])
    tempLocalStorage.forEach(function (data, i) {
        if (data == dellCity) {
            tempLocalStorage.splice(i, 1)
            if (i == tempLocalStorage.length && tempLocalStorage.length > 1) {
                xhttpRequesrtWeather(tempLocalStorage[0])
            }
        }
    })
    localStorage.setItem("city-name", JSON.stringify(tempLocalStorage));
}

// input 'search city' active ==============
inputSearchCity.addEventListener('click', function () {
    if (document.querySelector('.selected-city').classList.contains('visible-city-list') == true) {
        // document.querySelector('.selected-city').classList.remove('visible-city-list');
    }
})

// get weather 5 day ====================
function fetchWeatherHour(cityId) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=0bf66710f118cd8dbd8d4055849f69aa`)
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            weatherHour = response;
            weatherOnHour();
            fiveDayWeatherForecast();
        })
        .catch(function () {
            console.log('the database did not load')
        });
}



function fiveDayWeatherForecast() {
    day5.addEventListener('click', function () {
        tempWeather()
        document.querySelector('.three-hours-data').classList.toggle('fill')
    })
}

function weatherOnHour() {
    threeHours.addEventListener('click', function () {
        tempWeather()
        document.querySelector('.three-hours-data').classList.toggle('fill')
    })
}

function tempWeather() {
    let hourlyWeatherForecast = "";
    let wiewDate = "2019-11-12"
    weatherHour.list.forEach(function (data) {
        let date = data.dt_txt.slice(0, 10);
        let time = data.dt_txt.slice(10, 16);
        if (date !== wiewDate) {
            hourlyWeatherForecast += `<p class="hour-date"> date ${date}</p>`
            hourlyWeatherForecast += `<p class="hour-time">${time}  ${data.weather[0].main}  ${(data.main.temp - 273.15).toFixed(1)} &deg;C</p>`
            wiewDate = date
        } else {
            hourlyWeatherForecast += `<p class="hour-time">${time}  ${data.weather[0].main}  ${(data.main.temp - 273.15).toFixed(1)} &deg;C </p>`
        }
    })
    document.querySelector('.three-hours-data').innerHTML = hourlyWeatherForecast;
}