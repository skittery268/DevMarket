import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { categoryImage } from "@/lib/format";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { Badge } from "@/components/ui/badge";

// Category tile linking to its product listing.
function CategoryCard({ category }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group h-full"
    >
      <Link
        to={`/categories/${category._id}`}
        state={{ category }}
        className="relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-border/70 shadow-card"
      >
        <ImageWithFallback
          src={categoryImage(category)}
          alt={category.name}
          className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/85 via-foreground/30 to-transparent" />

        {!category.isActive && (
          <Badge variant="destructive" className="absolute left-3 top-3">
            Inactive
          </Badge>
        )}

        <div className="relative space-y-1 p-5 text-background">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold">{category.name}</h3>
            <span className="flex size-8 items-center justify-center rounded-full bg-background/20 backdrop-blur transition-transform group-hover:rotate-45">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-background/80">{category.description}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default CategoryCard;
