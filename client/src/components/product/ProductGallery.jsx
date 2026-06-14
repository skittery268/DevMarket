import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ImageWithFallback from "@/components/common/ImageWithFallback";
import { IMG_FALLBACK } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Product detail gallery: large active image + thumbnail strip.
function ProductGallery({ images = [], alt = "" }) {
  const list = images.length ? images : [{ url: IMG_FALLBACK }];
  const [active, setActive] = useState(0);
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-secondary/40">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="size-full"
          >
            <ImageWithFallback src={current?.url} alt={alt} className="size-full" />
          </motion.div>
        </AnimatePresence>
      </div>

      {list.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "size-18 overflow-hidden rounded-xl border-2 transition-colors",
                i === active ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              <ImageWithFallback src={img.url} alt={`${alt} ${i + 1}`} className="size-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
