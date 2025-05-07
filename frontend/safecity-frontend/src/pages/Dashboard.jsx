// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css';

import L from 'leaflet';

// Icona personalizzata (fix warning)
const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/');
    
    // Ottenere posizione utente
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.warn('Permesso negato o errore geolocalizzazione:', err);
        // Posizione fallback opzionale
        setPosition([45.4642, 9.19]); // Milano
      }
    );
  }, [navigate]);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div>
          <h2>SafeCity</h2>
          <p>Benvenuto <strong>{user?.nome || 'utente'}</strong></p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="map-container">
        {position && (
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='© OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={userIcon}>
              <Popup>Sei qui!</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
