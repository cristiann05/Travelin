import React, { useState, useEffect, useContext, useRef } from 'react';
import { HomeIcon, SearchIcon, MapIcon, UsersIcon, MessageSquare, BellIcon, BookmarkIcon, TrendingUpIcon, CalendarIcon, ChevronDownIcon, CogIcon, LogOutIcon, UserIcon, RouteIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../img/travelinlogo.png'; // Importar el logo
import { Context } from '../store/appContext';
import '../../styles/Sidebar.css'; // Asegúrate de importar tu archivo CSS

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { store, actions } = useContext(Context);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const navItems = [
    { id: 'feed', icon: HomeIcon, label: 'Feed' },
    { id: 'explore', icon: SearchIcon, label: 'Explorar' },
    { id: 'myRoutes', icon: MapIcon, label: 'Mis Rutas' },
    { id: 'friends', icon: UsersIcon, label: 'Amigos' },
    { id: 'messages', icon: MessageSquare, label: 'Mensajes' },
    { id: 'notifications', icon: BellIcon, label: 'Notificaciones' },
    { id: 'bookmarks', icon: BookmarkIcon, label: 'Marcadores' },
    { id: 'trending', icon: TrendingUpIcon, label: 'Tendencias' },
    { id: 'trips', icon: CalendarIcon, label: 'Mis Viajes' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      await actions.getUsers();
      const userId = localStorage.getItem("userId");
      const user = store.users.find(user => user.id === parseInt(userId));
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, [store.users]);

  const handleLogout = () => {
    actions.logoutUser();
    navigate('/');
  };

  const handleOpenMenu = () => {
    setIsProfileMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsProfileMenuOpen(false);
  };

  return (
    <aside className="w-64 bg-green-600 text-white flex flex-col h-screen">
      {/* Se centra el logo, se quita el margen y se ajusta el espaciado */}
      <div className="flex justify-center items-center py-2"> {/* Reduce el padding vertical */}
        <img src={logo} className="w-48 h-auto" alt="Travelin Logo" /> {/* Aumentar tamaño del logo */}
      </div>
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-button flex items-center w-full px-4 py-2 ${activeTab === item.id ? 'bg-green-700' : ''}`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4">
        <div ref={profileMenuRef} className="relative">
          <button
            onClick={isProfileMenuOpen ? handleCloseMenu : handleOpenMenu}
            className="profile-button flex items-center w-full p-2 rounded-lg"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-lg overflow-hidden mr-3 border-2 border-white">
              <img
                src={currentUser?.public_id || '/placeholder.svg'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-semibold">{currentUser?.nombre} {currentUser?.apellidos || ''}</p>
              <p className="text-sm text-green-200">@{currentUser?.username || 'username'}</p>
            </div>
            <ChevronDownIcon className="w-5 h-5 ml-auto" />
          </button>
          <div
            className={`absolute bottom-24 left-0 w-full bg-green-900 rounded-lg shadow-lg overflow-hidden transition-opacity duration-300 ease-in-out ${isProfileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ display: isProfileMenuOpen ? 'block' : 'none' }}
          >
            <div className="flex items-center px-4 py-2 profile-menu-item">
              <UserIcon className="w-5 h-5 mr-2" />
              <span>Ver Perfil</span>
            </div>
            <div className="flex items-center px-4 py-2 profile-menu-item">
              <RouteIcon className="w-5 h-5 mr-2" />
              <span>Ver Rutas</span>
            </div>
            <div className="flex items-center px-4 py-2 profile-menu-item">
              <CogIcon className="w-5 h-5 mr-2" />
              <span>Configuración</span>
            </div>
            <div className="flex items-center px-4 py-2 profile-menu-item" onClick={handleLogout}>
              <LogOutIcon className="w-5 h-5 mr-2" />
              <span>Cerrar Sesión</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
