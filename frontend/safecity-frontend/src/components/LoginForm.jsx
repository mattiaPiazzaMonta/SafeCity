// src/components/LoginForm.jsx
import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';


function LoginForm({ onLoginSuccess, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/users/login', { email, password });
      const { token, username } = response.data;

      //SALVA IL TOKEN
      localStorage.setItem('token', token);

      localStorage.setItem('user', JSON.stringify({ nome: username }));
      navigate('/dashboard');

      //Comunica al genitore (AuthPage) che il login è avvenuto
      onLoginSuccess({ nome: username });
    } catch (error) {
      console.error('Errore login:', error.response?.data);
      alert('Login fallito: ' + (error.response?.data?.error || 'Errore di rete'));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Accedi</button>
      <p className="switch-form-text">
        Non hai un account? <span onClick={switchToRegister} className="form-link">Registrati</span>
      </p>
    </form>
  );
}

export default LoginForm;

