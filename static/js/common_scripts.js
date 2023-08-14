document.addEventListener("DOMContentLoaded", () => {
    async function fetchWeather() {
        const weatherResponse = await fetch("https://api.open-meteo.com/v1/forecast?latitude=42.0664&longitude=-87.9373&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,weathercode,visibility,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FChicago&forecast_days=16");
        const fetchedWeatherData = await weatherResponse.json();
        const weatherCodeMappings = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Cloudy",
            45: "Fog and depositing rime fog",
            48: "Fog and depositing rime fog",
            51: "Drizzle: Light intensity",
            53: "Drizzle: Moderate intensity",
            55: "Drizzle: Dense intensity",
            56: "Freezing Drizzle: Light intensity",
            57: "Freezing Drizzle: Dense intensity",
            61: "Rain: Slight intensity",
            63: "Rain: Moderate intensity", 
            65: "Rain: Heavy intensity",
            66: "Freezing Rain: Light intensity",
            67: "Freezing Rain: Heavy intensity",
            71: "Snow fall: Slight intensity",
            73: "Snow fall: Moderate intensity",
            75: "Snow fall: Heavy intensity",
            77: "Snow grains",
            80: "Rain showers: Slight intensity",
            81: "Rain showers: Moderate intensity",
            82: "Rain showers: Violent intensity",
            85: "Snow showers: Slight intensity",
            86: "Snow showers: Heavy intensity",
            95: "Thunderstorm: Slight or moderate",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail"
        };

        async function getLocation(lat, lon) {
            const locationResponse = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`);
            const fetchedLocationData = await locationResponse.json();
            
            const formatedLocation = `${fetchedLocationData['address']['state']}, ${fetchedLocationData['address']['country_code'].toUpperCase()}`
            return formatedLocation;
        }

        function getDate() {
            let date = new Date();
            const dayNumber = date.getDate();
            const month = date.getUTCMonth();
            const year = date.getFullYear();
            let hour = date.getHours();
            const minute = date.getUTCMinutes();
            const meridiem = hour >= 12 ? 'PM' : 'AM';
        
            if (hour > 12) {
                hour -= 12;
            }
            if (hour === 0) {
                hour = 12;
            }
        
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
        
            const formattedMinute = minute < 10 ? `0${minute}` : minute;
        
            return `${dayNumber} ${monthNames[month]}, ${year} ${hour}:${formattedMinute} ${meridiem}`;
        }

        function getOverviewTemperature() {
            const date = new Date();
            const currentHour = date.getHours();

            const currentHourIndex = fetchedWeatherData['hourly']['time'].findIndex(time => {
                const hour = new Date(time).getHours();
                return hour === currentHour;
            });

            if (currentHourIndex !== -1) {
                const currentHourTemperature = fetchedWeatherData['hourly']['temperature_2m'][currentHourIndex];
                return currentHourTemperature;
            } else {
                return null;
            }
        }

        async function updateDailyOverview() {
            const overviewTemperature = document.getElementById('overview-temperature');
            const overviewWeatherCode = document.getElementById('overview-weather-code');
            const overviewLocation = document.getElementById('overview-location');
            const overviewDate = document.getElementById('overview-date');

            overviewTemperature.textContent = `${getOverviewTemperature()}°F`;
            overviewWeatherCode.textContent = weatherCodeMappings[fetchedWeatherData['daily']['weathercode'][0]];
            overviewLocation.textContent = await getLocation(fetchedWeatherData['latitude'], fetchedWeatherData['longitude']);
            overviewDate.textContent = getDate();
        }

        function updateDailyHighlights() {
            
        }

        // console.log(fetchedWeatherData);
    }
    
    fetchWeather();
});