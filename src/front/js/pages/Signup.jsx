import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"; // Importa el contexto
import { useNavigate, Link } from 'react-router-dom'; // Importa useNavigate para la navegación

const Signup = () => {
    const { actions } = useContext(Context); // Accede a las acciones del contexto
    const [email, setEmail] = useState(""); // Estado para el email
    const [password, setPassword] = useState(""); // Estado para la contraseña
    const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // Estado para las alertas
    const [passwordValidity, setPasswordValidity] = useState({ isValid: false, messages: [] }); // Estado para la validez de la contraseña
    const navigate = useNavigate(); // Hook para la navegación

    // Manejo del registro
    const handleSignup = async (e) => {
        e.preventDefault(); // Previene el envío del formulario

        // Validación de la contraseña
        if (!passwordValidity.isValid) {
            setAlert({ show: true, message: 'La contraseña debe cumplir con los requisitos.', type: 'danger' });
            return;
        }

        const userData = { email, password }; // Datos del usuario
        const response = await actions.signupUser(userData); // Llama a la función de registro

        if (response.success) {
            setAlert({ show: true, message: '¡Registro exitoso!', type: 'success' });
            setTimeout(() => navigate("/login"), 2000); // Redirige a /login después de un breve retraso
        } else {
            setAlert({ show: true, message: response.msg || 'Error en el registro. Por favor, inténtalo de nuevo.', type: 'danger' });
            console.log("Error en el registro", response.msg);
        }
    };

    // Función de validación de la contraseña
    const validatePassword = (password) => {
        const minLength = 8; // Longitud mínima
        const hasLetter = /[A-Za-z]/.test(password); // Verifica si contiene letra
        const hasNumber = /\d/.test(password); // Verifica si contiene número
        const hasSpecialChar = /[!@#$%^&*()]/.test(password); // Verifica si contiene carácter especial
        
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

    // Manejo del cambio en el campo de contraseña
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value; // Obtiene el nuevo valor de la contraseña
        setPassword(newPassword); // Actualiza el estado de la contraseña
        setPasswordValidity(validatePassword(newPassword)); // Valida la nueva contraseña
    };

    // Cerrar la alerta
    const closeAlert = () => {
        setAlert({ show: false, message: '', type: '' }); // Reinicia el estado de la alerta
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
            
            {/* Alerta de estado */}
            {alert.show && (
                <div className={`alert alert-${alert.type} bg-${alert.type === 'danger' ? 'red-100' : 'green-100'} text-${alert.type === 'danger' ? 'red-700' : 'green-700'} p-2 rounded`}>
                    {alert.message}
                    <button onClick={closeAlert} className="ml-2 text-sm underline">Cerrar</button>
                </div>
            )}

            <form onSubmit={handleSignup} className="flex flex-col space-y-4">
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    className="border p-2 rounded"
                    required
                />
                <small>
                    La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial.
                </small>

                {/* Indicador de requisitos de la contraseña */}
                <div className="mt-2">
                    {passwordValidity.messages.map((msg, index) => (
                        <div key={index}>
                            {msg}
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={!passwordValidity.isValid} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Registrarse
                </button>
            </form>
            <p className="mt-4">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                    Inicia Sesión
                </Link>
            </p>
        </div>
    );
};

export default Signup;
