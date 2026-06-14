// Axios
import { api } from "../api/Axios";

// ---------------------------------------IMPORTS---------------------------------------

// Service to fetch users by query (page, limit)
export const fetchUsers = async ({ page, limit } = {}) => {
    return await api.get(`/user?page=${page}&limit=${limit}`);
};

// Service to delete user by id
export const fetchDeleteUser = async (userId) => {
    return await api.delete(`/user/${userId}`);
};

// Service to edit user info (data must be FormData when an image is included)
export const fetchEditUser = async (userId, data) => {
    return await api.patch(`/user/edit-user/${userId}`, data);
};

// Service to change user role (admin only)
export const fetchChangeRole = async (userId, role) => {
    return await api.patch(`/user/change-role/${userId}`, { role });
};
