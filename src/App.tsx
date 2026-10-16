import { AuthProvider } from "./contexts/auth";
import { MakeItemsProvider } from "./contexts/makeItems";
import NetworkStatus from "./components/NetworkStatus";
import RoutesApp from "./routes/routes";

function App() {
  return (
    <AuthProvider>
      <MakeItemsProvider>
        <>
          <NetworkStatus />
          <RoutesApp />
        </>
      </MakeItemsProvider>
    </AuthProvider>
  );
}

export default App;
