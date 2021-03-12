// create variables
const deg = '\xB0';

const currentDate = moment().format('ddd MMMM DD' + ', ' + 'YYYY');
const currentTime = moment().format('LT');

const bgNight = document.querySelector('.night');
const bgDay = document.querySelector('.day');
const bgSunset = document.querySelector('.sunset');

const searchForm = document.querySelector('form');
const searchIcon = document.querySelector('#searchIcon');
const locationInput = document.querySelector('input');
const degContainer = document.querySelector('.deg-cont');
const degToggle = document.querySelector('#degToggle');
const toggleF = document.querySelector('#toggleF');
const toggleC = document.querySelector('#toggleC');
const degMeasurement = document.querySelector('#degMeasurement');
const currentTemp = document.querySelector('.currentTemp');
const currentFeels = document.querySelector('.currentFeels');
const currentHumidity = document.querySelector('.currentHumidity');
const uvIndex = document.querySelector('.currentUV');
const uvIcon = document.querySelector('#uvIcon');
const uvKey = document.querySelector('#uvKey');
const currentDesc = document.querySelector('.currentDesc');
const currentWind = document.querySelector('.currentWind');
const currentIcon = document.querySelector('.currentIcon');
const sectionHourly = document.querySelector('.hourly-card');
const sectionDaily = document.querySelector('.daily');

let lat;
let long;
let unit = degMeasurement.dataset.unit;

const date = document.querySelector('#date');
const time = document.querySelector('#time');

// use navigator.geolocation property to return geolocation object that gives web content access to location of device
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationSuccess, locationFail);
    } else {
      locationFail();
    }
  }

// fetch call with weather variables
function getWeather(lat, long) {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=${unit}&exclude=minutely&appid=93fbb945657a5e5ca75650241870b021`;
  
    fetch(currentWeatherURL).then(function (response) {
      return response.json().then(function (data) {
        const iconCode = data.current.weather[0].icon;
        const iconSource = `./assets/icons/${iconCode}.svg`;
        const currentUV = data.current.uvi;
        const latData = data.lat;
        const lonData = data.lon;
        console.log(latData, lonData);
  
        currentIcon.src = iconSource;
        currentIcon.alt = data.current.weather[0].description;
        currentTemp.textContent = Math.floor(data.current.temp) + deg;
        currentDesc.textContent = data.current.weather[0].description;
        currentWind.textContent = Math.floor(data.current.wind_speed) + 'mph';
        currentHumidity.textContent = data.current.humidity + '%';
        currentFeels.textContent = Math.floor(data.current.feels_like) + deg;
        uvIndex.textContent = currentUV.toString();

        // create logic for uv color coding
      if (currentUV < 3) {
        uvIcon.innerHTML = `<i class="fas fa-chevron-down"></i>`;
        uvIcon.style.color = '#9dfb98';
        uvKey.textContent = 'low';
        uvKey.style.color = '#9dfb98';
      } else if (currentUV > 3 && currentUV < 6) {
        uvIcon.innerHTML = `<i class="fas fa-window-minimize"></i>`;
        uvIcon.style.color = '#6aced5';
        uvKey.textContent = 'moderate';
        uvKey.style.color = '#6aced5';
      } else if (currentUV > 6 && currentUV < 8) {
        uvIcon.innerHTML = `<i class="fas fa-chevron-up"></i>`;
        uvIcon.style.color = '#d56a6a';
        uvKey.textContent = 'high';
        uvKey.style.color = '#d56a6a';
      } else if (currentUV > 8 && currentUV < 11) {
        uvIcon.innerHTML = `<i class="fas fa-chevron-up"></i><i class="fas fa-chevron-up"></i>`;
        uvIcon.style.color = '#b64747';
        uvKey.textContent = ' very high';
        uvKey.style.color = '#b64747';
      } else if (currentUV > 11) {
        uvIcon.innerHTML = `<i class="fas fa-exclamation-triangle"></i>`;
        uvIcon.style.color = '#cf3333';
        uvKey.textContent = ' danger';
        uvKey.style.color = '#cf3333';
      }