import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import { RainEffect, SunEffect, CloudEffect, SnowEffect, NightEffect, FogEffect } from './components/WeatherBackground';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
console.log('Using API Key:', API_KEY);

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Bengaluru');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (targetCity) => {
    if (!API_KEY) {
      setError('API key is missing. Add VITE_WEATHER_API_KEY to your .env file.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching weather for:', targetCity);
      const res = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(targetCity)}&days=7&aqi=yes&alerts=yes`
      )
      console.log('Weather Data:', res.data);
      setWeather(res.data);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.response?.data?.error?.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(city); }, []);

  const handleSearch = (newCity) => {
    setCity(newCity);
    fetchWeather(newCity);
  };

  const isDay = weather?.current?.is_day === 1;
  const condition = weather?.current?.condition?.text?.toLowerCase() ?? '';

  const isRaining = condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower') || condition.includes('thunder');
  const isSnow = condition.includes('snow') || condition.includes('ice') || condition.includes('sleet');
  const isCloudy = condition.includes('cloud') || condition.includes('overcast');
  const isMisty = condition.includes('mist') || condition.includes('fog') || condition.includes('haze');

  const BgEffect = !weather ? null
    : isRaining ? RainEffect
      : isSnow ? SnowEffect
        : isMisty ? FogEffect
          : isCloudy ? CloudEffect
            : isDay ? SunEffect
              : NightEffect;

  return (
    <div className="app-root">
      {/* <div style={{position: 'fixed', top: 10, left: 10, zIndex: 9999, color: 'red', fontSize: '20px'}}>App Mounted</div> */}
      {BgEffect && <BgEffect />}

      {loading && (
        <div className="loading-screen">
          <div className="loading-spinner" />
          Loading…
        </div>
      )}

      {error && !loading && (
        <div className="error-toast">
          {error}
        </div>
      )}

      {weather && !loading && (
        <WeatherCard data={weather} onSearch={handleSearch} />
      )}
    </div>
  );
}

export default App;