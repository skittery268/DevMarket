import { useState } from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

// Star rating widget.
// - Read-only mode (default) renders a fractional fill so an average like 4.3
//   shows partially filled stars.
// - Interactive mode (onChange provided) lets the user click a value 1..5.
function StarRating({ value = 0, onChange, max = 5, size = "size-5", className }) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const shown = interactive && hover ? hover : value;

  if (interactive) {
    return (
      <div className={cn("flex items-center gap-1", className)} role="radiogroup" aria-label="Rating">
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
              aria-checked={value === starValue}
              role="radio"
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  size,
                  starValue <= shown
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground/40"
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`Rated ${value} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        // Fraction of this star that should be filled (0..1).
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-flex">
            <Star className={cn(size, "fill-transparent text-muted-foreground/30")} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn(size, "fill-amber-400 text-amber-400")} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;
