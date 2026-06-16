// React tools
import { useState, useCallback, useMemo } from "react";

// Product context
import { ProductContext } from "../context/ProductContext";

// Request cache (caching + in-flight de-duplication)
import { cachedRequest, invalidate } from "../lib/cache";

// Services
import {
    fetchProducts,
    fetchProduct,
    fetchProductsByCategory,
    fetchCreateProduct,
    fetchEditProduct,
    fetchDeleteProduct
} from "../services/ProductService";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide product functions for any components
export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);

    // Function to load products by query (page, limit).
    // Cached per page/limit, so revisiting the catalog or paging back to an
    // already-seen page serves from memory instead of re-hitting the API.
    const loadProducts = useCallback(async (query) => {
        try {
            const { page = 1, limit = 12 } = query || {};
            const key = `products:list:${page}:${limit}`;

            const data = await cachedRequest(key, async () => {
                const res = await fetchProducts(query);

                return {
                    products: res.data.data.products,
                    productCount: res.data.productCount
                };
            });

            setProducts(data.products);
            setProductCount(data.productCount);

            return data.products;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to load a single product by id (returns it, does not touch the list)
    const loadProduct = useCallback(async (productId) => {
        try {
            const key = `products:item:${productId}`;

            return await cachedRequest(key, async () => {
                const res = await fetchProduct(productId);

                return res.data.data.product;
            });
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to load products of a category (returns list + count)
    const loadProductsByCategory = useCallback(async (categoryId, query) => {
        try {
            const { page = 1, limit = 12 } = query || {};
            const key = `products:category:${categoryId}:${page}:${limit}`;

            return await cachedRequest(key, async () => {
                const res = await fetchProductsByCategory(categoryId, query);

                return {
                    products: res.data.data.products,
                    productCount: res.data.productCount
                };
            });
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to create new product in a category (data must be FormData with images)
    const createProduct = useCallback(async (categoryId, data) => {
        try {
            const res = await fetchCreateProduct(categoryId, data);

            setProducts(prev => [...prev, res.data.data.product]);

            // The list/detail caches are now stale - drop them so the next read refetches.
            invalidate("products:");

            return res.data.data.product;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to edit product by id (data must be FormData when images are included)
    const editProduct = useCallback(async (productId, data) => {
        try {
            const res = await fetchEditProduct(productId, data);

            setProducts(prev => prev.map(p => (p._id === productId ? res.data.data.product : p)));

            invalidate("products:");

            return res.data.data.product;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to delete product by id
    const deleteProduct = useCallback(async (productId) => {
        try {
            await fetchDeleteProduct(productId);

            setProducts(prev => prev.filter(p => p._id !== productId));

            invalidate("products:");
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Memoize the context value so consumers only re-render when the data
    // (products / productCount) actually changes, not on every provider render.
    const value = useMemo(
        () => ({
            products,
            productCount,
            loadProducts,
            loadProduct,
            loadProductsByCategory,
            createProduct,
            editProduct,
            deleteProduct
        }),
        [
            products,
            productCount,
            loadProducts,
            loadProduct,
            loadProductsByCategory,
            createProduct,
            editProduct,
            deleteProduct
        ]
    );

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
