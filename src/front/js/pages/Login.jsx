import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"; // Ajusta la ruta según sea necesario
import { Link, useNavigate } from "react-router-dom"; // Importa Link y useNavigate para la navegación

const Login = () => {
    const { actions } = useContext(Context); // Cambiado para obtener acciones del contexto
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // Estado para la alerta
    const navigate = useNavigate(); // Inicializa useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const userData = { email, password };
        const result = await actions.loginUser(userData);
    
        if (!result.success) {
            setAlert({ show: true, message: result.msg || 'Error en el inicio de sesión. Por favor, inténtalo de nuevo.', type: 'danger' });
        } else {
            setEmail("");
            setPassword("");
            setAlert({ show: true, message: '¡Inicio de sesión exitoso!', type: 'success' });
    
            // Redirige según si el perfil está completo o no
            setTimeout(() => {
                navigate(result.profileComplete ? "/dashboard" : "/create-profile");
            }, 2000);
        }
    };
    

    // Cerrar la alerta
    const closeAlert = () => {
        setAlert({ show: false, message: '', type: '' }); // Reinicia el estado de la alerta
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
            
            {/* Alerta de estado */}
            {alert.show && (
                <div className={`alert alert-${alert.type}`}>
                    {alert.message}
                    <button onClick={closeAlert}>Cerrar</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Iniciar Sesión
                </button>
                {alert.show && alert.type === 'danger' && <p className="text-red-500">{alert.message}</p>}
            </form>
            <p className="mt-4">
                ¿No tienes una cuenta?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline">
                    Regístrate
                </Link>
            </p>
        </div>
    );
};

export default Login;
