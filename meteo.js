const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const statusMessage = document.getElementById('statusMessage');
const tempResult = document.getElementById('tempResult');
const cityName = document.getElementById('cityName');
const tempValue = document.getElementById('tempValue');
const weatherDesc = document.getElementById('weatherDesc');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

// Fonction principale asynchrone pour consommer l'API
async function getWeatherData(cityNameQuery) {
    try {
        // 1. État de chargement 
        statusMessage.textContent = "Recherche en cours...";
        tempResult.classList.add('hidden');

        // 2. Étape A : Trouver les coordonnées géographiques (Latitude/Longitude) d'après le nom de la ville
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityNameQuery}&count=1&language=fr&format=json`);
        const geoData = await geoResponse.json();

        // Gestion de l'erreur : Ville introuvable
        if (!geoData.results || geoData.results.length === 0) {
            statusMessage.textContent = "Ville introuvable. Veuillez réessayer.";
            return;
        }

        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;
        const name = location.name;
        const country = location.country || "";

        // 3. Étape B : Récupérer la météo avec les coordonnées obtenues
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const weatherData = await weatherResponse.json();

        const temperature = weatherData.current_weather.temperature;
        
        // Code météo simple converti en texte (Open-Meteo utilise des codes numériques)
        const weatherCode = weatherData.current_weather.weathercode;
        let description = "Temps clair";
        if (weatherCode > 0 && weatherCode < 40) description = "Nuageux / Partiellement couvert";
        if (weatherCode >= 50) description = "Pluvieux";

        // 4. Affichage des résultats dans le DOM
        cityName.textContent = `${name}, ${country}`;
        tempValue.textContent = temperature;
        weatherDesc.textContent = description;

        // Nettoyage de l'état de chargement et affichage de la carte
        statusMessage.textContent = "";
        weatherResult.classList.remove('hidden');

    } catch (error) {

        console.error(error);
        statusMessage.textContent = "Une erreur est survenue lors de la connexion.";
    }
}