// React tools
import { createRoot } from 'react-dom/client'

// Components
import App from './App.jsx'

// React Router
import { BrowserRouter } from "react-router";

// Providers
import { AuthProvider } from './providers/AuthProvider.js';

// ---------------------------------------IMPORTS---------------------------------------

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
