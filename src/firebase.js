// ---------------------------------------------------------------------------
// Configuración de Firebase (Realtime Database).
// Sustituye los valores "TU_..." por los de tu proyecto (ver la guía, Parte 2/3).
// IMPORTANTE: databaseURL debe ser la que te da Firebase al crear la Realtime
// Database (algo como https://TU_PROYECTO-default-rtdb.europe-west1.firebasedatabase.app).
// ---------------------------------------------------------------------------
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Todos los dispositivos que compartan el mismo FAMILY_ID ven los mismos datos.
// Puedes usar otro grupo abriendo la app con ?family=otro-id
const params = new URLSearchParams(window.location.search);
export const FAMILY_ID = params.get("family") || "familia-principal";
