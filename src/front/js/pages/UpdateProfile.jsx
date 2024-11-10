import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext"; // Importa el contexto para acceder a las acciones
import { useNavigate } from "react-router-dom";
import L from 'leaflet'; // Importa Leaflet
import 'leaflet/dist/leaflet.css'; // Estilos de Leaflet

const UpdateProfile = () => {
    const { actions, store } = useContext(Context);
    const [username, setUsername] = useState(store.currentUser?.username || "");
    const [location, setLocation] = useState(store.currentUser?.location || "");
    const [address, setAddress] = useState(''); // Estado para la dirección
    const [lat, setLat] = useState(null); // Estado para la latitud
    const [lon, setLon] = useState(null); // Estado para la longitud
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const mapRef = useRef(null); // Referencia para el mapa
    const markerRef = useRef(null); // Referencia para el marcador

    useEffect(() => {
        // Verifica si el usuario está autenticado
        if (!store.currentUser) {
            navigate("/login"); // Redirige al login si no hay usuario autenticado
            return; // Sale del useEffect para evitar ejecutar el resto del código
        }

        // Inicializa el mapa solo si no ha sido inicializado
        if (!mapRef.current) {
            // Inicializa el mapa
            mapRef.current = L.map('map').setView([20.5937, 78.9629], 5); // Centro de la India como ejemplo

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(mapRef.current);

            // Configura el icono del marcador
            const customIcon = L.icon({
                iconUrl: '/marker-icon.png', // Asegúrate de tener estas imágenes en la carpeta public
                shadowUrl: '/marker-shadow.png', // Asegúrate de tener esta imagen
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            });

            // Marcador para la ubicación seleccionada
            markerRef.current = L.marker([20.5937, 78.9629], { icon: customIcon }).addTo(mapRef.current);

            // Obtener la ubicación del usuario
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setLat(latitude);
                    setLon(longitude);
                    mapRef.current.setView([latitude, longitude], 13); // Centra el mapa en la ubicación actual
                    markerRef.current.setLatLng([latitude, longitude]); // Mueve el marcador a la ubicación actual

                    // Obtener dirección a partir de latitud y longitud
                    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                        .then(response => response.json())
                        .then(data => {
                            setAddress(data.display_name);
                        })
                        .catch(err => console.error('Error obteniendo la dirección:', err));
                }, (error) => {
                    console.error("Error al obtener la geolocalización:", error);
                });
            }

            // Evento de click en el mapa
            mapRef.current.on('click', (e) => {
                if (markerRef.current) {
                    const { lat, lng } = e.latlng; // Obtiene latitud y longitud del evento
                    setLat(lat);
                    setLon(lng);
                    markerRef.current.setLatLng(e.latlng); // Mueve el marcador a la ubicación seleccionada

                    // Obtener dirección a partir de latitud y longitud
                    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                        .then(response => response.json())
                        .then(data => {
                            setAddress(data.display_name); // Actualiza el estado de la dirección
                        })
                        .catch(err => console.error('Error obteniendo la dirección:', err));
                } else {
                    console.error('El marcador no está definido.');
                }
            });
        }

        return () => {
            // No es necesario eliminar el mapa aquí, ya que se limpia automáticamente cuando el componente se desmonta
        };
    }, [store.currentUser, navigate]); // Asegúrate de incluir store.currentUser y navigate en las dependencias

    const handleUpdate = async (e) => {
        e.preventDefault();
        const profileData = {
            username,
            location,
            direccion: address,
            latitud: lat,
            longitud: lon,
        };
        
        const response = await actions.updateProfile(profileData);
        
        if (response.success) {
            setMessage({ text: "Perfil actualizado con éxito!", type: "success" });
            setTimeout(() => navigate("/dashboard"), 1500); // Redirige al perfil tras 1.5 segundos
        } else {
            setMessage({ text: response.msg || "Error al actualizar perfil.", type: "error" });
        }
    };

    const handleAddressChange = async (e) => {
        const newAddress = e.target.value;
        setAddress(newAddress);

        // Si hay una dirección ingresada, realizar la búsqueda de geocodificación
        if (newAddress) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(newAddress)}&format=json`);
                const data = await response.json();

                if (data.length > 0) {
                    const { lat, lon } = data[0]; // Obtener la primera coincidencia
                    setLat(lat);
                    setLon(lon);
                    // Mover el marcador y centrar el mapa en la nueva ubicación
                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lon]); // Asegúrate de que el marcador no sea null
                        mapRef.current.setView([lat, lon], 13); // Centra el mapa en la nueva ubicación
                    } else {
                        console.error('El marcador no está definido.');
                    }
                } else {
                    console.error("No se encontraron resultados para la dirección ingresada.");
                }
            } catch (err) {
                console.error('Error en la búsqueda de geocodificación:', err);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Actualizar Perfil</h2>
                
                {/* Mensaje de éxito o error */}
                {message && (
                    <div
                        className={`text-center p-2 mb-4 rounded ${
                            message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Mapa para seleccionar la dirección */}
                <div id="map" style={{ height: '300px', marginBottom: '20px' }}></div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Nombre de Usuario
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Introduce tu nuevo nombre de usuario"
                            required
                            className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Dirección
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={address}
                            onChange={handleAddressChange} // Manejador para cambios en la dirección
                            placeholder="Introduce una dirección o ciudad"
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

                <button
                    onClick={() => navigate("/Dashboard")}
                    className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-300 transition duration-200"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default UpdateProfile;
