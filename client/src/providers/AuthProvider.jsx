// React tools
import { useState, useEffect } from "react";

// Auth context
import { AuthContext } from "../context/AuthContext"

// Services
import { fetchLogin, fetchLogout, fetchMe, fetchRegister } from "../services/AuthService";

// React router
import { useNavigate } from "react-router";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide functions for any components
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Use effect to auto login
    useEffect(() => {
        const getMe = async () => {
            try {
                const res = await fetchMe();
    
                setUser(res.data.data.user);
                navigate("/profile");
            } catch (err) {
                console.log(err);
            };
        };

        getMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Functuon to register new user
    const register = async (data) => {
        try {
            await fetchRegister(data);

            navigate("/login");
        } catch (err) {
            console.log(err);
        };
    };

    // Function to login user
    const login = async (data) => {
        try {
            const res = await fetchLogin(data);

            setUser(res.data.data.user);
            navigate("/profile");
        } catch (err) {
            console.log(err);
        };
    };

    // Function to logout (clear cookies)
    const logout = async () => {
        try {
            await fetchLogout();
            setUser(null);
            navigate("/");
        } catch (err) {
            console.log(err);
        };
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};