import { useEffect, useState } from "react";

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "env(safe-area-inset-top, 0px)",
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "10px 16px",
        background: "#7a2f28",
        color: "#ffffff",
        textAlign: "center",
        fontSize: "13px",
        lineHeight: 1.4,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      Você está offline. Suas alterações serão sincronizadas quando a conexão voltar.
    </div>
  );
}

export default NetworkStatus;
