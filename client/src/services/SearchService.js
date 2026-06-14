// Axios
import { api } from "../api/Axios";

// ---------------------------------------IMPORTS---------------------------------------

// Service to search users by fullname
export const fetchSearchUsers = async (fullname) => {
    return await api.get(`/search/users?fullname=${fullname}`);
};

// Service to search products by title or description
export const fetchSearchProducts = async (title) => {
    return await api.get(`/search/products?title=${title}`);
};

// Service to search categories by name or description
export const fetchSearchCategories = async (name) => {
    return await api.get(`/search/categories?name=${name}`);
};
