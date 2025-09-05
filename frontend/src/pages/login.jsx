/* 
import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            if (onLogin) onLogin();
        } catch (err) {
            setMensaje('Error al iniciar sesión: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar sesión</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Iniciar sesión</button>
                </form>
                {mensaje && <p className={mensaje.includes('exitoso') ? 'success' : 'error'}>{mensaje}</p>}
            </div>
        </div>
    );
}

export default Login; */

import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, cambiarAVistaRegistro }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            if (onLogin) onLogin();
        } catch (err) {
            setMensaje('Error al iniciar sesión: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar sesión</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Iniciar sesión</button>
                </form>
                {mensaje && <p className={mensaje.includes('exitoso') ? 'success' : 'error'}>{mensaje}</p>}

                {/* Botón para ir a Registro */}
                <p style={{ marginTop: '1rem' }}>
                    ¿No tienes cuenta?{' '}
                    <button
                        onClick={cambiarAVistaRegistro}
                        style={{
                            color: '#007bff',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0,
                        }}
                    >
                        Regístrate aquí
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
