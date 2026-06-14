import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        brand: "border-transparent bg-brand-gradient text-white",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground border-border",
        success: "border-transparent bg-success/12 text-success",
        destructive: "border-transparent bg-destructive/12 text-destructive",
        accent: "border-transparent bg-accent/15 text-accent-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
