const WEATHER_API_KEY = 'GN4YUWFQVPGGGPPZSPLF5MGWX';
const weatherForm = document.getElementById('weather-form');
const locationInput = document.getElementById('location');
const unitToggle = document.getElementById('unit-toggle');
const loadingDiv = document.getElementById('loading');
const weatherInfoDiv = document.getElementById('weather-info');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');

weatherForm.addEventListener('submit', handleSubmit);
unitToggle.addEventListener('change', updateWeatherDisplay)

let currentWeatherData = null;

async function handleSubmit(event) {
    event.preventDefault();
    const location = locationInput.value;
    showLoading();
    try {
        const weatherData = await getWeatherData(location);
        currentWeatherData = processWeatherData(weatherData);
        updateWeatherDisplay();
        updateBackgroundImage(currentWeatherData.currentConditions.icon);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfoDiv.textContent = 'Error fetching weather data. Please try again.';
    }
    hideLoading();
}

async function getWeatherData(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${WEATHER_API_KEY}&contentType=json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather data not found.');
    }
    return response.json();
}

function processWeatherData(data) {
    return {
        location: data.resolvedAddress,
        currentConditions: {
            temperature: data.currentConditions.temp,
            condition: data.currentConditions.conditions,
            icon: data.currentConditions.icon,
            humidity: data.currentConditions.humidity,
            windSpeed: data.currentConditions.windspeed
        },
        forecast: data.days.slice(1, 6).map(day => ({
            date: new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' }),
            maxTemp: day.tempmax,
            minTemp: day.tempmin,
            condition: day.conditions,
            icon: day.icon
        }))
    };
}

function updateWeatherDisplay() {
    if (!currentWeatherData) return;

    const isCelsius = !unitToggle.checked;
    updateCurrentWeatherDisplay(isCelsius);
    updateForecast(isCelsius);
    weatherInfoDiv.classList.remove('hidden');
}

function updateCurrentWeatherDisplay(isCelsius) {
    
    const { temperature, condition, humidity, windSpeed } = currentWeatherData.currentConditions;
    const displayTemp = isCelsius ? temperature : celsiusToFahrenheit(temperature);
    const unit = isCelsius ? '°C' : '°F';

    currentWeatherDiv.innerHTML = `
        <h2>${currentWeatherData.location}</h2>
        <p>Temperature: ${displayTemp.toFixed(1)} ${unit}</p>
        <p>Condition: ${condition}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} km/h</p>
    `;

}

function updateForecast(isCelsius) {
    forecastDiv.innerHTML = currentWeatherData.forecast.map(day => {
        const maxTemp = isCelsius ? day.maxTemp : celsiusToFahrenheit(day.maxTemp);
        const minTemp = isCelsius ? day.minTemp : celsiusToFahrenheit(day.minTemp);
        const unit = isCelsius ? '°C' : '°F';

        return `
            <div class="forecast-day">
                <p>${day.date}</p>
                <p>${maxTemp.toFixed(1)}${unit} / ${minTemp.toFixed(1)}${unit}</p>
                <p>${day.condition}</p>
            </div>
        `;
    }).join('');
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function updateBackgroundImage(weatherIcon) {
    const backgroundImages = {
        'clear-day': 'https://www.bpmcdn.com/f/files/langley/import/2020-02/20629626_web1_Langley-Weather-Sun-Clear-Sky-Skies.jpg',
        'clear-night': 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'cloudy': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2002&q=80',
        'fog': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
        'partly-cloudy-day': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        'partly-cloudy-night': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80',
        'rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80',
        'snow': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2008&q=80',
        'wind': 'https://images.unsplash.com/photo-1506888861922-6311fd190754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    };

    const defaultImage = 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
    const backgroundImage = backgroundImages[weatherIcon] || defaultImage;
    document.body.style.backgroundImage = `url(${backgroundImage})`;
}

function showLoading() {
    loadingDiv.classList.remove('hidden');
    weatherInfoDiv.classList.add('hidden');
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
}
