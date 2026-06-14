// React tools
import { createRoot } from 'react-dom/client'

// Components
import App from './App.jsx'

// React Router
import { BrowserRouter } from 'react-router';

// Providers
import { AuthProvider } from './providers/AuthProvider.jsx';
import { UserProvider } from './providers/UserProvider.jsx';
import { CategoryProvider } from './providers/CategoryProvider.jsx';
import { ProductProvider } from './providers/ProductProvider.jsx';
import { ChatProvider } from './providers/ChatProvider.jsx';
import { MessageProvider } from './providers/MessageProvider.jsx';
import { SearchProvider } from './providers/SearchProvider.jsx';
import { PaymentProvider } from './providers/PaymentProvider.jsx';

// ---------------------------------------IMPORTS---------------------------------------

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <CategoryProvider>
          <ProductProvider>
            <ChatProvider>
              <MessageProvider>
                <SearchProvider>
                  <PaymentProvider>
                    <App />
                  </PaymentProvider>
                </SearchProvider>
              </MessageProvider>
            </ChatProvider>
          </ProductProvider>
        </CategoryProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
);
