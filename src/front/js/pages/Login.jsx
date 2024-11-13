import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/login.css';
import image from '../../img/bg.jpg';

const Login = () => {
    const { actions } = useContext(Context);
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });
    const navegar = useNavigate();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        const datosUsuario = { correo, contraseña };
        const resultado = await actions.loginUser(datosUsuario);

        if (!resultado.success) {
            setAlerta({ mostrar: true, mensaje: resultado.msg || 'Error en el inicio de sesión. Por favor, inténtalo de nuevo.', tipo: 'danger' });
        } else {
            setCorreo("");
            setContraseña("");
            setAlerta({ mostrar: true, mensaje: '¡Inicio de sesión exitoso!', tipo: 'success' });
            setTimeout(() => {
                navegar(resultado.profileComplete ? "/dashboard" : "/crear-perfil");
            }, 2000);
        }
    };

    const cerrarAlerta = () => {
        setAlerta({ mostrar: false, mensaje: '', tipo: '' });
    };

    // Función para evitar el pegado en los campos
    const evitarPegado = (e) => {
        e.preventDefault();  // Previene la acción de pegar
    };

    useEffect(() => {
        // Forzar el desactivado del autocompletado de forma global
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            // Asignamos atributos de autocompletado falsos
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('autocorrect', 'off');
            input.setAttribute('autocapitalize', 'off');
            input.setAttribute('spellcheck', 'false');
        });
    }, []);

    return (
        <div 
            className="login-container" 
            style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <form onSubmit={manejarSubmit} className="login-form">
                <h1 className="login-title">Iniciar Sesión</h1>

                {alerta.mostrar && (
                    <div className={`alert alert-${alerta.tipo} mb-4`}>
                        {alerta.mensaje}
                        <button onClick={cerrarAlerta}>Cerrar</button>
                    </div>
                )}

                <div className="input-box">
                    <i className='bx bxs-user'></i>
                    <input
                        type="email"
                        name="email_fake" // Obfuscamos el nombre del campo
                        id="email_fake" // Obfuscamos también el ID
                        placeholder="Correo Electrónico"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        onPaste={evitarPegado}  // Evita el pegado en el campo
                        autoComplete="off"  // Desactiva el autocompletado para este campo
                    />
                </div>
                <div className="input-box">
                    <i className='bx bxs-lock-alt'></i>
                    <input
                        type="password"
                        name="password_fake" // Obfuscamos el nombre del campo
                        id="password_fake" // Obfuscamos también el ID
                        placeholder="Contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                        onPaste={evitarPegado}  // Evita el pegado en el campo
                        autoComplete="new-password"  // Desactiva el autocompletado para contraseñas
                    />
                </div>

                <div className="remember-forgot-box">
                    <label>
                        <input type="checkbox" />
                        Recuérdame
                    </label>
                    <a href="#">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" className="login-btn">Iniciar Sesión</button>

                <p className="register">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/signup">Regístrate</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
