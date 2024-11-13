import React from 'react';
import Header from '../component/Header.jsx'; // Asegúrate de importar el Header correctamente
import '../../styles/Homepage.css';

const HomePage = () => {
  return (
    <div className="font-sans antialiased">
      {/* Incluir el Header en la página */}
      <Header />

      {/* Hero Section */}
      <section className="hero-section pt-32 pb-16 bg-gray-50 dark:bg-gray-800 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Bienvenido a nuestra Página de Inicio
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Este es un ejemplo de una página de inicio con un navbar fijo y responsivo.
          </p>
          <div className="cta-buttons mt-6 flex justify-center gap-4">
            <button className="btn-primary bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300">
              Llamado a la Acción 1
            </button>
            <button className="btn-secondary bg-gray-200 text-gray-900 py-2 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300">
              Llamado a la Acción 2
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-12">
            Características
          </h2>
          <div className="features-grid grid md:grid-cols-3 gap-8">
            <div className="feature-item text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Característica 1</h3>
              <p className="text-gray-600 dark:text-gray-300">Descripción breve de la característica 1.</p>
            </div>
            <div className="feature-item text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Característica 2</h3>
              <p className="text-gray-600 dark:text-gray-300">Descripción breve de la característica 2.</p>
            </div>
            <div className="feature-item text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Característica 3</h3>
              <p className="text-gray-600 dark:text-gray-300">Descripción breve de la característica 3.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Mi Compañía. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
