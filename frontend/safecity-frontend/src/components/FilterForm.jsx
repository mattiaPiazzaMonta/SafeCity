// components/FilterForm.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Importo i componenti della mappa secondaria
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png'; // Aggiunto
import './FilterForm.css';

function FilterForm({ onClose }) {
  const [types, setTypes] = useState([]); // Per memorizzare i tipi di emergenze
  const [selectedType, setSelectedType] = useState('');
  const [filteredEmergencies, setFilteredEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica i tipi di emergenza da backend
  useEffect(() => {
    fetch('/api/emergency-types')
      .then(res => res.json())
      .then(data => {
        setTypes(data);
        setLoading(false);
      })
      .catch(() => {
        console.error('Errore nel caricamento dei tipi di emergenza');
        setLoading(false);
      });
  }, []);

  // Funzione per applicare il filtro
  async function handleApplyFilter() {
    if (!selectedType) return;
    try {
      const res = await fetch('/api/emergencies/filter-emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedType })
      });
      const data = await res.json();
      setFilteredEmergencies(data); // Aggiorna le emergenze filtrate
    } catch (err) {
      console.error('Errore nel filtraggio delle emergenze:', err);
    }
  }

  // Funzione per creare un'icona personalizzata per i marker
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

  return (
    <div className="filter-form-container">
      <div className="filter-form">
        <h3>Filtra per tipo di emergenza</h3>
        
        {/* Dropdown per i tipi di emergenza */}
        <label>
          Tipo di emergenza:
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)} required>
            <option value="" disabled>Seleziona il tipo...</option>
            {types.map(t => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        {/* Bottone per applicare il filtro */}
        <button onClick={handleApplyFilter} className='apply'>Applica Filtri</button>

        {/* Bottone per chiudere il form */}
        <button onClick={onClose} className='x'>Chiudi</button>

        {/* Mappa secondaria che mostra le emergenze filtrate */}
        {filteredEmergencies.length > 0 ? (
          <div style={{ height: '300px' }}>
            <MapContainer center={[45.4642, 9.1900]} zoom={13} style={{ height: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              {/* Marker per ogni emergenza filtrata */}
              {filteredEmergencies.map(em => {
                const coords = em.location?.coordinates;
                const position = coords && coords.length === 2 ? [coords[1], coords[0]] : null;
                const iconPath = em.type?.icon_path || null;

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
                      {em.created_at && <span>🕒 {new Date(em.created_at).toLocaleString()}</span>}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        ) : (
          <p style={{ color: 'red', marginTop: '20px' }}>Nessuna segnalazione trovata per il tipo selezionato.</p>  
        )}
      </div>
    </div>
  );
}

export default FilterForm;
