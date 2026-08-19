// ---------------------------------------------------------------------------
// Configuración de Firebase (Realtime Database).
// Sustituye los valores "TU_..." por los de tu proyecto (ver la guía, Parte 2/3).
// IMPORTANTE: databaseURL debe ser la que te da Firebase al crear la Realtime
// Database (algo como https://TU_PROYECTO-default-rtdb.europe-west1.firebasedatabase.app).
// ---------------------------------------------------------------------------
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYqqZIscgelR-IZYl4BssPESAlaaNKSyI",
  authDomain: "family-rewards-d235b.firebaseapp.com",
  databaseURL: "https://family-rewards-d235b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "family-rewards-d235b",
  storageBucket: "family-rewards-d235b.firebasestorage.app",
  messagingSenderId: "174516718770",
  appId: "1:174516718770:web:fe4bdb9af5369696540dab",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// Todos los dispositivos que compartan el mismo FAMILY_ID ven los mismos datos.
// Puedes usar otro grupo abriendo la app con ?family=otro-id
const params = new URLSearchParams(window.location.search);
export const FAMILY_ID = params.get("family") || "familia-principal";
