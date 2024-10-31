import React from 'react';

const Homepage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Bienvenido a Travelin!</h1>
        <p className="text-gray-600 mb-6">
          Descubre el mundo y planifica tus viajes de manera fácil y divertida.
          Únete a nuestra comunidad de viajeros y comparte tus experiencias.
        </p>
        <div className="space-y-4">
          <a 
            href="/signup" 
            className="block bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition duration-300"
          >
            Registrarse
          </a>
          <a 
            href="/login" 
            className="block bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
