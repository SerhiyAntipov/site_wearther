let weatherHour;
let btnGetWeather = document.querySelector('.btn-search');

let cityName = document.querySelector('.city-name');
let temperature = document.querySelector('.temperature');
let iconWeather = document.querySelector('.icon-weather');
let humidity = document.querySelector('.humidity');
let wind = document.querySelector('.wind');
let sunrise = document.querySelector('.sunrise');
let sunset = document.querySelector('.sunset');
let yourCities;
let nameCity = document.querySelector('.name-city');

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
    xhttpRequesrtWeather(dataCityName[dataCityName.length - 1]);
}

// get weather =========================
function xhttpRequesrtWeather(nameCityValue) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.response);
            callbackWeather(response, nameCityValue)
        }
    };
    xhttp.open('GET', `http://api.openweathermap.org/data/2.5/weather?q=${nameCityValue}&appid=0bf66710f118cd8dbd8d4055849f69aa`, true);
    xhttp.send();
};

function callbackWeather(response, nameCityValue) {
    dataCitySet.add(nameCityValue.toLowerCase())
    localStorage.setItem("city-name", JSON.stringify(Array.from(dataCitySet)));
    fillCityWeather(response);
    fetchWeatherHour(response.id)
};

// fill city weather ==================
function fillCityWeather(response) {
    cityName.textContent = response.name + ' ' + response.sys.country;
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
    nameCityValue = document.querySelector('.name-city').value;
    if (nameCityValue.length > 2) {
        xhttpRequesrtWeather(nameCityValue)
    }
})

// creation city list ===================
cityList.addEventListener('click', function () {
    viewSelectedCities()
})

function viewSelectedCities() {
    let listSelectedCities = document.querySelector('.selected-city');
    let selectedCities = JSON.parse(localStorage["city-name"])
    let tempCityList = ""
    for (let i = 0; i < selectedCities.length; i++) {
        tempCityList += `<li class="your-cities">${selectedCities[i]}<span></span></li>`
    }
    listSelectedCities.innerHTML = tempCityList;
    listSelectedCities.classList.toggle('visible-city-list');
    selectCities(listSelectedCities)
}

// select Cities ===================
function selectCities(listSelectedCities) {
    yourCities = document.querySelectorAll('.your-cities');
    yourCities.forEach(function (data) {
        data.addEventListener('click', function (event) {
            if (event.toElement.localName == 'li' && event.toElement.localName != 'span') {
                console.log(event)
                xhttpRequesrtWeather(event.target.firstChild.textContent);
                listSelectedCities.classList.toggle('visible-city-list');
            } else if (event.toElement.localName == 'span') {
                let dellCity = event.toElement.parentElement.textContent
                dellSelectCities(dellCity, event)
            }
        })
    })
}


// dell select cities ==============
function dellSelectCities(dellCity, event) {
    console.log(dellCity)
    console.log(dataCitySet)
    dataCitySet.delete(dellCity);
    event.target.parentElement.remove()
    let tempLocalStorage = JSON.parse(localStorage["city-name"])
    tempLocalStorage.forEach(function (data, i) {
        if (data == dellCity) {
            tempLocalStorage.splice(i, 1)
        }
    })
    localStorage.setItem("city-name", JSON.stringify(tempLocalStorage));
}

// search city active ==============
nameCity.addEventListener('click', function () {
    if (document.querySelector('.selected-city').classList.contains('visible-city-list') == true) {
        document.querySelector('.selected-city').classList.remove('visible-city-list');
    }
})

// get weather 5 day ====================
function fetchWeatherHour(cityId) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=0bf66710f118cd8dbd8d4055849f69aa`)
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            weatherHour = response;
            console.log(weatherHour)
        })
        .catch(function () {
            console.log('the database did not load')
        });
}