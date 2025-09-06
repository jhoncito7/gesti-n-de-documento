import { useState } from 'react';
import axios from 'axios';

function Registro({ onRegister, cambiarAVistaLogin }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos vacíos
    if (!nombre || !apellido || !usuario || !email || !password) {
      setMensaje('Por favor, completa todos los campos.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/register', {
        nombre,
        apellido,
        usuario,
        email,
        password,
      });
      setMensaje('Usuario registrado correctamente');

      // Limpiar campos
      setNombre('');
      setApellido('');
      setUsuario('');
      setEmail('');
      setPassword('');

      if (onRegister) onRegister(); // Cambiar a login
    } catch (err) {
      setMensaje('Error al registrar: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-box">
        <form onSubmit={handleSubmit} className="registro-form">
        <h2>Registro</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          /><br />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          /><br />
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          /><br />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
          <div style={{ position: 'relative' }}>
            <input
              type={verPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '75%' }}
            />
            <span
              onClick={() => setVerPassword(v => !v)}
              style={{ position: 'absolute', right:60, top: 15, cursor: 'pointer', userSelect: 'none' }}
              title={verPassword ? 'Ocultar' : 'Mostrar'}
            >
              {verPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <button type="submit">Registrarse</button>


        {/*  Mostrar mensaje */}
        {mensaje && (
          <p style={{marginTop: '1rem', color: mensaje.includes('correctamente') ? 'green' : 'red' }}>
            {mensaje}
          </p>
        )}

        {/* Botón para cambiar a login */}
        <div style={{ marginBottom:'0', justifyContent: 'center', alignItems: 'left', gap: '0.2rem', marginTop: '5px' }}>
          <span>¿Ya tienes cuenta?</span>
          <button
            onClick={cambiarAVistaLogin}
            style={{
              color: '#007bff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
             
            }}
          >
            Inicia sesión
          </button>
        </div>
        </form>

      </div>
      
    </div>
  );
}

export default Registro;





