import { Link } from "react-router";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";

import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";

function Cancel() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-3xl border border-border/70 bg-card p-10 text-center shadow-card"
      >
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/12 text-destructive">
          <XCircle className="size-11" />
        </div>

        <h1 className="font-display text-3xl font-bold">Payment cancelled</h1>
        <p className="mt-3 text-muted-foreground">
          No worries — your card was not charged. Your items are still in your cart
          whenever you're ready.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="brand" asChild>
            <Link to="/cart"><ShoppingCart /> Back to cart</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/products"><ArrowLeft /> Continue shopping</Link>
          </Button>
        </div>
      </motion.div>
    </Container>
  );
}

export default Cancel;
