import { AuthProvider } from "./contexts/auth";
import { MakeItemsProvider } from "./contexts/makeItems";
import RoutesApp from "./routes/routes";

function App() {
  return (
    <AuthProvider>
      <MakeItemsProvider>
        <RoutesApp />
      </MakeItemsProvider>
    </AuthProvider>
  );
}

export default App;
