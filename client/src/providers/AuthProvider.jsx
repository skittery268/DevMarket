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
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    // Use effect to auto login (restore session) WITHOUT forcing a redirect,
    // so deep links and page refreshes keep the user on the current route.
    useEffect(() => {
        const getMe = async () => {
            try {
                const res = await fetchMe();

                setUser(res.data.data.user);
            } catch (err) {
                console.log(err);
            } finally {
                setAuthLoading(false);
            }
        };

        getMe();
    }, []);

    // Functuon to register new user
    const register = async (data) => {
        try {
            await fetchRegister(data);

            navigate("/login");
        } catch (err) {
            console.log(err);

            throw err;
        };
    };

    // Function to login user
    const login = async (data) => {
        try {
            const res = await fetchLogin(data);

            setUser(res.data.data.user);
            navigate("/");

            return res.data.data.user;
        } catch (err) {
            console.log(err);

            throw err;
        };
    };

    // Re-fetch the current user (e.g. after editing the profile) so the header
    // avatar / name stay in sync. Additive helper, swallows errors like getMe.
    const refreshMe = async () => {
        try {
            const res = await fetchMe();

            setUser(res.data.data.user);

            return res.data.data.user;
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

            throw err;
        };
    };

    return (
        <AuthContext.Provider value={{ user, authLoading, register, login, logout, refreshMe }}>
            {children}
        </AuthContext.Provider>
    );
};
