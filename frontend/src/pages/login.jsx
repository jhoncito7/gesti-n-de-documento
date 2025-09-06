import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, cambiarAVistaRegistro }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verPassword, setVerPassword] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/login', {
                email,
                password,
            });
            localStorage.setItem('token', res.data.token);
            setMensaje('Inicio de sesión exitoso');
            setEmail('');
            setPassword('');
            if (onLogin) onLogin();
        } catch (err) {
            setMensaje('Error al iniciar sesión: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar sesión </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div style={{ position: 'relative' }}>
                        <input
                            type={verPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '70%' }}
                        />
                        <span
                            onClick={() => setVerPassword(v => !v)}
                            style={{ position: 'absolute', right: 60, top: 10, cursor: 'pointer', userSelect: 'none' }}
                            title={verPassword ? 'Ocultar' : 'Mostrar'}
                        >
                            {verPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                    <button type="submit">Iniciar sesión</button>
                </form>
                {mensaje && <p className={mensaje.includes('exitoso') ? 'success' : 'error'}>{mensaje}</p>}

                {/* Botón para ir a Registro */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '1rem', marginBottom: '0px' }}>¿No tienes cuenta?</span>
                    <button
                        onClick={() => {
                            setEmail('');
                            setPassword('');
                            setMensaje('');
                            cambiarAVistaRegistro();
                        }}
                        style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: '1rem', marginTop: '0px' }}
                    >
                        Regístrate aquí
                    </button>
                </div>
            </div>
        </div>
    );  
    }

export default Login; 
 