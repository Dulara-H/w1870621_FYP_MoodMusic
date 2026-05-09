import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PlayerProvider } from "./context/PlayerContext"; // <--- Import this

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "325911862110-djkndsebqg5j1r35qmt6rduurrs5ukdc.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  // Remove <React.StrictMode>
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </GoogleOAuthProvider>,
);
