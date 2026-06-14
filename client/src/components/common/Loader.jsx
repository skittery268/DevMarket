import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Centered spinner. `full` makes it take a comfortable viewport height.
function Loader({ full = false, className, label }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted-foreground",
        full && "min-h-[60vh]",
        className
      )}
    >
      <Loader2 className="size-7 animate-spin text-primary" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export default Loader;
