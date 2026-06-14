// React Router
import { Route, Routes } from "react-router";

// Layout & guards
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/routing/RoleRoute";

// Public pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";

// Authenticated pages
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Chats from "./pages/Chats";
import ChatRoom from "./pages/ChatRoom";

// Admin pages
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";

// Seller pages
import SellerProducts from "./pages/seller/SellerProducts";

// ---------------------------------------IMPORTS---------------------------------------

// The main function to unite everything
const App = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				{/* Public */}
				<Route path="/" element={<Home />} />
				<Route path="/products" element={<Products />} />
				<Route path="/products/:id" element={<ProductDetail />} />
				<Route path="/categories" element={<Categories />} />
				<Route path="/categories/:id" element={<CategoryProducts />} />
				<Route path="/search" element={<SearchResults />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/success" element={<Success />} />
				<Route path="/cancel" element={<Cancel />} />

				{/* Authenticated */}
				<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
				<Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
				<Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
				<Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
				<Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
				<Route path="/chats/:chatId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />

				{/* Seller */}
				<Route
					path="/seller/products"
					element={<RoleRoute roles={["seller", "admin"]}><SellerProducts /></RoleRoute>}
				/>

				{/* Admin */}
				<Route
					path="/admin/users"
					element={<RoleRoute roles={["admin"]}><AdminUsers /></RoleRoute>}
				/>
				<Route
					path="/admin/categories"
					element={<RoleRoute roles={["admin"]}><AdminCategories /></RoleRoute>}
				/>
				<Route
					path="/admin/products"
					element={<RoleRoute roles={["admin"]}><AdminProducts /></RoleRoute>}
				/>

				{/* 404 */}
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
};

export default App;
