// React tools
import { useState, useCallback, useMemo } from "react";

// Review context
import { ReviewContext } from "../context/ReviewContext";

// Services
import {
    fetchProductReviews,
    fetchCreateReview,
    fetchEditReview,
    fetchDeleteReview
} from "../services/ReviewService";

// ---------------------------------------IMPORTS---------------------------------------

// Function to provide review functions for any components.
// Holds the reviews of the product currently being viewed; the local list is
// kept in sync on create/edit/delete so the average rating recomputes instantly.
export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);
    const [reviewsCount, setReviewsCount] = useState(0);

    // Function to load reviews of a product (replaces the current list)
    const loadReviews = useCallback(async (productId, query) => {
        try {
            const res = await fetchProductReviews(productId, query);

            setReviews(res.data.data.reviews);
            setReviewsCount(res.data.reviewsCount);

            return res.data.data.reviews;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to create a new review (body: { content, rating })
    const createReview = useCallback(async (productId, data) => {
        try {
            const res = await fetchCreateReview(productId, data);

            setReviews(prev => [res.data.data.review, ...prev]);
            setReviewsCount(prev => prev + 1);

            return res.data.data.review;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to edit a review by id (body: { content?, rating? })
    const editReview = useCallback(async (reviewId, data) => {
        try {
            const res = await fetchEditReview(reviewId, data);

            setReviews(prev => prev.map(r => (r._id === reviewId ? res.data.data.review : r)));

            return res.data.data.review;
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Function to delete a review by id
    const deleteReview = useCallback(async (reviewId) => {
        try {
            await fetchDeleteReview(reviewId);

            setReviews(prev => prev.filter(r => r._id !== reviewId));
            setReviewsCount(prev => Math.max(prev - 1, 0));
        } catch (err) {
            console.log(err);

            throw err;
        };
    }, []);

    // Memoize the context value so consumers only re-render when the data
    // actually changes, not on every provider render.
    const value = useMemo(
        () => ({
            reviews,
            reviewsCount,
            loadReviews,
            createReview,
            editReview,
            deleteReview
        }),
        [reviews, reviewsCount, loadReviews, createReview, editReview, deleteReview]
    );

    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    );
};
