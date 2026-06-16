// React tools
import { useState, useCallback, useMemo } from "react";

// User context
import { UserContext } from "../context/UserContext";

// Request cache (caching + in-flight de-duplication)
import { cachedRequest, invalidate } from "../lib/cache";

// Services
import {
    fetchUsers,
    fetchDeleteUser,
    fetchEditUser,
    fetchChangeRole
} from "../services/UserService";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide user functions for any components
export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);

    // Function to load users by query (page, limit). Cached per page/limit so the
    // admin users table is not re-fetched every time the page is revisited.
    const loadUsers = useCallback(async (query) => {
        try {
            const { page = 1, limit = 12 } = query || {};
            const key = `users:list:${page}:${limit}`;

            const data = await cachedRequest(key, async () => {
                const res = await fetchUsers(query);

                return res.data.data.users;
            });

            setUsers(data);

            return data;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to edit user info (data must be FormData when an image is included)
    const editUser = useCallback(async (userId, data) => {
        try {
            const res = await fetchEditUser(userId, data);

            setUsers(prev => prev.map(u => (u._id === userId ? res.data.data.user : u)));

            invalidate("users:");

            return res.data.data.user;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to change user role (admin only)
    const changeRole = useCallback(async (userId, role) => {
        try {
            const res = await fetchChangeRole(userId, role);

            setUsers(prev => prev.map(u => (u._id === userId ? res.data.data.user : u)));

            invalidate("users:");

            return res.data.data.user;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to delete user by id
    const deleteUser = useCallback(async (userId) => {
        try {
            await fetchDeleteUser(userId);

            setUsers(prev => prev.filter(u => u._id !== userId));

            invalidate("users:");
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Memoize the context value so consumers only re-render on real data changes.
    const value = useMemo(
        () => ({ users, loadUsers, editUser, changeRole, deleteUser }),
        [users, loadUsers, editUser, changeRole, deleteUser]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
