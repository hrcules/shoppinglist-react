import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./styles/global.css";

// Aplica o tema claro antes da renderização do React.
document.documentElement.dataset.theme = "light";

try {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", "#f7f5fa");
} catch {
  // A aplicação continua funcionando mesmo se a meta tag não existir.
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Não foi possível registrar o service worker:", error);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
