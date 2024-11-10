import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext"; // Importa el contexto para acceder a las acciones
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"; // Importa el DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Estilos de DatePicker
import { es } from "date-fns/locale"; // Importa el locale en español
import { format } from "date-fns"; // Importa para formatear fechas

const CreateProfile = () => {
    const { actions, store } = useContext(Context);
    const [nombre, setNombre] = useState(store.currentUser?.nombre || "");
    const [apellidos, setApellidos] = useState(store.currentUser?.apellidos || "");
    const [fechaNacimiento, setFechaNacimiento] = useState(
        store.currentUser?.fecha_de_nacimiento ? new Date(store.currentUser.fecha_de_nacimiento) : null
    ); 
    const [urlImagen, setUrlImagen] = useState(""); // URL de la imagen
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Referencia al input de archivo

    useEffect(() => {
        // Verifica si el usuario está autenticado
        if (!store.currentUser) {
            navigate("/login"); // Redirige al login si no hay usuario autenticado
        }
    }, [store.currentUser, navigate]);

    const changeUploadImage = async (e) => {
        const file = e.target.files[0];
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "Presents_react");
        data.append("cloud_name", "dhieuyort");
    
        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dhieuyort/image/upload", {
                method: "POST",
                body: data
            });
    
            const result = await response.json();
            console.log(result);
    
            if (response.ok) {
                setUrlImagen(result.secure_url);
                localStorage.setItem("profileImageUrl", result.secure_url); // Guardar en localStorage
            } else {
                setMessage({ text: "Error al subir la imagen. Inténtalo de nuevo.", type: "error" });
            }
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            setMessage({ text: "Error al subir la imagen. Inténtalo nuevamente.", type: "error" });
        }
    };

    const handleDeleteImage = () => {
        setUrlImagen("");
        fileInputRef.current.value = ""; // Limpiar el input
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // Formatear la fecha en el formato DD-MM-AAAA para enviar
        const formattedDate = fechaNacimiento ? format(fechaNacimiento, 'dd-MM-yyyy') : null;

        const profileData = {
            nombre,
            apellidos,
            fecha_de_nacimiento: formattedDate, // Usa el formato correcto para la fecha
            public_id: urlImagen // Incluye la URL de la imagen
        };
        
        const response = await actions.updateProfile(profileData);
        
        if (response.success) {
            setMessage({ text: "Perfil actualizado con éxito!", type: "success" });
            setTimeout(() => navigate("/update-profile"), 1500); // Redirige al perfil tras 1.5 segundos
        } else {
            setMessage({ text: response.msg || "Error al actualizar perfil.", type: "error" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Actualizar Datos Personales</h2>
                
                {message && (
                    <div
                        className={`text-center p-2 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Introduce tu nombre"
                            required
                            className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">
                            Apellidos
                        </label>
                        <input
                            id="apellidos"
                            name="apellidos"
                            type="text"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            placeholder="Introduce tus apellidos"
                            required
                            className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
                            Fecha de Nacimiento
                        </label>
                        <DatePicker
                            selected={fechaNacimiento}
                            onChange={(date) => setFechaNacimiento(date)}
                            dateFormat="dd-MM-yyyy" // Formato de fecha
                            locale={es} // Configura el locale en español
                            placeholderText="Selecciona tu fecha de nacimiento"
                            required
                            className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                            Imagen de Perfil
                        </label>
                        <input
                            id="file-upload"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={changeUploadImage}
                            className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {urlImagen && (
                        <div className="mb-4 text-center">
                            <img src={urlImagen} alt="Imagen subida" width="200" className="img-preview" />
                            <button 
                                type="button" 
                                onClick={handleDeleteImage} 
                                className="btn btn-light mt-2"
                                style={{ border: 'none', background: 'transparent' }}
                            >
                                <i className="fa-solid fa-trash" style={{ color: 'red' }}></i>
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProfile;
