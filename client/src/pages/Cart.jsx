import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/hooks/useCart";
import { formatPrice, productImage } from "@/lib/format";

import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import QuantityStepper from "@/components/product/QuantityStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function CartRow({ item, onQty, onRemove }) {
  const u = item.product.universal || {};
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 py-4"
    >
      <Link to={`/products/${item.product._id}`} state={{ product: item.product }} className="shrink-0">
        <ImageWithFallback
          src={productImage(item.product)}
          alt={u.title}
          className="size-24 rounded-xl border border-border/60"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/products/${item.product._id}`}
            state={{ product: item.product }}
            className="line-clamp-2 font-medium hover:text-primary"
          >
            {u.title}
          </Link>
          <button
            onClick={onRemove}
            className="text-muted-foreground transition-colors hover:text-destructive"
            aria-label="Remove item"
          >
            <Trash2 className="size-4.5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{formatPrice(u.price)} each</p>
        <div className="mt-auto flex items-center justify-between">
          <QuantityStepper
            value={item.quantity}
            onChange={onQty}
            min={1}
            max={u.stock || Infinity}
          />
          <span className="font-display text-lg font-bold">
            {formatPrice((u.price || 0) * item.quantity)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, itemCount } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={
            <Button variant="brand" asChild>
              <Link to="/products">Start shopping</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
        Cart <span className="text-lg font-normal text-muted-foreground">({itemCount})</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="divide-y divide-border/70">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartRow
                  key={item.product._id}
                  item={item}
                  onQty={(q) => updateQuantity(item.product._id, q)}
                  onRemove={() => removeFromCart(item.product._id)}
                />
              ))}
            </AnimatePresence>
            <div className="pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearCart();
                  toast("Cart cleared");
                }}
              >
                <Trash2 /> Clear cart
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="h-fit lg:sticky lg:top-20">
          <Card>
            <CardContent className="space-y-4 pt-2">
              <h2 className="font-display text-lg font-semibold">Order summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">{itemCount}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-brand-gradient font-display text-xl">{formatPrice(totalPrice)}</span>
              </div>
              <Button variant="brand" size="lg" className="w-full" onClick={() => navigate("/checkout")}>
                Proceed to checkout <ArrowRight />
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/products">Continue shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Cart;
