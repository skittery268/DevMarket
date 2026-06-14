import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// +/- numeric stepper bounded by [min, max].
function QuantityStepper({ value, onChange, min = 1, max = Infinity, className }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn("inline-flex items-center rounded-xl border border-border bg-card", className)}>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className="flex size-9 items-center justify-center rounded-l-xl text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className="flex size-9 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export default QuantityStepper;
