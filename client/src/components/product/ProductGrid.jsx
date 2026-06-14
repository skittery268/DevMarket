import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";

import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Responsive product grid with staggered reveal, skeleton + empty states.
function ProductGrid({ products = [], loading, skeletonCount = 8, emptyTitle, emptyDescription, emptyAction, className }) {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={emptyTitle || "No products found"}
        description={emptyDescription || "Try adjusting your filters or check back later."}
        action={emptyAction}
      />
    );
  }

  return (
    <motion.div
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      initial="hidden"
      animate="show"
      className={cn("grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4", className)}
    >
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </motion.div>
  );
}

export default ProductGrid;
