// Axios
import axios from "axios";

// ---------------------------------------IMPORTS---------------------------------------

// We give api url from .env file
const URL = import.meta.env.VITE_API_URL;

// To send requests to server
export const api = axios.create({
    baseURL: URL,
    withCredentials: true
});
