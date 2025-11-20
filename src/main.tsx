import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

async function initializeApp() {
  console.log("Mode:", import.meta.env.MODE);

  if (import.meta.env.MODE === "development") {
    const { worker } = await import("./mocks/browser");
    await worker.start();
    console.log("[MSW] Mock server started");
  }

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Failed to find root element");
  }

  ReactDOM.createRoot(rootElement).render(
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

initializeApp().catch((err) => {
  console.error("Failed to initialize app:", err);
});
