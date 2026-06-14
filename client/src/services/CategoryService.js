// Axios
import { api } from "../api/Axios";

// ---------------------------------------IMPORTS---------------------------------------

// Service to fetch categories by query (page, limit)
export const fetchCategories = async ({ page = 1, limit = 100 } = {}) => {
    return await api.get(`/category?page=${page}&limit=${limit}`);
};

// Service to create new category (admin only, data must be FormData with image)
export const fetchCreateCategory = async (data) => {
    return await api.post("/category/createcategory", data);
};

// Service to edit category by id (admin only, data must be FormData when image is included)
export const fetchEditCategory = async (id, data) => {
    return await api.patch(`/category/editcategory/${id}`, data);
};

// Service to delete category by id (admin only)
export const fetchDeleteCategory = async (id) => {
    return await api.delete(`/category/deletecategory/${id}`);
};
