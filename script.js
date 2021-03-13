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

// fetch call, with variables for weather
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
  
        // hourly get specs and append
        let hourlyCard = data.hourly.slice(0, -24).map(function (item) {
          const hourlyTemp = Math.floor(item.temp) + deg;
          const hourlyIconCode = item.weather[0].icon;
          const hourlyIconSource = `./assets/icons/${hourlyIconCode}.svg`;
          const hourlyDesc = item.weather[0].description;
  
          // get hour for hourly display
          const hourUnix = item.dt;
          const hour = moment(hourUnix * 1000).format('ha');
  
          return `<div class="hourly-wrap">
              <div class="hourlyTime-card">
                <h6 class="hourly">${hour}</h6>
                <img src="${hourlyIconSource}" alt="${hourlyDesc}" class="hourlyIcon">
                <h4 class="hourlytemp">${hourlyTemp}</h4>
              </div>
            </div>`;
        });
        hourlyCard = hourlyCard.join('');
        sectionHourly.innerHTML = hourlyCard;
  
        let dailyCard = data.daily.map(function (item) {
          const dailyTemp = Math.floor(item.temp.day) + deg;
          const dailyHigh = Math.floor(item.temp.max) + deg;
          const dailyLow = Math.floor(item.temp.min) + deg;
          const dailyIconCode = item.weather[0].icon;
          const dailyIconSource = `./assets/icons/${dailyIconCode}.svg`;
          const dailyDesc = item.weather[0].description;
          const dailyHumidity = item.humidity;
          const dailyWind = item.wind_speed + '%';
  
          // get date for day display
          const dateUnix = item.dt;
          const date = moment(dateUnix * 1000).format('ddd, MMM DD');
  
          return `<div class="daily-card">
          <div class="card-center">
            <h5 class="dailyDate">${date}</h5>
            <img src="${dailyIconSource}" alt="${dailyDesc}" class="daily-icon">
            <h3 class="dailyTemp">${dailyTemp}</h3>
            <p class="dailyDesc">${dailyDesc}</p>
          </div>
  
          <div class="daily-inner-cont">
            <div class="card-side-left">
              <p>Humidity: <span class="dailyHumidity">${dailyHumidity}</span></p>
              <p>Wind: <span class="dailyWind">${dailyWind}</span></p>
            </div>
  
            <div class="card-side-right">
              <p>
                <i class="fas fa-angle-up"></i>
                <span class="high">${dailyHigh}</span>
              </p>
              <p>
                <i class="fas fa-angle-down"></i>
                <span class="low">${dailyLow}</span>
              </p>
            </div>
          </div>
        </div>`;
        });
        dailyCard = dailyCard.join('');
        sectionDaily.innerHTML = dailyCard;
  
        // for location display, fetch mapbox api
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=pk.eyJ1IjoieW9uZGF2IiwiYSI6ImNrbTMwdzVrcDFiOHEyb3FzMmZyM3BraTMifQ.WqR9QQOGPMezPeLCeRrelg`
        ).then(function (response) {
          return response.json().then(function (data) {
            const city = document.querySelector('#city');
            const state = document.querySelector('#state');
            city.innerHTML = `${data.features[0].context[2].text},`;
            state.innerHTML = `${data.features[0].context[5].text}`;
          });
        });
      });
    });
  }

// get weather from search bar
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let zipCode = locationInput.value;
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=93fbb945657a5e5ca75650241870b021`;
  
    fetch(currentWeatherURL).then(function (response) {
      return response.json().then(function (data) {
        getWeather(data.coord.lat, data.coord.lon);
        searchForm.reset();
      });
    });
  });

// toggle search bar
searchIcon.addEventListener('click', function () {
    console.log('click');
    locationInput.classList.toggle('show-input');
    locationInput.focus();
  });

// toggle farenheight/celcius and set data-unit attribute
degToggle.addEventListener('change', function () {
    if (this.checked) {
      degMeasurement.setAttribute('data-unit', 'imperial');
      toggleF.textContent = 'F' + deg;
      toggleC.textContent = '';
    } else {
      degMeasurement.setAttribute('data-unit', 'metric');
      toggleC.textContent = 'C' + deg;
      toggleF.textContent = '';
    }
    unit = degMeasurement.getAttribute('data-unit');
    getWeather(lat, long);
  });