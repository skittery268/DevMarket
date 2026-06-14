// React tools
import { useState } from "react";

// Product context
import { ProductContext } from "../context/ProductContext";

// Services
import {
    fetchProducts,
    fetchCreateProduct,
    fetchEditProduct,
    fetchDeleteProduct
} from "../services/ProductService";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide product functions for any components
export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);

    // Function to load products by query (page, limit)
    const loadProducts = async (query) => {
        try {
            const res = await fetchProducts(query);

            setProducts(res.data.data.products);
            setProductCount(res.data.productCount);

            return res.data.data.products;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to create new product in a category (data must be FormData with images)
    const createProduct = async (categoryId, data) => {
        try {
            const res = await fetchCreateProduct(categoryId, data);

            setProducts(prev => [...prev, res.data.data.product]);

            return res.data.data.product;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to edit product by id (data must be FormData when images are included)
    const editProduct = async (productId, data) => {
        try {
            const res = await fetchEditProduct(productId, data);

            setProducts(prev => prev.map(p => (p._id === productId ? res.data.data.product : p)));

            return res.data.data.product;
        } catch (err) {
            console.log(err);
        };
    };

    // Function to delete product by id
    const deleteProduct = async (productId) => {
        try {
            await fetchDeleteProduct(productId);

            setProducts(prev => prev.filter(p => p._id !== productId));
        } catch (err) {
            console.log(err);
        };
    };

    return (
        <ProductContext.Provider value={{ products, productCount, loadProducts, createProduct, editProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
