// React tools
import { useState } from "react";

// User context
import { UserContext } from "../context/UserContext";

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

    // Function to load users by query (page, limit)
    const loadUsers = async (query) => {
        try {
            const res = await fetchUsers(query);

            setUsers(res.data.data.users);

            return res.data.data.users;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to edit user info (data must be FormData when an image is included)
    const editUser = async (userId, data) => {
        try {
            const res = await fetchEditUser(userId, data);

            setUsers(prev => prev.map(u => (u._id === userId ? res.data.data.user : u)));

            return res.data.data.user;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to change user role (admin only)
    const changeRole = async (userId, role) => {
        try {
            const res = await fetchChangeRole(userId, role);

            setUsers(prev => prev.map(u => (u._id === userId ? res.data.data.user : u)));

            return res.data.data.user;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to delete user by id
    const deleteUser = async (userId) => {
        try {
            await fetchDeleteUser(userId);

            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            console.log(err);
        };
    };

    return (
        <UserContext.Provider value={{ users, loadUsers, editUser, changeRole, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};
