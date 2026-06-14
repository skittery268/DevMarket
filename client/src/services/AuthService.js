// Axios
import { api } from "../api/Axios"

// ---------------------------------------IMPORTS---------------------------------------

// Service to fetch register new user
export const fetchRegister = async (data) => {
    return await api.post("/auth/register", data);
};

// Service to fetch login new user
export const fetchLogin = async (data) => {
    return await api.post("/auth/login", data);
};

// Service to fetch user object
export const fetchMe = async () => {
    return await api.get("/auth/me");
};

// Service to fetch logout (clear cookie section)
export const fetchLogout = async () => {
    return await api.post("/auth/logout");
};

// Redirect helper to start Google OAuth flow (full page redirect)
export const redirectGoogleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
};
