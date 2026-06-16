import { useState } from "react";
import { Link, Navigate } from "react-router";
import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { usePayment } from "@/hooks/usePayment";
import { formatPrice, productImage, apiError } from "@/lib/format";

import Container from "@/components/common/Container";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function Checkout() {
  const { items, totalPrice, itemCount, toUserOrder } = useCart();
  const { createCheckoutSession } = usePayment();
  const [loading, setLoading] = useState(false);

  if (!items.length) return <Navigate to="/cart" replace />;

  const handlePay = async () => {
    setLoading(true);
    try {
      // On success this redirects the browser to the Stripe hosted checkout.
      await createCheckoutSession(toUserOrder());
    } catch (err) {
      console.error(apiError(err, "Checkout could not be started"));
      setLoading(false);
    }
  };

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Order review */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="space-y-1 pt-2">
              <h2 className="mb-3 font-display text-lg font-semibold">
                Order review ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h2>
              <div className="divide-y divide-border/70">
                {items.map((item) => {
                  const u = item.product.universal || {};
                  return (
                    <div key={item.product._id} className="flex items-center gap-4 py-3">
                      <ImageWithFallback
                        src={productImage(item.product)}
                        alt={u.title}
                        className="size-16 rounded-xl border border-border/60"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 font-medium">{u.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(u.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {formatPrice((u.price || 0) * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment summary */}
        <div className="h-fit lg:sticky lg:top-20">
          <Card>
            <CardContent className="space-y-4 pt-2">
              <h2 className="font-display text-lg font-semibold">Payment</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total due</span>
                <span className="text-brand-gradient font-display text-xl">{formatPrice(totalPrice)}</span>
              </div>

              <Button variant="brand" size="lg" className="w-full" onClick={handlePay} disabled={loading}>
                <Lock /> {loading ? "Redirecting to Stripe..." : "Pay securely"}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Secured by Stripe
              </p>
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/cart">Back to cart</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Checkout;
