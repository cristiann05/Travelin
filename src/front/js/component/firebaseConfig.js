// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAod5mFMD7RtvSFx6kNS2RAWd73brp_ICo",
    authDomain: "travelin-login.firebaseapp.com",
    projectId: "travelin-login",
    storageBucket: "travelin-login.appspot.com",
    messagingSenderId: "1032629818984",
    appId: "1:1032629818984:web:60a34c2021d0d9f4090ddd",
    measurementId: "G-M19FFKNY6E"
};

// Inicializa Firebase y Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa el servicio de autenticación
const provider = new GoogleAuthProvider(); // Configura el proveedor de Google

export { auth, provider };
