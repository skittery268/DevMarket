// React Router
import { Route, Routes } from "react-router";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Components
import Nav from "./components/Nav";

// ---------------------------------------IMPORTS---------------------------------------

// The main function to unite everything
const App = () => {
	return (
		<>
			<Nav />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>
		</>
	);
};

export default App;