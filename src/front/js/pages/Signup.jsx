import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/signup.css';
import image from '../../img/bg.jpg';

const Signup = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [passwordValidity, setPasswordValidity] = useState({ isValid: false, messages: [] });
    const [emailValid, setEmailValid] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();

    // Maneja el envío del formulario
    const handleSignup = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);  // Indicamos que el formulario fue enviado

        if (!passwordValidity.isValid) {
            setAlert({ show: true, message: 'La contraseña debe cumplir con los requisitos.', type: 'danger' });
            return;
        }
        if (!emailValid) {
            setAlert({ show: true, message: 'Por favor, ingresa un correo electrónico válido.', type: 'danger' });
            return;
        }

        const userData = { email, password };
        const response = await actions.signupUser(userData);
        if (response.success) {
            setAlert({ show: true, message: '¡Registro exitoso!', type: 'success' });
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setAlert({ show: true, message: response.msg || 'Error en el registro. Por favor, inténtalo de nuevo.', type: 'danger' });
        }
    };

    // Valida la contraseña
    const validatePassword = (password) => {
        const minLength = 8;
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()]/.test(password);

        const messages = [
            password.length >= minLength ? '✔️ ¡Buena elección! La contraseña tiene al menos 8 caracteres.' : '❌ La contraseña debe tener al menos 8 caracteres.',
            hasLetter ? '✔️ Incluye al menos una letra.' : '❌ Debe incluir al menos una letra.',
            hasNumber ? '✔️ Incluye al menos un número.' : '❌ Debe incluir al menos un número.',
            hasSpecialChar ? '✔️ Incluye al menos un carácter especial.' : '❌ Debe incluir al menos un carácter especial.',
        ];

        return {
            isValid: password.length >= minLength && hasLetter && hasNumber && hasSpecialChar,
            messages
        };
    };

    // Valida el correo electrónico
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordValidity(validatePassword(newPassword));
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailValid(validateEmail(newEmail));
    };

    const closeAlert = () => {
        setAlert({ show: false, message: '', type: '' });
    };

    // Evitar el pegado en los campos
    const preventPaste = (e) => {
        e.preventDefault();
    };

    // Desactivar el autocompletado
    useEffect(() => {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('autocorrect', 'off');
            input.setAttribute('autocapitalize', 'off');
            input.setAttribute('spellcheck', 'false');
        });
    }, []);

    return (
        <div
            className="signup-container"
            style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <form onSubmit={handleSignup} className="signup-form" autoComplete="off">
                <h1 className="signup-title">Registrarse</h1>

                {alert.show && (
                    <div className={`alert alert-${alert.type} mb-4`}>
                        {alert.message}
                        <button onClick={closeAlert}>Cerrar</button>
                    </div>
                )}

                {/* Correo electrónico */}
                <div className="input-box">
                    <i className='bx bxs-user'></i>
                    <input
                        type="email"
                        name="email_fake"
                        id="email_fake"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        onPaste={preventPaste}
                    />
                    {formSubmitted && !email && (
                        <div className="error-message">Por favor, ingresa un correo electrónico.</div>
                    )}
                </div>

                {/* Contraseña */}
                <div className="input-box">
                    <i className='bx bxs-lock-alt'></i>
                    <input
                        type="password"
                        name="password_fake"
                        id="password_fake"
                        placeholder="Contraseña"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        onPaste={preventPaste}
                    />
                    {formSubmitted && !password && (
                        <div className="error-message">Por favor, ingresa una contraseña.</div>
                    )}
                </div>

                <div className="password-validity">
                    {formSubmitted && passwordValidity.messages.map((msg, index) => (
                        <div key={index} className={msg.includes("✔️") ? 'valid' : 'invalid'}>
                            {msg}
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={!passwordValidity.isValid || !emailValid} className="signup-btn">
                    Registrarse
                </button>

                <p className="register">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login">Inicia Sesión</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
