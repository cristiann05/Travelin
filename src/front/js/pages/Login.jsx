import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"; // Importa el contexto con las acciones
import { MailIcon, LockIcon, MapIcon } from "lucide-react"; // Importa los iconos de lucide
import { Link, useNavigate } from "react-router-dom"; // Para la navegación
import image from "../../img/fotopaisaje.jpg";

const Login = () => {
    const { actions } = useContext(Context); // Accede a las acciones del contexto
    const [email, setEmail] = useState(""); // Estado para el correo electrónico
    const [password, setPassword] = useState(""); // Estado para la contraseña
    const [alert, setAlert] = useState({ show: false, message: "", type: "" }); // Estado para alertas
    const navigate = useNavigate(); // Hook de navegación

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { email, password }; // Objeto con las credenciales

        // Llama a la acción loginUser del contexto
        const result = await actions.loginUser(userData);

        if (!result.success) {
            // Si el login falla, muestra el mensaje de error
            setAlert({
                show: true,
                message: result.msg || "Error en el inicio de sesión. Inténtalo nuevamente.",
                type: "danger",
            });
        } else {
            // Si el login es exitoso, limpia los campos y muestra un mensaje de éxito
            setEmail("");
            setPassword("");
            setAlert({
                show: true,
                message: "¡Inicio de sesión exitoso!",
                type: "success",
            });

            // Redirige al dashboard o a completar el perfil según corresponda
            setTimeout(() => {
                navigate(result.profileComplete ? "/dashboard" : "/create-profile");
            }, 2000); // Espera 2 segundos antes de redirigir
        }
    };

    const closeAlert = () => {
        setAlert({ show: false, message: "", type: "" });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-green-50">
            {/* Sección de imagen */}
            <div
                className="md:w-1/2 h-64 md:h-auto bg-cover bg-center relative"
                style={{ backgroundImage: `url(${image})` }} // Asegúrate de usar tu imagen
            ></div>

            {/* Sección de formulario */}
            <div className="md:w-1/2 bg-white flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-md space-y-6 md:space-y-8">
                    <div>
                        <h2 className="mt-4 md:mt-6 text-center text-4xl font-extrabold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Inicia tu aventura
                        </h2>
                        <p className="mt-2 text-center text-gray-700" style={{ fontWeight: '400' }}>
                            ¡Vamos a planear juntos el viaje de tus sueños!
                        </p>
                    </div>

                    {/* Alerta de error o éxito */}
                    {alert.show && (
                        <div className={`alert alert-${alert.type} p-4 rounded-md`}>
                            <span>{alert.message}</span>
                            <button onClick={closeAlert} className="ml-4">Cerrar</button>
                        </div>
                    )}

                    <form className="mt-6 md:mt-8 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="relative">
                                <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition duration-150 ease-in-out text-sm md:text-base"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MailIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="password" className="sr-only">Contraseña</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition duration-150 ease-in-out text-sm md:text-base"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Recuérdame
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 md:py-3 px-4 border border-transparent text-sm md:text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <MapIcon className="h-5 w-5 text-green-500 text-white group-hover:text-green-400" aria-hidden="true" />
                                </span>
                                Iniciar sesión
                            </button>
                        </div>
                    </form>

                    <div className="text-center">
                        <p className="text-sm md:text-base text-gray-600">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/signup" className="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
