import { useState, useEffect } from 'react';
import './App.css';

import Documentos from './pages/Documentos.jsx';
import Login from './pages/login.jsx';
import Registro from './pages/Registro.jsx';

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  // Eliminar el token al recargar la página para forzar login
  useEffect(() => {
    localStorage.removeItem('token');
    setAutenticado(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAutenticado(false);
  };

  return (
    <div>
      {!autenticado ? (
        mostrarRegistro ? (
          <>
            <Registro
              onRegister={() => setMostrarRegistro(false)}
              cambiarAVistaLogin={() => setMostrarRegistro(false)}
            />

          </>
        ) : (
          <>
            <Login
              onLogin={() => setAutenticado(true)}
              cambiarAVistaRegistro={() => setMostrarRegistro(true)}
            />
          </>
        )
      ) : (
        <>
          <button onClick={handleLogout} style={{ position: 'absolute', top: 20, right: 20, padding: '0.5rem 1rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cerrar sesión</button>
          <Documentos />
        </>
      )}
    </div>
  );
}

export default App;
