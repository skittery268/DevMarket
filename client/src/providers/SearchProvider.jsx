// React tools
import { useState } from "react";

// Search context
import { SearchContext } from "../context/SearchContext";

// Services
import {
    fetchSearchUsers,
    fetchSearchProducts,
    fetchSearchCategories
} from "../services/SearchService";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide search functions for any components
export const SearchProvider = ({ children }) => {
    const [results, setResults] = useState({ users: [], products: [], categories: [] });

    // Function to search users by fullname
    const searchUsers = async (fullname) => {
        try {
            const res = await fetchSearchUsers(fullname);

            setResults(prev => ({ ...prev, users: res.data.data.users }));

            return res.data.data.users;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to search products by title or description
    const searchProducts = async (title) => {
        try {
            const res = await fetchSearchProducts(title);

            setResults(prev => ({ ...prev, products: res.data.data.products }));

            return res.data.data.products;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to search categories by name or description
    const searchCategories = async (name) => {
        try {
            const res = await fetchSearchCategories(name);

            setResults(prev => ({ ...prev, categories: res.data.data.categories }));

            return res.data.data.categories;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to clear search results
    const clearResults = () => setResults({ users: [], products: [], categories: [] });

    return (
        <SearchContext.Provider value={{ results, searchUsers, searchProducts, searchCategories, clearResults }}>
            {children}
        </SearchContext.Provider>
    );
};
