import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { MessageSquare, Pencil, Send, Trash2, X } from "lucide-react";

import { useReview } from "@/hooks/useReview";
import { useAuth } from "@/hooks/useAuth";
import { avatarUrl, initials, formatDate, apiError } from "@/lib/format";

import StarRating from "@/components/product/StarRating";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Pull a generous page so the average reflects (effectively) every rating.
const REVIEWS_LIMIT = 100;

// Mirrors the backend review validation (content 5..100 chars, rating 1..5).
const validate = ({ content, rating }) => {
  const errors = {};
  const trimmed = content.trim();
  if (trimmed.length < 5) errors.content = "Review must be at least 5 characters";
  else if (trimmed.length > 100) errors.content = "Review must be at most 100 characters";
  if (!rating || rating < 1 || rating > 5) errors.rating = "Please pick a rating";
  return errors;
};

function ProductReviews({ productId }) {
  const { reviews, reviewsCount, loadReviews, createReview, editReview, deleteReview } = useReview();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await loadReviews(productId, { limit: REVIEWS_LIMIT });
      } catch {
        /* error already logged in provider */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, loadReviews]);

  // Average over the loaded reviews; recomputes automatically when the list changes.
  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const resetForm = () => {
    setContent("");
    setRating(0);
    setErrors({});
    setEditingId(null);
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setContent(review.commentId?.content || "");
    setRating(review.rating || 0);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate({ content, rating });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = { content: content.trim(), rating };

    setSubmitting(true);
    try {
      if (editingId) await editReview(editingId, payload);
      else await createReview(productId, payload);
      resetForm();
    } catch (err) {
      setErrors({ content: apiError(err, "Could not submit your review") });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      if (editingId === reviewId) resetForm();
    } catch (err) {
      toast.error(apiError(err, "Could not delete review"));
    }
  };

  return (
    <section className="mt-14">
      <Separator className="mb-10" />

      {/* Summary */}
      <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Reviews</h2>
          <p className="text-sm text-muted-foreground">
            {reviewsCount} {reviewsCount === 1 ? "review" : "reviews"}
          </p>
        </div>
        {reviewsCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-bold">{average.toFixed(1)}</span>
            <StarRating value={average} size="size-5" />
          </div>
        )}
      </div>

      {/* Review form (signed-in users only) */}
      {user ? (
        <Card className="mb-8">
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-sm font-medium">
                  {editingId ? "Edit your review" : "Your rating"}
                </span>
                <StarRating value={rating} onChange={setRating} size="size-7" />
                {errors.rating && <p className="text-xs text-destructive">{errors.rating}</p>}
              </div>
              <div className="space-y-1.5">
                <Textarea
                  name="content"
                  placeholder="Share what you think about this product..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={100}
                  aria-invalid={!!errors.content}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="text-destructive">{errors.content}</span>
                  <span>{content.trim().length}/100</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="brand" disabled={submitting}>
                  <Send /> {submitting ? "Submitting..." : editingId ? "Update review" : "Submit review"}
                </Button>
                {editingId && (
                  <Button type="button" variant="ghost" onClick={resetForm} disabled={submitting}>
                    <X /> Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardContent className="flex items-center justify-between gap-4 pt-2">
            <p className="text-sm text-muted-foreground">Sign in to leave a review.</p>
            <Button variant="outline" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews list */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No reviews yet"
          description="Be the first to share your experience with this product."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const author = review.authorId || {};
            const isOwn = user && (author._id === user._id || author === user._id);
            return (
              <Card key={review._id}>
                <CardContent className="pt-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={avatarUrl(author)} alt={author.fullname} />
                      <AvatarFallback>{initials(author.fullname)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium">{author.fullname || "User"}</span>
                        {isOwn && <span className="text-xs text-muted-foreground">(You)</span>}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <StarRating value={review.rating} size="size-4" className="mt-1" />
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {review.commentId?.content}
                      </p>
                    </div>
                    {isOwn && (
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Edit review"
                          onClick={() => startEdit(review)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Delete review"
                          onClick={() => handleDelete(review._id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProductReviews;
