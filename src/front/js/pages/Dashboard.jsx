import React, { useState, useEffect, useContext, useRef } from 'react';
import { SearchIcon, PlusIcon, MapPin } from 'lucide-react';
import Sidebar from '../component/Sidebar.jsx';
import FeedPost from '../component/FeedPost.jsx';
import FriendSuggestion from '../component/FriendSuggestion.jsx';
import RouteCard from '../component/RouteCard.jsx';
import TripCard from '../component/TripCard.jsx';
import { Context } from '../store/appContext.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Dashboard() {
  const { store } = useContext(Context);
  const [activeTab, setActiveTab] = useState('feed');
  const [userCoords, setUserCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null); // Estado para almacenar el marcador del usuario
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const mapContainerRef = useRef(null);

  // Inicializar el mapa con una vista inicial aleatoria y poco zoom
  useEffect(() => {
    if (!map) {
      const initialMap = L.map(mapContainerRef.current).setView(
        [Math.random() * 180 - 90, Math.random() * 360 - 180],
        3
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(initialMap);

      setMap(initialMap);
    }
  }, [map]);

  // Obtener coordenadas del usuario desde la base de datos
  useEffect(() => {
    const fetchUserCoordinates = async () => {
      const userId = localStorage.getItem('userId');
      const user = store.users.find((user) => user.id === parseInt(userId));
      if (user && user.latitud && user.longitud) {
        setUserCoords({ lat: user.latitud, lng: user.longitud });
      }
    };
    fetchUserCoordinates();
  }, [store.users]);

  // Mover mapa a la ubicación del usuario de la base de datos con animación smooth
  const handleGoToLocation = () => {
    const userId = localStorage.getItem('userId');
    const user = store.users.find((user) => user.id === parseInt(userId));

    if (user && user.latitud && user.longitud) {
      const newCoords = { lat: user.latitud, lng: user.longitud };
      setUserCoords(newCoords);

      if (map) {
        // Eliminar marcador previo si existe
        if (userMarker) {
          map.removeLayer(userMarker);
        }

        // Crear un nuevo marcador y agregarlo al mapa
        const newMarker = L.marker([user.latitud, user.longitud])
          .addTo(map)
          .bindPopup("Ubicación actual del usuario.")
          .openPopup();

        setUserMarker(newMarker); // Guardar el nuevo marcador en el estado
        map.flyTo([user.latitud, user.longitud], 16, { animate: true, duration: 2 }); // Movimiento suave
      }
    } else {
      alert('No se encontró la ubicación en la base de datos.');
    }
  };

  // Manejador para actualizar resultados de búsqueda
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        // Realizar búsqueda con OpenStreetMap o algún servicio de lugares específicos
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&extratags=1`
        );
        const data = await response.json();

        // Filtrar resultados que tengan latitud y longitud válidas
        const validResults = data.filter(
          (result) => result.lat && result.lon
        );
        setSearchResults(validResults);
        setIsDropdownVisible(validResults.length > 0);
      } catch (error) {
        console.error('Error al buscar el lugar:', error);
      }
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  // Mover mapa a la ubicación seleccionada de la búsqueda con animación suave
  const handleSelectLocation = (lat, lon, name) => {
    if (map) {
      // Eliminar marcador previo si existe
      if (userMarker) {
        map.removeLayer(userMarker);
      }

      // Crear un nuevo marcador en la ubicación seleccionada
      const newMarker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(name)
        .openPopup();

      setUserMarker(newMarker); // Guardar el nuevo marcador en el estado
      map.flyTo([lat, lon], 13, { animate: true, duration: 2 }); // Movimiento suave
    }

    setSearchResults([]); // Limpiar resultados de búsqueda
    setIsDropdownVisible(false); // Ocultar el menú desplegable
  };

  // Manejador de Enter en el input de búsqueda
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      const firstResult = searchResults[0];
      handleSelectLocation(firstResult.lat, firstResult.lon, firstResult.display_name);
    }
  };

  // Mock data para los componentes de feed, sugerencias, rutas y viajes
  const feedPosts = [
    { id: 1, user: 'Maria López', location: 'Barcelona, Spain', image: '/placeholder.svg?height=300&width=300', likes: 120, comments: 15, description: 'Exploring the beautiful streets of Barcelona! 🇪🇸' },
    { id: 2, user: 'John Smith', location: 'Bali, Indonesia', image: '/placeholder.svg?height=300&width=300', likes: 89, comments: 7, description: 'Found paradise in Bali 🌴🏖️' },
    { id: 3, user: 'Emma Wilson', location: 'Tokyo, Japan', image: '/placeholder.svg?height=300&width=300', likes: 230, comments: 32, description: 'Neon lights and sushi nights in Tokyo! 🍣🗼' },
  ];

  const friendSuggestions = [
    { id: 1, name: 'Carlos Rodríguez', mutualFriends: 5, location: 'Madrid, Spain' },
    { id: 2, name: 'Sophie Chen', mutualFriends: 3, location: 'Shanghai, China' },
    { id: 3, name: 'Ahmed Hassan', mutualFriends: 7, location: 'Cairo, Egypt' },
  ];

  const routes = [
    { id: 1, name: 'Ruta por los Pirineos', description: 'Una ruta de montaña increíble', image: '/route-pic-1.jpg', lat: 42.5, lon: 0.0 },
    { id: 2, name: 'Tour de París', description: 'Explora los monumentos icónicos', image: '/route-pic-2.jpg', lat: 48.8566, lon: 2.3522 },
  ];

  const trips = [
    { id: 1, destination: 'Roma, Italia', startDate: '2023-06-01', endDate: '2023-06-10' },
    { id: 2, destination: 'Nueva York, EE.UU.', startDate: '2023-09-15', endDate: '2023-09-22' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-6">
              <h1 className="text-2xl font-bold">Travel Feed</h1>
              {feedPosts.map((post) => (
                <FeedPost key={post.id} {...post} />
              ))}
            </div>
          </div>
        );
      case 'explore':
        return (
          <div className="p-4 flex-1">
            <h1 className="text-2xl font-bold">Sugerencias de amigos</h1>
            {friendSuggestions.map((suggestion) => (
              <FriendSuggestion key={suggestion.id} {...suggestion} />
            ))}
          </div>
        );
      case 'routes':
        return (
          <div className="p-4 flex-1">
            <h1 className="text-2xl font-bold">Rutas</h1>
            {routes.map((route) => (
              <RouteCard key={route.id} {...route} />
            ))}
          </div>
        );
      case 'trips':
        return (
          <div className="p-4 flex-1">
            <h1 className="text-2xl font-bold">Mis Viajes</h1>
            {trips.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        );
      default:
        return (
          <div className="flex justify-center items-center">
            <p className="text-xl font-semibold">Selecciona una opción del menú para comenzar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white shadow-md z-10 relative">
          <button
            onClick={handleGoToLocation}
            className="bg-indigo-600 text-white p-2 rounded-md shadow-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Mi Ubicación
          </button>

          <div className="flex-1 mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              placeholder="¿A dónde quieres ir?"
              className="w-full p-2 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {isDropdownVisible && searchResults.length > 0 && (
              <div className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg z-50">
                {searchResults.map((result) => (
                  <div
                    key={result.place_id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectLocation(result.lat, result.lon, result.display_name)}
                  >
                    <p>{result.display_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="bg-indigo-600 text-white p-2 rounded-md shadow-lg hover:bg-indigo-700 transition-colors">
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {renderContent()}

          <div className="flex-1" ref={mapContainerRef} style={{ height: '100%', width: '100%', position: 'relative', zIndex: '1' }} />
        </div>
      </div>
    </div>
  );
}
