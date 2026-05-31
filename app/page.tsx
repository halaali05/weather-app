"use client";

import { useState, useEffect } from "react";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<{
    name: string;
    main: { temp: number; humidity: number };
    weather: { description: string; icon: string }[];
    wind: { speed: number };
    sys: { country: string };
  } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        setError("City not found");
        setWeather(null);
      } else {
        setWeather(data);
        setError("");
      }
    } catch (_) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h1>🌤 Weather App</h1>
        <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
          {user && <span style={{opacity: 0.7}}>👤 {user.displayName || user.email}</span>}
          <button className="btn-logout" onClick={() => signOut(auth)}>Logout</button>
        </div>
      </div>

      <div className="search-box">
        <input
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {error && <p className="error" style={{textAlign: "center"}}>{error}</p>}

      {weather && (
        <>
          <div className="weather-main">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              width={100}
              height={100}
            />
            <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
            <p className="weather-desc">{weather.weather[0].description}</p>
          </div>

          <div className="weather-grid">
            <div className="weather-item">
              <span>💧 Humidity</span>
              <p>{weather.main.humidity}%</p>
            </div>
            <div className="weather-item">
              <span>💨 Wind Speed</span>
              <p>{weather.wind.speed} m/s</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}