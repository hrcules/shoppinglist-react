import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./styles/global.css";

// Apply the saved appearance before React renders to avoid a theme flash on
// routes such as login that do not mount the shopping-list page.
try {
  const savedTheme = localStorage.getItem("shopping-list-theme");
  document.documentElement.dataset.theme = savedTheme === "light" ? "light" : "dark";
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    savedTheme === "light" ? "#f7f5fa" : "#0c0c0d"
  );
} catch {
  document.documentElement.dataset.theme = "dark";
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
  </React.StrictMode>
);
