import React, { useState, useContext } from 'react';
import { MailIcon, LockIcon, Plane } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import image from '../../img/paisaje2.jpg';  // Importa la imagen correctamente

export default function Signup() {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [passwordValidity, setPasswordValidity] = useState({ isValid: false, messages: [] });
  const [emailValidity, setEmailValidity] = useState(true);
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);

    const messages = [
      password.length >= minLength ? '✔️ La contraseña tiene al menos 8 caracteres.' : '❌ Debe tener al menos 8 caracteres.',
      hasLetter ? '✔️ Incluye al menos una letra.' : '❌ Debe incluir una letra.',
      hasNumber ? '✔️ Incluye al menos un número.' : '❌ Debe incluir un número.',
      hasSpecialChar ? '✔️ Incluye al menos un carácter especial.' : '❌ Debe incluir un carácter especial.',
    ];

    return {
      isValid: password.length >= minLength && hasLetter && hasNumber && hasSpecialChar,
      messages,
    };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordValidity(validatePassword(newPassword));
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValidity(validateEmail(newEmail));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!emailValidity || !passwordValidity.isValid) {
      return;
    }

    const userData = { email, password };

    const response = await actions.signupUser(userData);
    if (response.success) {
      setAlert({ show: true, message: '¡Registro exitoso!', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setAlert({ show: true, message: response.msg || 'Error en el registro. Por favor, inténtalo de nuevo.', type: 'danger' });
    }
  };

  const closeAlert = () => setAlert({ show: false, message: '', type: '' });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Fondo con la imagen importada */}
      <div 
        className="md:w-1/2 h-64 md:h-auto bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }} // Aquí usamos la imagen importada
      >
        {/* Puedes quitar el overlay verde si solo quieres la imagen como fondo */}
      </div>

      {/* El resto del formulario */}
      <div className="md:w-1/2 bg-white flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6 md:space-y-8">
          <h2 className="mt-4 md:mt-6 text-center text-4xl font-extrabold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Únete a la aventura
          </h2>

          <p className="mt-2 text-center text-gray-700" style={{ fontWeight: '400' }}>
            Comienza a planear tu próximo viaje
          </p>

          {alert.show && (
            <div className={`alert alert-${alert.type} bg-${alert.type === 'danger' ? 'red-100' : 'green-100'} text-${alert.type === 'danger' ? 'red-700' : 'green-700'} p-2 rounded`}>
              {alert.message}
              <button onClick={closeAlert} className="ml-2 text-sm underline">Cerrar</button>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4 md:space-y-6">
            <div className="relative">
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                className={`block w-full pl-10 pr-3 py-2 md:py-3 border ${touched.email && !emailValidity ? 'border-red-500' : 'border-gray-300'} rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm md:text-base`}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                className={`block w-full pl-10 pr-3 py-2 md:py-3 border ${touched.password && !passwordValidity.isValid ? 'border-red-500' : 'border-gray-300'} rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm md:text-base`}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="mt-2">
              {passwordValidity.messages.map((msg, index) => (
                <div key={index} className="text-gray-500 text-sm">{msg}</div>
              ))}
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Plane className="h-5 w-5 text-white group-hover:text-green-400" aria-hidden="true" />
              </span>
              Registrarse
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm md:text-base text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
