const apiKey = 'acac6d84580d93b17236b2170e5895fb'; // <-- Replace with your API key from OpenWeatherMap

const weatherResult = document.getElementById('weatherResult');
const forecastResult = document.getElementById('forecastResult');
const cityInput = document.getElementById('cityInput');
const getWeatherButton = document.getElementById('getWeather');
const currentLocationButton = document.getElementById('currentLocation');

getWeatherButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherByCity(city);
        fetchForecastByCity(city);
    }
});

currentLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            fetchForecastByCoords(position.coords.latitude, position.coords.longitude);
        }, () => {
            weatherResult.innerHTML = 'Location access denied.';
        });
    }
});

function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

function fetchWeather(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                weatherResult.classList.add('show');
                weatherResult.innerHTML = `
                    <div class="weather-info">
                        <h2>${data.name}, ${data.sys.country}</h2>
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
                        <p>${data.weather[0].main} (${data.weather[0].description})</p>
                        <p>Temperature: ${data.main.temp}°C</p>
                        <p>Humidity: ${data.main.humidity}%</p>
                        <p>Wind: ${data.wind.speed} m/s</p>
                    </div>
                `;
            } else {
                weatherResult.innerHTML = `<p>${data.message}</p>`;
            }
        });
}

function fetchForecastByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetchForecast(url);
}

function fetchForecastByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchForecast(url);
}

function fetchForecast(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            forecastResult.classList.add('show');
            const forecastHTML = data.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => {
                return `
                    <div class="forecast-day">
                        <h4>${new Date(item.dt_txt).toLocaleDateString()}</h4>
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Icon">
                        <p>${item.weather[0].main}</p>
                        <p>${item.main.temp}°C</p>
                    </div>
                `;
            }).join('');
            forecastResult.innerHTML = `<div class="forecast">${forecastHTML}</div>`;
        });
}
