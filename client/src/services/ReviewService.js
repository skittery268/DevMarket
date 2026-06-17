// Axios
import { api } from "../api/Axios";

// ---------------------------------------IMPORTS---------------------------------------

// Service to fetch reviews of a product by query (page, limit)
export const fetchProductReviews = async (productId, { page = 1, limit = 12 } = {}) => {
    return await api.get(`/review/${productId}?page=${page}&limit=${limit}`);
};

// Service to create a new review on a product (body: { content, rating })
export const fetchCreateReview = async (productId, data) => {
    return await api.post(`/review/${productId}`, data);
};

// Service to edit a review by id (body: { content?, rating? })
export const fetchEditReview = async (reviewId, data) => {
    return await api.patch(`/review/${reviewId}`, data);
};

// Service to delete a review by id
export const fetchDeleteReview = async (reviewId) => {
    return await api.delete(`/review/${reviewId}`);
};
