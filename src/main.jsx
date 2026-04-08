import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const serviceWorkerUrl = `${import.meta.env.BASE_URL}service-worker.js`;
    navigator.serviceWorker
      .register(serviceWorkerUrl)
      .catch(() => {
        // Service worker registration is optional enhancement.
      });
  });
}
