// src/pages/AuthPage.jsx
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import logo from '../assets/SafeCity.png';
import '../App.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleSuccess = (userData) => {
    console.log('TOKEN SALVATO:', localStorage.getItem('token')); //debug visivo
    setUser(userData);
  };
  

  if (user) {
    return <h1 className="welcome-message">Benvenuto {user.nome}!</h1>;
  }

  return (
    <div className="auth-container">
      <img src={logo} alt="SafeCity Logo" className="logo" />
      <div className="auth-box">
        {isLogin 
          ? <LoginForm onLoginSuccess={handleSuccess} switchToRegister={() => setIsLogin(false)} />
          : <RegisterForm onRegisterSuccess={handleSuccess} switchToLogin={() => setIsLogin(true)} />
        }
      </div>
    </div>
  );
}

export default AuthPage;





