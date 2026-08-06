import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Registra el service worker (necesario para las notificaciones locales y la PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((e) => console.log("SW no registrado:", e));
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
