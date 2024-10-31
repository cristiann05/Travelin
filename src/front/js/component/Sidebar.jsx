import React, { useState, useEffect } from 'react';
import { HomeIcon, SearchIcon, MapIcon, UsersIcon, MessageSquare, BellIcon, BookmarkIcon, TrendingUpIcon, CalendarIcon, GlobeIcon, ChevronDownIcon, CogIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

export default function Sidebar({ activeTab, setActiveTab, logout }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate

  const navItems = [
    { id: 'feed', icon: HomeIcon, label: 'Feed' },
    { id: 'explore', icon: SearchIcon, label: 'Explore' },
    { id: 'myRoutes', icon: MapIcon, label: 'My Routes' },
    { id: 'friends', icon: UsersIcon, label: 'Friends' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'notifications', icon: BellIcon, label: 'Notifications' },
    { id: 'bookmarks', icon: BookmarkIcon, label: 'Bookmarks' },
    { id: 'trending', icon: TrendingUpIcon, label: 'Trending' },
    { id: 'trips', icon: CalendarIcon, label: 'My Trips' },
  ];

  // Efecto para verificar el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/'); // Redirige si no hay token
    }
  }, [navigate]);

  const handleLogout = () => {
    logout(); // Llama a la función de logout pasada como props
    navigate('/'); // Redirige a la página de inicio después de cerrar sesión
  };

  return (
    <aside className="w-64 bg-indigo-600 text-white flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold flex items-center">
          <GlobeIcon className="w-8 h-8 mr-2" />
          Travelin
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center w-full px-4 py-2 ${activeTab === item.id ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4">
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-500"
          >
            <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            <div className="text-left">
              <p className="font-semibold">Jane Doe</p> {/* Puedes reemplazar este texto con el nombre del usuario */}
              <p className="text-sm text-indigo-200">@jane_traveler</p>
            </div>
            <ChevronDownIcon className="w-5 h-5 ml-auto" />
          </button>
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-0 w-full bg-indigo-800 rounded-lg shadow-lg overflow-hidden">
              <button className="w-full px-4 py-2 text-left hover:bg-indigo-700">View Profile</button>
              <button className="w-full px-4 py-2 text-left hover:bg-indigo-700">
                <CogIcon className="w-5 h-5 inline mr-2" />
                Settings
              </button>
              <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-indigo-700">Log Out</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
