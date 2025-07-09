//Api is the bridge between the frontend and backend,
//allowing the frontend to fetch weather data from the backend server.
const API_KEY = "54c8f6e61583c32fc56ecfe6e1e372ea"
const API_URL = "https://api.openweathermap.org/data/2.5/weather"

//fetching html elements
const cityInput = document.getElementById("cityInput")
const searchbtn = document.getElementById("searchbtn")
const weatherDisplay = document.getElementById("weatherDisplay")
const loading = document.querySelector("weatherDisplay")
const error = document.getElementById("error")
const errorMessage = document.getElementById("errorMessage")

//weather display elements
const cityName = document.getElementById("cityName")
const temperature = document.getElementById("temperature")
const description = document.getElementById("description")
const humidity = document.getElementById("humidity")
const windSpeed = document.getElementById("windSpeed")
const feelsLike = document.getElementById("feelsLike")


searchbtn.addEventListener("click",handleSearch)
cityInput.addEventListener("keypress",(event)=>{
    if(event.key === "Enter"){
        handleSearch()
    }
})
//declaration of the function
function handleSearch(){
    const city= cityInput.value.trim()
    //input validation
    if(!city){
        showError("Please enter a city name.")
        return
    }

    //clear previous data also show loading
    hideAllSelections()
    showLoading()

    //to fetch weather data
    fetchWeatherData(city)
}

//function to fetch weather data from the API
async function fetchWeatherData(city) {
    try {
        const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

        //now make api request
        const response = await fetch(url);
        if (!response.ok) {
            //handling different errors
            if (response.status === 404) {
                throw new Error("City not found. Please check the city name.");
            } else if (response.status === 401) {
                throw new Error("Invalid API key. Please check your API key.");
            } else {
                throw new Error("An error occurred while fetching weather data. Please try again later.");
            }
        }
        // parse this JSON response
        const data = await response.json();
        displayWeatherData(data);
    } catch(error) {
        //catching errors
        console.log("Error fetching weather data:", error);
        hideLoading();
        showError(error.message);
    }
}

//display weather function
function displayWeatherData(data) {
    hideLoading()
    
    //extracting data from the API response
    //the api returns a complex object, we need to access the relevant properties
    const cityNameText = `${data.name}, ${data.sys.country}`;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const feelsLikeTemp = Math.round(data.main.feels_like);
    const humidityValue = data.main.humidity;
    const windSpeedValue = Math.round(data.wind.speed);

    // Add weather icon from OpenWeatherMap
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    let iconImg = document.getElementById('weatherIcon');
    if (!iconImg) {
        iconImg = document.createElement('img');
        iconImg.id = 'weatherIcon';
        iconImg.alt = desc;
        iconImg.style.width = '80px';
        iconImg.style.height = '80px';
        cityName.parentNode.insertBefore(iconImg, cityName.nextSibling);
    }
    iconImg.src = iconUrl;
    iconImg.title = desc;

    cityName.textContent = cityNameText;
    temperature.innerHTML = `${temp} <span style="font-size:1.2rem;color:#f39c12;">°C</span>`;
    description.innerHTML = `<span style="text-transform:capitalize;">${desc}</span>`;
    feelsLike.innerHTML = `<b>Feels like:</b> ${feelsLikeTemp}°C`;
    humidity.innerHTML = `<b>Humidity:</b> ${humidityValue}%`;
    windSpeed.innerHTML = `<b>Wind:</b> ${windSpeedValue} m/s`;

    showWeatherDisplay();
}
function showLoading(){
    loading.classList.remove("hidden")
}
function hideLoading(){
    loading.classList.add("hidden")
}
// Shows an error message in the UI
function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove("hidden");
}
function hideError() {
    error.classList.add("hidden");
}
// Shows the weather display section
function showWeatherDisplay() {
    weatherDisplay.classList.remove("hidden");
    
}
function hideAllSelections(){
    hideError();
    hideLoading();
    hideWeatherDisplay();
}

function clearInput() {
    cityInput.value = "";
}
function testWithSampleData(){
    // Sample data for testing
    const sampleData = {
        name: "London",
        sys: { country: "GB" },
        main: {
            temp: 25,
            feels_like: 24,
            humidity: 60
        },
        weather: [{ description: "clear sky" }],
        wind: { speed: 5 }
    };
    
    displayWeatherData(sampleData);
}