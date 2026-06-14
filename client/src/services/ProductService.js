// Axios
import { api } from "../api/Axios";

// ---------------------------------------IMPORTS---------------------------------------

// Service to fetch products by query (page, limit)
export const fetchProducts = async ({ page = 1, limit = 12 } = {}) => {
    return await api.get(`/product?page=${page}&limit=${limit}`);
};

// Service to fetch a single product by id
export const fetchProduct = async (productId) => {
    return await api.get(`/product/${productId}`);
};

// Service to fetch products that belong to a category
export const fetchProductsByCategory = async (categoryId, { page = 1, limit = 12 } = {}) => {
    return await api.get(`/product/category/${categoryId}?page=${page}&limit=${limit}`);
};

// Service to create new product in a category (data must be FormData with images)
export const fetchCreateProduct = async (categoryId, data) => {
    return await api.post(`/product/createProduct/${categoryId}`, data);
};

// Service to edit product by id (data must be FormData when images are included)
export const fetchEditProduct = async (productId, data) => {
    return await api.patch(`/product/editproduct/${productId}`, data);
};

// Service to delete product by id
export const fetchDeleteProduct = async (productId) => {
    return await api.delete(`/product/deleteproduct/${productId}`);
};
