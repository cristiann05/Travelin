import React, { useState, useEffect, useContext, useRef } from "react"; 
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const CreateProfile = () => {
    const { actions, store } = useContext(Context);
    const [nombre, setNombre] = useState(store.currentUser?.nombre || "");
    const [apellidos, setApellidos] = useState(store.currentUser?.apellidos || "");
    const [fechaNacimiento, setFechaNacimiento] = useState(store.currentUser?.fecha_de_nacimiento || ""); 
    const [urlImagen, setUrlImagen] = useState(""); 
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!store.currentUser) {
            navigate("/login");
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
            if (response.ok) {
                setUrlImagen(result.secure_url);
                localStorage.setItem("profileImageUrl", result.secure_url);
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
        fileInputRef.current.value = "";
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const profileData = {
            nombre,
            apellidos,
            fecha_de_nacimiento: fechaNacimiento,
            public_id: urlImagen
        };

        const response = await actions.updateProfile(profileData);

        if (response.success) {
            setMessage({ text: "Perfil actualizado con éxito!", type: "success" });
            setTimeout(() => navigate("/update-profile"), 1500);
        } else {
            setMessage({ text: response.msg || "Error al actualizar perfil.", type: "error" });
        }
    };

    // Limitar a un total de 3 palabras entre nombre y apellidos, y 8 caracteres por palabra
    const handleNameChange = (input, setInput, otherInput) => {
        const allWords = (input + " " + otherInput).trim().split(/\s+/);
    
        // Limitar a 3 palabras en total
        if (allWords.length > 3) {
            setMessage({ text: "El nombre y apellidos combinados no pueden tener más de 3 palabras en total.", type: "error" });
    
            // Eliminar el mensaje después de 3 segundos
            setTimeout(() => {
                setMessage(null);
            }, 5000);
            return;
        }
    
        // Limitar cada palabra a un máximo de 8 caracteres
        const limitedWords = input.split(/\s+/).map(word => word.slice(0, 10));
        setInput(limitedWords.join(" "));
    };
    

    const handleFechaNacimientoChange = (e) => {
        let input = e.target.value.replace(/\D/g, ""); // Solo números, eliminamos otros caracteres.
    
        // Limitar a 8 caracteres como máximo para el formato DD-MM-YYYY
        if (input.length > 8) input = input.slice(0, 8);
    
        // Añadir el primer guion después de los dos primeros dígitos (día)
        if (input.length >= 3) {
            input = `${input.slice(0, 2)}-${input.slice(2)}`;
        }
    
        // Añadir el segundo guion después de los dos siguientes dígitos (mes)
        if (input.length >= 6) {
            input = `${input.slice(0, 5)}-${input.slice(5)}`;
        }
    
        // Actualizamos el estado con el valor formateado
        setFechaNacimiento(input);
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
                            onChange={(e) => handleNameChange(e.target.value, setNombre, apellidos)}
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
                            onChange={(e) => handleNameChange(e.target.value, setApellidos, nombre)}
                            placeholder="Introduce tus apellidos"
                            required
                            className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
                            Fecha de Nacimiento (DD-MM-YYYY)
                        </label>
                        <input
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            type="text"
                            value={fechaNacimiento}
                            onChange={handleFechaNacimientoChange}
                            placeholder="DD-MM-YYYY"
                            required
                            maxLength="10" // Limitar a 10 caracteres
                            className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

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
