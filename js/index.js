const btnGetWeather = document.querySelector('.search-btn');
const cityName = document.querySelector('.city-name');
const weatherDate = document.querySelector('.weather-date');
const temperature = document.querySelector('.temperature');
const iconWeather = document.querySelector('.icon-weather');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const newWeather = document.querySelector('.new-weather');
const day5 = document.querySelector('.day-5');
const threeHours = document.querySelector('.three-hours');
const inputSearchCity = document.querySelector('.input-search-city');
const defaultCity = ['lviv']
const cityList = document.querySelector('.city-list');
let weatherHour;
let yourCities;

// start app =========================
if (localStorage.getItem("city-name") === null || localStorage["city-name"] === '[]') {
    localStorage.setItem("city-name", JSON.stringify(defaultCity).toLowerCase());
    xhttpRequesrtWeather(defaultCity[0]);
} else if (localStorage.getItem("city-name") != null) {
    let dataCityName = JSON.parse(localStorage["city-name"]);
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
    localStorageDataExchange(inputSearchCityValue)
    fillCityWeather(response);
    fetchWeatherHour(response.id)
};

// local Storage Data Exchange =============
function localStorageDataExchange(inputSearchCityValue) {
    let dataCityName = JSON.parse(localStorage["city-name"]);
    let presenceInData = dataCityName.indexOf(inputSearchCityValue)
    if (presenceInData == 0) {
        return
    } else if (presenceInData > 0) {
        dataCityName.unshift(dataCityName.splice(presenceInData, 1)[0]);
        localStorage.setItem("city-name", JSON.stringify(dataCityName));
    } else if (presenceInData == -1) {
        dataCityName.unshift(inputSearchCityValue);
        localStorage.setItem("city-name", JSON.stringify(dataCityName));
    }
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
    inputSearchCityValue = document.querySelector('.input-search-city').value.toLowerCase();
    if (inputSearchCityValue.length > 2) {
        xhttpRequesrtWeather(inputSearchCityValue)
    }
}

// visible/hide city List ============
cityList.addEventListener('click', function () {
    let listSelectedCities = document.querySelector('.selected-city');
    listSelectedCities.classList.toggle('visible-city-list');
    cityList.classList.toggle('close-menu');
    creationCitylist()
})

// creation city list ===================
function creationCitylist() {
    let listSelectedCities = document.querySelector('.selected-city');
    let selectedCities = JSON.parse(localStorage["city-name"])
    let tempCityList = ""
    for (let i = 0; i < selectedCities.length; i++) {
        selectedCities[i] = selectedCities[i].charAt(0).toUpperCase() + selectedCities[i].substr(1)
        tempCityList += `<li class="your-cities">${selectedCities[i]}<span></span></li>`
    }
    listSelectedCities.innerHTML = tempCityList;
    selectCities()
}

// select city ===================
function selectCities() {
    yourCities = document.querySelectorAll('.your-cities');
    yourCities.forEach(function (data) {
        data.addEventListener('click', function (event) {
            if (event.toElement.localName == 'li' && event.toElement.localName != 'span') {
                let tempCityName = event.target.firstChild.textContent.toLowerCase();
                xhttpRequesrtWeather(tempCityName);
                firstElementlocalStorage(tempCityName)
            } else if (event.toElement.localName == 'span') {
                let dellCity = event.toElement.parentElement.textContent.toLowerCase()
                dellSelectCities(dellCity, event)
            }
        })
    })
}

// New Weather ==================
newWeather.addEventListener('click', function () {
    let dataCityName = JSON.parse(localStorage["city-name"]);
    xhttpRequesrtWeather(dataCityName[0]);
})

// moving the selected city to the first element localStorage
function firstElementlocalStorage(tempCityName) {
    let tempLocalStorage = JSON.parse(localStorage["city-name"]);
    tempLocalStorage.forEach(function (data, i) {
        if (data == tempCityName) {
            tempLocalStorage.unshift(tempLocalStorage.splice(i, 1)[0]);
        }
    })
    localStorage.setItem("city-name", JSON.stringify(tempLocalStorage));
}

// dell selected city ==============
function dellSelectCities(dellCity, event) {
    event.target.parentElement.remove()
    let tempLocalStorage = JSON.parse(localStorage["city-name"])
    tempLocalStorage.forEach(function (data, i) {
        if (data == dellCity) {
            tempLocalStorage.splice(i, 1);
            if (i == 0 && tempLocalStorage.length > 0) {
                xhttpRequesrtWeather(tempLocalStorage[0])
            }
        }
    })
    localStorage.setItem("city-name", JSON.stringify(tempLocalStorage));
}

// get weather 5 day ====================
function fetchWeatherHour(cityId) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=0bf66710f118cd8dbd8d4055849f69aa`)
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            weatherHour = response;
            fiveDayWeatherForecast()
        })
        .catch(function () {
            console.log('the database did not load')
        });
}

day5.addEventListener('click', function () {
    if (weatherHour.cod == 200) {
        fiveDayWeatherForecast()
        document.querySelector('.three-hours-data').classList.toggle('fill');
        day5.classList.toggle('close-menu');
        threeHours.classList.toggle('close-menu');
    }
})

threeHours.addEventListener('click', function () {
    if (weatherHour.cod == 200) {
        fiveDayWeatherForecast()
        document.querySelector('.three-hours-data').classList.toggle('fill');
        threeHours.classList.toggle('close-menu');
        day5.classList.toggle('close-menu');
    }
})

// fill 5 day forecast ==================
function fiveDayWeatherForecast() {
    let hourlyWeatherForecast = `<p class="city-name">${weatherHour.city.name}  ${weatherHour.city.country} </p>`;
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