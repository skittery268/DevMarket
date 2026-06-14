import { Link } from "react-router";
import { motion } from "framer-motion";
import { Home, Compass } from "lucide-react";

import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-8xl font-extrabold text-brand-gradient sm:text-9xl"
      >
        404
      </motion.p>
      <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="brand" asChild>
          <Link to="/"><Home /> Back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/products"><Compass /> Browse products</Link>
        </Button>
      </div>
    </Container>
  );
}

export default NotFound;
