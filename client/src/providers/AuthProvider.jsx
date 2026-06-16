// React tools
import { useState, useEffect, useCallback, useMemo } from "react";

// Auth context
import { AuthContext } from "../context/AuthContext"

// Services
import { fetchLogin, fetchLogout, fetchMe, fetchRegister } from "../services/AuthService";

// Request cache
import { invalidate } from "../lib/cache";

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
    const register = useCallback(async (data) => {
        try {
            await fetchRegister(data);

            navigate("/login");
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, [navigate]);

    // Function to login user
    const login = useCallback(async (data) => {
        try {
            const res = await fetchLogin(data);

            // Drop any data cached for a previous session so nothing leaks across accounts.
            invalidate();

            setUser(res.data.data.user);
            navigate("/");

            return res.data.data.user;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, [navigate]);

    // Re-fetch the current user (e.g. after editing the profile) so the header
    // avatar / name stay in sync. Additive helper, swallows errors like getMe.
    const refreshMe = useCallback(async () => {
        try {
            const res = await fetchMe();

            setUser(res.data.data.user);

            return res.data.data.user;
        } catch (err) {
            console.log(err);
        };
    }, []);

    // Function to logout (clear cookies)
    const logout = useCallback(async () => {
        try {
            await fetchLogout();

            // Clear all cached data on logout so the next user starts clean.
            invalidate();

            setUser(null);
            navigate("/");
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, [navigate]);

    // Memoize the context value so the whole app (Auth is the outermost provider)
    // does not re-render its consumers unless user / authLoading actually change.
    const value = useMemo(
        () => ({ user, authLoading, register, login, logout, refreshMe }),
        [user, authLoading, register, login, logout, refreshMe]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
