import { Link } from "react-router";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useWishlist } from "@/hooks/useWishlist";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

function Wishlist() {
  const { items, clearWishlist } = useWishlist();

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Saved"
        title="Your wishlist"
        description="Products you've saved for later. Tap the heart to remove."
        action={
          items.length ? (
            <Button
              variant="outline"
              onClick={() => {
                clearWishlist();
                toast("Wishlist cleared");
              }}
            >
              <Trash2 /> Clear all
            </Button>
          ) : null
        }
      />

      {items.length ? (
        <ProductGrid products={items} />
      ) : (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Browse the catalog and save the products you love."
          action={
            <Button variant="brand" asChild>
              <Link to="/products">Explore products</Link>
            </Button>
          }
        />
      )}
    </Container>
  );
}

export default Wishlist;
