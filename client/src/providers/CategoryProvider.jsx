// React tools
import { useState, useCallback, useMemo } from "react";

// Category context
import { CategoryContext } from "../context/CategoryContext";

// Request cache (caching + in-flight de-duplication)
import { cachedRequest, invalidate } from "../lib/cache";

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

    // Function to load categories by query (page, limit).
    // Cached per page/limit, so e.g. Home (limit 6) and the Categories page
    // (limit 100) each fetch once and reuse the result on every later visit.
    const loadCategories = useCallback(async (query) => {
        try {
            const { page = 1, limit = 12 } = query || {};
            const key = `categories:list:${page}:${limit}`;

            const data = await cachedRequest(key, async () => {
                const res = await fetchCategories(query);

                return {
                    categories: res.data.data.categories,
                    categoryCount: res.data.categoryCount
                };
            });

            setCategories(data.categories);
            setCategoryCount(data.categoryCount);

            return data.categories;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to create new category (admin only, data must be FormData with image)
    const createCategory = useCallback(async (data) => {
        try {
            const res = await fetchCreateCategory(data);

            setCategories(prev => [...prev, res.data.data.category]);

            // Category lists are now stale - drop them so the next read refetches.
            invalidate("categories:");

            return res.data.data.category;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to edit category by id (admin only)
    const editCategory = useCallback(async (id, data) => {
        try {
            const res = await fetchEditCategory(id, data);

            setCategories(prev => prev.map(c => (c._id === id ? res.data.data.category : c)));

            invalidate("categories:");

            return res.data.data.category;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to delete category by id (admin only)
    const deleteCategory = useCallback(async (id) => {
        try {
            await fetchDeleteCategory(id);

            setCategories(prev => prev.filter(c => c._id !== id));

            invalidate("categories:");
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Memoize the context value so consumers only re-render on real data changes.
    const value = useMemo(
        () => ({
            categories,
            categoryCount,
            loadCategories,
            createCategory,
            editCategory,
            deleteCategory
        }),
        [categories, categoryCount, loadCategories, createCategory, editCategory, deleteCategory]
    );

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};
