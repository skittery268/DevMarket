import { useState } from "react";
import { cn } from "@/lib/utils";
import { IMG_FALLBACK } from "@/lib/constants";

// <img> that swaps to a branded placeholder when the source fails or is empty.
function ImageWithFallback({ src, alt = "", className, fallback = IMG_FALLBACK, ...props }) {
  const [errored, setErrored] = useState(false);
  const finalSrc = !src || errored ? fallback : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}

export default ImageWithFallback;
