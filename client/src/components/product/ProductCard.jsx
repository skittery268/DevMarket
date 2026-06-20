import { Link } from "react-router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Heart, ShoppingCart, Store } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { productImage, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageWithFallback from "@/components/common/ImageWithFallback";

// Single product tile used across catalog, search, wishlist and home.
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const u = product?.universal || {};
  const wished = isInWishlist(product._id);
  const outOfStock = u.stock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product, 1);
    toast.success(`Added to cart — ${u.title}`);
  };

  const handleWish = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.success(`${wished ? "Removed from wishlist" : "Saved to wishlist"} — ${u.title}`);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group h-full"
    >
      <Link
        to={`/products/${product._id}`}
        state={{ product }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card transition-shadow hover:shadow-glow"
      >
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <ImageWithFallback
            src={productImage(product)}
            alt={u.title}
            className="size-full transition-transform duration-500 group-hover:scale-105"
          />

          <button
            type="button"
            onClick={handleWish}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/85 backdrop-blur transition-colors hover:bg-background"
          >
            <Heart
              className={cn(
                "size-4.5 transition-colors",
                wished ? "fill-destructive text-destructive" : "text-muted-foreground"
              )}
            />
          </button>

          {u.category?.name && (
            <Badge variant="secondary" className="absolute left-3 top-3 backdrop-blur">
              {u.category.name}
            </Badge>
          )}

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
              <Badge variant="destructive">Out of stock</Badge>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex-1 space-y-1.5">
            <h3 className="line-clamp-1 font-semibold leading-tight">{u.title}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">{u.description}</p>
          </div>

          {u.sellerId?.fullname && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Store className="size-3.5" /> {u.sellerId.fullname}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="font-display text-lg font-bold">{formatPrice(u.price)}</span>
            <Button size="sm" variant="brand" onClick={handleAdd} disabled={outOfStock}>
              <ShoppingCart className="size-4" /> Add
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
