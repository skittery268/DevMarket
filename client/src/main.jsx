// React tools
import { createRoot } from 'react-dom/client'

// Global styles
import './index.css'

// Components
import App from './App.jsx'
import ScrollToTop from './components/ScrollToTop';

// React Router
import { BrowserRouter } from 'react-router';

// Providers
import { ThemeProvider } from './providers/ThemeProvider.jsx';
import { AuthProvider } from './providers/AuthProvider.jsx';
import { UserProvider } from './providers/UserProvider.jsx';
import { CategoryProvider } from './providers/CategoryProvider.jsx';
import { ProductProvider } from './providers/ProductProvider.jsx';
import { CartProvider } from './providers/CartProvider.jsx';
import { WishlistProvider } from './providers/WishlistProvider.jsx';
import { ChatProvider } from './providers/ChatProvider.jsx';
import { SocketProvider } from './providers/SocketProvider.jsx';
import { MessageProvider } from './providers/MessageProvider.jsx';
import { SearchProvider } from './providers/SearchProvider.jsx';
import { PaymentProvider } from './providers/PaymentProvider.jsx';
import { ReviewProvider } from './providers/ReviewProvider.jsx';

// ---------------------------------------IMPORTS---------------------------------------

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
    <AuthProvider>
      <UserProvider>
        <CategoryProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <ChatProvider>
                  <SocketProvider>
                    <MessageProvider>
                      <SearchProvider>
                        <PaymentProvider>
                          <ReviewProvider>
                            <ScrollToTop />
                            <App />
                          </ReviewProvider>
                        </PaymentProvider>
                      </SearchProvider>
                    </MessageProvider>
                  </SocketProvider>
                </ChatProvider>
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </CategoryProvider>
      </UserProvider>
    </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
