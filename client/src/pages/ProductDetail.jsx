import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  ShoppingCart,
  Store,
  PackageX,
  ChevronRight,
} from "lucide-react";

import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, apiError } from "@/lib/format";
import { cn } from "@/lib/utils";

import Container from "@/components/common/Container";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ProductGallery from "@/components/product/ProductGallery";
import ProductReviews from "@/components/product/ProductReviews";
import QuantityStepper from "@/components/product/QuantityStepper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { loadProduct } = useProduct();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { createChat } = useChat();
  const { user } = useAuth();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await loadProduct(id);
        if (!cancelled) {
          if (p) setProduct(p);
          else setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader full label="Loading product..." />;

  if (notFound || !product) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={PackageX}
          title="Product not found"
          description="This product may have been removed or is no longer available."
          action={
            <Button variant="brand" asChild>
              <Link to="/products">Back to catalog</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  const u = product.universal || {};
  const wished = isInWishlist(product._id);
  const outOfStock = u.stock <= 0;
  const sellerId = u.sellerId?._id || u.sellerId;
  const isOwnProduct = user && sellerId && user._id === sellerId;
  const attributes = product.attributes && typeof product.attributes === "object"
    ? Object.entries(product.attributes)
    : [];

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart(product, qty);
    console.log("Added to cart", { description: `${qty} × ${u.title}` });
  };

  const handleMessageSeller = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setMessaging(true);
    try {
      const chat = await createChat({ productId: product._id, sellerId });
      if (chat?._id) navigate(`/chats/${chat._id}`);
    } catch (err) {
      console.error(apiError(err, "Could not start a chat"));
    } finally {
      setMessaging(false);
    }
  };

  return (
    <Container className="py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/products" className="hover:text-foreground">Products</Link>
        {u.category?.name && (
          <>
            <ChevronRight className="size-3.5" />
            <Link
              to={`/categories/${u.category._id}`}
              state={{ category: u.category }}
              className="hover:text-foreground"
            >
              {u.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3.5" />
        <span className="line-clamp-1 text-foreground">{u.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <ProductGallery images={u.images} alt={u.title} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {u.category?.name && <Badge variant="accent">{u.category.name}</Badge>}
              {outOfStock ? (
                <Badge variant="destructive">Out of stock</Badge>
              ) : (
                <Badge variant="success">{u.stock} in stock</Badge>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">{u.title}</h1>
            <p className="font-display text-3xl font-bold text-brand-gradient">{formatPrice(u.price)}</p>
          </div>

          {u.sellerId?.fullname && (
            <Link
              to="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-gradient text-white">
                <Store className="size-4" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">Sold by</span>
                <span className="font-medium">{u.sellerId.fullname}</span>
              </span>
            </Link>
          )}

          <p className="leading-relaxed text-muted-foreground">{u.description}</p>

          {attributes.length > 0 && (
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">Specifications</h3>
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {attributes.map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-3 border-b border-border/50 py-1.5 text-sm">
                    <dt className="capitalize text-muted-foreground">{key}</dt>
                    <dd className="font-medium">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            {!outOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <QuantityStepper value={qty} onChange={setQty} min={1} max={u.stock || 1} />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="brand" className="flex-1" onClick={handleAdd} disabled={outOfStock}>
                <ShoppingCart /> Add to cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  toggleWishlist(product);
                  console.log(wished ? "Removed from wishlist" : "Saved to wishlist");
                }}
              >
                <Heart className={cn("size-5", wished && "fill-destructive text-destructive")} />
              </Button>
            </div>

            {!isOwnProduct && (
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={handleMessageSeller}
                disabled={messaging}
              >
                <MessageCircle /> {messaging ? "Starting chat..." : "Message seller"}
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      <ProductReviews productId={product._id} />
    </Container>
  );
}

export default ProductDetail;
