// ---------------------------------------------------------------------------
// Configuración de Firebase.
// Sustituye los valores "TU_..." por los de tu proyecto (ver SETUP.md, paso 3).
// ---------------------------------------------------------------------------
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Todos los dispositivos que compartan el mismo FAMILY_ID ven los mismos datos.
// Puedes usar otro grupo abriendo la app con ?family=otro-id
const params = new URLSearchParams(window.location.search);
export const FAMILY_ID = params.get("family") || "familia-principal";
