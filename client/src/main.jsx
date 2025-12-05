import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/Authcontext.jsx";
import App from "./App.jsx";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>
);
