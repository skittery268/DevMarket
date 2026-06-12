// Auth Context
import { useState } from "react";
import { AuthContext } from "../context/AuthContext"
import { fetchLogin, fetchLogout, fetchMe, fetchRegister } from "../services/AuthService";
import { useNavigate } from "react-router";
import { useEffect } from "react";

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
                return err;
            };
        };

        getMe();
    }, [navigate]);

    // Functuon to register new user
    const register = async (data) => {
        try {
            await fetchRegister(data);

            navigate("/login");
        } catch (err) {
            return err
        };
    };

    // Function to login user
    const login = async (data) => {
        try {
            const res = await fetchLogin(data);

            setUser(res.data.data.user);
            navigate("/profile");
        } catch (err) {
            return err;
        };
    };

    // Function to logout (clear cookies)
    const logout = async () => {
        try {
            await fetchLogout();
        } catch (err) {
            return err;
        }
    }

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};