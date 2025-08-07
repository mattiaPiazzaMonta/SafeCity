// frontend/safecity-frontend/Map.jsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

//marker di default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Tipi di emergenze "con scadenza"
const SPECIAL_TYPES = [
  "Maremoto", "Tempesta", "Tromba d'aria", "Grandinata", "Nevicata",
  "Siccità", "Ondata di calore", "Ondata di Gelo", "Incendio", "Incidente",
  "Viabilità modificata", "Caduta albero su strada/edificio", "Blackout elettrico",
  "Guasto rete idrica/gas", "Malfunzionamento semafori",
  "Sversamento di sostanze tossiche", "Manifestazione pericolosa",
  "Avvistamento Animale pericoloso vagante"
];

function isRecent(created_at, days = 3) {
  if (!created_at) return false;
  const now = new Date();
  const created = new Date(created_at);
  const diffTime = now - created;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}

//ascolta il click sulla mappa
function ClickListener({ onSelect }) {
  useMapEvents({
    click(e) {
      if (onSelect) onSelect(e.latlng);
    }
  });
  return null;
}

//crea una nuova icona per il marker della segnalazione
function getEmergencyIcon(iconPath) {
  if (!iconPath) return new L.Icon.Default();
  return new L.Icon({
    iconUrl: iconPath,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
  });
}

const Map = ({
  onSelectPosition,
  currentPosition,
  selectedPosition,
  emergencies,
  onShowComments,
  user,
  onDeleteEmergency
}) => {
  const defaultCenter = currentPosition || [45.4642, 9.1900]; // Milano di default

  // Sanificazione
  let emergencyList = [];
  if (Array.isArray(emergencies)) {
    emergencyList = emergencies;
  } else if (emergencies && Array.isArray(emergencies.emergencies)) {
    emergencyList = emergencies.emergencies;
  }
 

  return (
    <MapContainer center={defaultCenter} zoom={13} style={{ height: '100vh' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marker per posizione attuale utente */}
      {currentPosition && (
        <Marker position={currentPosition}>
          <Popup>La tua posizione</Popup>
        </Marker>
      )}

      {/* Listener click sulla mappa */}
      <ClickListener onSelect={onSelectPosition} />

      {/* Marker temporaneo solo se selezionato */}
      {selectedPosition && (
        <Marker position={selectedPosition}>
          <Popup>
            Segnala qui?<br />
            <button onClick={() => onSelectPosition(selectedPosition)}>
              Segnala questa posizione
            </button>
          </Popup>
        </Marker>
      )}

      {/* Marker delle emergenze dal backend */}
      {emergencyList.map(em => {
        const coords = em.location?.coordinates;
        const position = coords && coords.length === 2
          ? [coords[1], coords[0]]
          : null;
        const iconPath = em.type?.icon_path || null;
        const typeLabel = (em.type?.label || '').trim();

        // FILTRO: per tipi speciali mostra solo se negli ultimi 4 giorni
        const isSpecial = SPECIAL_TYPES.includes(typeLabel);
        if (isSpecial && !isRecent(em.created_at)) return null;
        // Per tutti gli altri, mostra sempre

        if (!position) return null;

        return (
          <Marker
            key={em.id}
            position={position}
            icon={getEmergencyIcon(iconPath)}
          >
            <Popup>
              <strong>{em.type?.label || "Emergenza"}</strong><br />
              {em.description && <span>{em.description}<br /></span>}
              {em.created_at && <span>🕒 {new Date(em.created_at).toLocaleString()}<br /></span>}
              Stato: {em.status}<br />
              {/* ---- BOTTONE COMMENTI ---- */}
              <button
                style={{ marginTop: 8, padding: '5px 10px', borderRadius: 6, background: '#ddeafd', border: '1px solid #1555a1', cursor: 'pointer' }}
                onClick={() => onShowComments && onShowComments(em)}
              >
                Vedi commenti
              </button>
              {user?.ruolo === "moderator" && (
                <button
                  style={{
                    marginTop: 8,
                    marginLeft: 8,
                    padding: '5px 10px',
                    borderRadius: 6,
                    background: '#ffd6d6',
                    border: '1px solid #c0392b',
                    color: '#c0392b',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={() => onDeleteEmergency && onDeleteEmergency(em.id)}
                >
                  Elimina
                </button>
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
