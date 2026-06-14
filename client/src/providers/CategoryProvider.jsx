// React tools
import { useState } from "react";

// Category context
import { CategoryContext } from "../context/CategoryContext";

// Services
import {
    fetchCategories,
    fetchCreateCategory,
    fetchEditCategory,
    fetchDeleteCategory
} from "../services/CategoryService";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide category functions for any components
export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [categoryCount, setCategoryCount] = useState(0);

    // Function to load categories by query (page, limit)
    const loadCategories = async (query) => {
        try {
            const res = await fetchCategories(query);

            setCategories(res.data.data.categories);
            setCategoryCount(res.data.categoryCount);

            return res.data.data.categories;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to create new category (admin only, data must be FormData with image)
    const createCategory = async (data) => {
        try {
            const res = await fetchCreateCategory(data);

            setCategories(prev => [...prev, res.data.data.category]);

            return res.data.data.category;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to edit category by id (admin only)
    const editCategory = async (id, data) => {
        try {
            const res = await fetchEditCategory(id, data);

            setCategories(prev => prev.map(c => (c._id === id ? res.data.data.category : c)));

            return res.data.data.category;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to delete category by id (admin only)
    const deleteCategory = async (id) => {
        try {
            await fetchDeleteCategory(id);

            setCategories(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            console.log(err);
        };
    };

    return (
        <CategoryContext.Provider value={{ categories, categoryCount, loadCategories, createCategory, editCategory, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};
