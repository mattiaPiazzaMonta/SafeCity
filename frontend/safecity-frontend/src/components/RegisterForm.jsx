// src/components/RegisterForm.jsx
import { useState } from 'react';
import API from '../services/api';

function RegisterForm({ onRegisterSuccess, switchToLogin }) {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/register', { nome, cognome, username, email, password });
      alert('Registrazione completata! Ora puoi fare il login.');
      switchToLogin();
    } catch (error) {
      alert('Errore registrazione: ' + (error.response?.data?.error || 'Errore di rete'));
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registrati</h2>
      <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
      <input type="text" placeholder="Cognome" value={cognome} onChange={e => setCognome(e.target.value)} required />
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Registrati</button>
      <p className="switch-form-text">
        Hai già un account? <span onClick={switchToLogin} className="form-link">Accedi</span>
      </p>
    </form>
  );
}


export default RegisterForm;


