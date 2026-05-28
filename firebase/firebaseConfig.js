// firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração copiada do seu console Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC4GUyzhu-ax0a-DuqWWneSI764wgGga90",
  authDomain: "landingpagelivros.firebaseapp.com",
  projectId: "landingpagelivros",
  storageBucket: "landingpagelivros.firebasestorage.app",
  messagingSenderId: "681377067030",
  appId: "1:681377067030:web:3722bdf9cd4e36e3970537",
  measurementId: "G-JN86KFWJ7L" // Mantido, mas não será usado
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém a instância do Firestore
const db = getFirestore(app);

// Exporta a instância para os serviços
export { db };