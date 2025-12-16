import AppRouter from "./router/AppRouter";
import ConfirmProvider from "./contexts/ConfirmProvider";

export default function App() {
  return (
    <ConfirmProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRouter />
      </div>
    </ConfirmProvider>
  );
}
