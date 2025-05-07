// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



