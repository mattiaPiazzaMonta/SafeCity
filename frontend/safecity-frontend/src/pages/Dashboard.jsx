// frontend/safecity-frontend/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../Map';
import ReportForm from '../components/ReportForm';
import CommentsForm from '../components/CommentsForm';
import FilterForm from '../components/FilterForm'; // Importa il FilterForm
import { FaFilter } from 'react-icons/fa';
import WeatherForm from '../components/WeatherForm';
import './Dashboard.css';

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [userPosition, setUserPosition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [emergencies, setEmergencies] = useState([]);
  const [showWeatherForm, setShowWeatherForm] = useState(false);

  
  //stato FilterForm
  const [showFilterForm, setShowFilterForm] = useState(false); // Gestisce la visibilità del FilterForm

  // Stato per i commenti
  const [showCommentsForm, setShowCommentsForm] = useState(false);
  const [selectedEmergencyForComments, setSelectedEmergencyForComments] = useState(null);

  // Funzione di logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Ottieni posizione utente
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        setUserPosition([45.4642, 9.19]); // fallback Milano
      }
    );
  }, [navigate]);

  // Carica emergenze dal backend
  useEffect(() => {
    fetch('/api/emergencies')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEmergencies(data);
        else if (data && Array.isArray(data.emergencies)) setEmergencies(data.emergencies);
        else setEmergencies([]);
      })
      .catch(err => {
        setEmergencies([]);
        console.error('Errore caricamento emergenze:', err);
      });
  }, [showForm]);

  // Quando clicchi sulla mappa
  function handleSelectPosition(latlng) {
    setSelectedPosition([latlng.lat, latlng.lng]);
    setShowForm(true);
  }

  // Quando premi "Segnala dove sono"
  function handleReportHere() {
    if (userPosition) {
      setSelectedPosition(userPosition);
      setShowForm(true);
    }
  }

  // Chiudi form
  function handleCloseForm() {
    setShowForm(false);
    setSelectedPosition(null);
  }

  // Funzione per aprire il FilterForm
  function handleFilterClick() {
    setShowFilterForm(true); // Mostra il FilterForm
  }

  // Funzione per chiudere il FilterForm
  function handleCloseFilterForm() {
    setShowFilterForm(false); // Nasconde il FilterForm
  }

  //mostrare il modal dei commenti
  function handleShowComments(emergency) {
    setSelectedEmergencyForComments(emergency);
    setShowCommentsForm(true);
  }
  
  function handleCloseCommentsForm() {
    setShowCommentsForm(false);
    setSelectedEmergencyForComments(null);
  }

  function handleOpenWeatherForm() {
  setShowWeatherForm(true);
}
function handleCloseWeatherForm() {
  setShowWeatherForm(false);
}

async function handleDeleteEmergency(emergencyId) {
  if (!window.confirm("Sei sicuro di voler eliminare questa segnalazione?")) return;
  try {
    const res = await fetch(`/api/emergencies/${emergencyId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setEmergencies(emergencies.filter(e => e.id !== emergencyId));
    } else {
      const data = await res.json();
      alert(data.error || "Errore durante la cancellazione.");
    }
  } catch (err) {
    alert("Errore di rete.");
  }
}



  return (
    <div className="dashboard">
      <div className="sidebar">
        <div>
          <h2>SafeCity</h2>
          <p>Benvenuto <strong>{user?.nome || 'utente'}</strong></p>
          <p className="position-warning">📡 Posizione stimata (accesso Pc)</p>
        </div>
        <div>
          <button onClick={handleReportHere} className="report-here-button">
            Segnala dove sono
          </button>
        </div>
        <div>
          <button onClick={handleOpenWeatherForm} className="weather-button">
            Verifica meteo zona
          </button>
        </div>
        <div className="logout">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="map-container">
        <Map
          onSelectPosition={handleSelectPosition}
          currentPosition={userPosition}
          selectedPosition={selectedPosition}
          emergencies={emergencies}
          onShowComments={handleShowComments}
          user={user} 
          onDeleteEmergency={handleDeleteEmergency} 
        />
        {showForm && selectedPosition && (
          <div className="modal-overlay">
            <ReportForm
              position={selectedPosition}
              onClose={handleCloseForm}
            />
          </div>
        )}
        {showCommentsForm && selectedEmergencyForComments && (
          <div className="modal-overlay">
            <CommentsForm
              emergency={selectedEmergencyForComments}
              onClose={handleCloseCommentsForm}
              user={user}
            />
          </div>
        )}
        
        {/* Bottone per aprire il FilterForm */}
        <div>
          <button className="filter button" onClick={handleFilterClick}>
            <FaFilter size={24} color='#fff' />
          </button>
        </div>

        {/* Modal per il FilterForm */}
        {showFilterForm && (
          <div className="modal-overlay">
            <FilterForm onClose={handleCloseFilterForm} />
          </div>
        )}

        {/* Modal per il WeatherForm */}
      {showWeatherForm && (
        <div className="modal-overlay">
          <WeatherForm onClose={handleCloseWeatherForm} />
        </div>
      )}
      </div>
    </div>
  );
}

export default Dashboard;
