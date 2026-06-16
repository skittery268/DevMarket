// React tools
import { useState, useCallback, useMemo } from "react";

// Search context
import { SearchContext } from "../context/SearchContext";

// Request cache (caching + in-flight de-duplication)
import { cachedRequest } from "../lib/cache";

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

    // Function to search users by fullname (cached per query term)
    const searchUsers = useCallback(async (fullname) => {
        try {
            const data = await cachedRequest(`search:users:${fullname}`, async () => {
                const res = await fetchSearchUsers(fullname);

                return res.data.data.users;
            });

            setResults(prev => ({ ...prev, users: data }));

            return data;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to search products by title or description (cached per query term)
    const searchProducts = useCallback(async (title) => {
        try {
            const data = await cachedRequest(`search:products:${title}`, async () => {
                const res = await fetchSearchProducts(title);

                return res.data.data.products;
            });

            setResults(prev => ({ ...prev, products: data }));

            return data;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to search categories by name or description (cached per query term)
    const searchCategories = useCallback(async (name) => {
        try {
            const data = await cachedRequest(`search:categories:${name}`, async () => {
                const res = await fetchSearchCategories(name);

                return res.data.data.categories;
            });

            setResults(prev => ({ ...prev, categories: data }));

            return data;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to clear search results
    const clearResults = useCallback(
        () => setResults({ users: [], products: [], categories: [] }),
        []
    );

    // Memoize the context value so consumers only re-render on real data changes.
    const value = useMemo(
        () => ({ results, searchUsers, searchProducts, searchCategories, clearResults }),
        [results, searchUsers, searchProducts, searchCategories, clearResults]
    );

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};
