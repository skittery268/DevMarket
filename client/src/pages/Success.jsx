import { useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Receipt } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";

function Success() {
  const { clearCart } = useCart();

  // Payment completed — empty the cart once on arrival.
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-3xl border border-border/70 bg-card p-10 text-center shadow-card"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
          className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-success/12 text-success"
        >
          <CheckCircle2 className="size-11" />
        </motion.div>

        <h1 className="font-display text-3xl font-bold">Payment successful!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your purchase. Your order is confirmed and your products are
          on their way to your account.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="brand" asChild>
            <Link to="/products"><Package /> Keep shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/profile"><Receipt /> Go to profile</Link>
          </Button>
        </div>
      </motion.div>
    </Container>
  );
}

export default Success;
