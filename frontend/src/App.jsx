import { useState, useEffect } from 'react';
import './App.css';
import Documentos from './pages/Documentos.jsx';
import Login from './pages/login.jsx';
import Registro from './pages/Registro.jsx';
import Estadistica from './pages/estadistica.jsx';
import EstadisticaAvanzada from './pages/EstadisticaAvanzada.jsx';


function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [pagina, setPagina] = useState('documentos');

  // Eliminar el token al recargar la página para forzar login
  useEffect(() => {
    localStorage.removeItem('token');
    setAutenticado(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAutenticado(false);
  };

  const renderContenido = () => {
    if (pagina === 'documentos') return <Documentos />;
    if (pagina === 'estadistica') return <Estadistica />;
    if (pagina === 'estadistica-avanzada') return <EstadisticaAvanzada />;
    return null;
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
        //ESTILOS DE LOS BOTONES  
        <>
          <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', background: 'linear-gradient(90deg, #007bff 60%, #0056b3 100%)', padding: '1.2rem 0', marginBottom: '2rem', borderRadius: '0 0 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <button onClick={() => setPagina('documentos')} style={{  background: pagina === 'documentos' ? '#fff' : '#007bff', color: pagina === 'documentos' ? '#007bff' : '#fff', border: 'none', borderRadius: '8px', padding: '8px 11px ', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: pagina === 'documentos' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>Documentos</button>
            <button onClick={() => setPagina('estadistica')} style={{  background: pagina === 'estadistica' ? '#fff' : '#007bff', color: pagina === 'estadistica' ? '#007bff' : '#fff', border: 'none', borderRadius: '8px', padding: '8px 11px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: pagina === 'estadistica' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>Estadísticas</button>
            <button onClick={() => setPagina('estadistica-avanzada')} style={{  background: pagina === 'estadistica-avanzada' ? '#fff' : '#007bff', color: pagina === 'estadistica-avanzada' ? '#007bff' : '#fff', border: 'none', borderRadius: '8px', padding: '8px 11px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: pagina === 'estadistica-avanzada' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>Estadística avanzada</button>
            <button onClick={handleLogout} style={{ marginLeft: '25em', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 11px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Cerrar sesión</button>
          </nav>
          <div style={{ maxWidth: 1200, margin: '0 19px', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2rem' }}>
            {renderContenido()}
          </div>
        </>
      )}
    </div>
  );
}
export default App;
