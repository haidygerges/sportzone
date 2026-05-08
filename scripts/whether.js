let weatherApiKey = '63a895b8095929a0bfea9aea9486f5d8';

function fetchWeatherByCoords(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
  applyWeather(url);
}

function fetchWeatherByCity(city, country) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${weatherApiKey}&units=metric`;
  applyWeather(url);
}

function applyWeather(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      let iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      
      let degEl = document.getElementById('weatherDeg');
      let cityEl = document.getElementById('weatherCity');
      let iconEl = document.getElementById('WeIcon');
      if (degEl) degEl.innerHTML = data.main.temp.toFixed(1) + '°';
      if (cityEl) cityEl.innerHTML = data.name;
      if (iconEl) iconEl.setAttribute('src', iconUrl);

      
      let sidebarDeg  = document.getElementById('sidebarWeatherDeg');
      let sidebarCity = document.getElementById('sidebarWeatherCity');
      let sidebarIcon = document.getElementById('sidebarWeIcon');
      let descEl      = document.getElementById('desc');
      let feelsEl     = document.getElementById('felLike');
      let humEl       = document.getElementById('Humidity');
      let windEl      = document.getElementById('wind');
      let visEl       = document.getElementById('visabilty');

      if (sidebarDeg)  sidebarDeg.innerHTML  = data.main.temp.toFixed(1) + '°';
      if (sidebarCity) sidebarCity.innerHTML = data.name;
      if (sidebarIcon) sidebarIcon.setAttribute('src', iconUrl);
      if (descEl)      descEl.innerHTML      = data.weather[0].main;
      if (feelsEl)     feelsEl.innerHTML     = 'Feels like ' + data.main.feels_like.toFixed(1) + '°';
      if (humEl)       humEl.innerHTML       = data.main.humidity + '%';
      if (windEl)      windEl.innerHTML      = data.wind.speed + ' km/h';
      if (visEl)       visEl.innerHTML       = (data.visibility / 1000).toFixed(1) + ' km';
    })
    .catch(() => fetchWeatherByCity('cairo', 'EG'));
}


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    ()  => fetchWeatherByCity('cairo', 'EG')
  );
} else {
  fetchWeatherByCity('cairo', 'EG');
}