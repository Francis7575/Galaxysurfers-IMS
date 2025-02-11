import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RefreshProvider } from "./context/RefreshContext.tsx";

createRoot(document.getElementById("root")!).render(
  <RefreshProvider>
    <App />
  </RefreshProvider>
);
