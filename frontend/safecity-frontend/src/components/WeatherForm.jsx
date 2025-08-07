import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import './FilterForm.css'; // Riutilizza stile

// Fix icone Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: markerShadow,
});

const API_KEY = '4c258a10bd9d049f29ea9e918e90fcd5'; 

function WeatherForm({ onClose }) {
  const [position, setPosition] = useState([45.4642, 9.19]); // Milano come default
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Listener per click sulla mappa
  function LocationSelector() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setWeather(null); // Resetto i dati meteo quando si seleziona una nuova posizione
        setErr('');
      }
    });
    return null;
  }

  // Recupera meteo per la posizione
  async function handleGetWeather() {
    setLoading(true);
    setErr('');
    setWeather(null);
    try {
      const [lat, lon] = position;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=it`
      );
      if (!res.ok) throw new Error('Errore richiesta meteo');
      const data = await res.json();
      setWeather({
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        temp: Math.round(data.main.temp),
        city: data.name || `(${lat.toFixed(3)}, ${lon.toFixed(3)})`,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
    } catch (error) {
      setErr('Errore nel recupero dei dati meteo.');
    }
    setLoading(false);
  }

  return (
    <div className="filter-form-container">
      <div className="filter-form">
        <h3>Verifica Meteo in una Zona</h3>

        <div className="map-container" style={{marginBottom: 20}}>
          <MapContainer center={position} zoom={10} style={{height: '250px'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} />
            <LocationSelector />
          </MapContainer>
        </div>

        <div style={{marginBottom: 10}}>
          <label>
            Latitudine:&nbsp;
            <input
              type="number"
              value={position[0]}
              step="0.0001"
              onChange={e => setPosition([parseFloat(e.target.value), position[1]])}
              style={{width: 100, marginRight: 10}}
            />
            Longitudine:&nbsp;
            <input
              type="number"
              value={position[1]}
              step="0.0001"
              onChange={e => setPosition([position[0], parseFloat(e.target.value)])}
              style={{width: 100}}
            />
          </label>
        </div>

        <button onClick={handleGetWeather} className="apply" disabled={loading}>
          {loading ? "Caricamento..." : "Verifica Meteo"}
        </button>
        <button onClick={onClose} className="x">Chiudi</button>

        {err && <p style={{color: 'red'}}>{err}</p>}

        {weather && (
          <div className="weather-widget" style={{marginTop: 20, background: "#eef6fc", borderRadius: 8, padding: 15}}>
            <h4 style={{margin: 0, marginBottom: 6}}>Meteo a {weather.city}</h4>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="" style={{width: 48, height: 48}} />
              <div style={{marginLeft: 10}}>
                <div style={{fontSize: 22, fontWeight: 600}}>{weather.temp}°C</div>
                <div style={{fontSize: 15, color: "#333"}}>{weather.description}</div>
                <div style={{fontSize: 13, color: "#555"}}>
                  💧 {weather.humidity}% &nbsp; | &nbsp; 💨 {weather.wind} m/s
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default WeatherForm;
