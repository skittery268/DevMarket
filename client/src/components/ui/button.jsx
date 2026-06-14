import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-glow hover:brightness-105",
        brand:
          "bg-brand-gradient text-white shadow-sm hover:shadow-glow hover:brightness-105",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:brightness-105",
        outline:
          "border border-border bg-card hover:bg-secondary hover:text-secondary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-lg px-3.5 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-7 text-base has-[>svg]:px-5",
        icon: "size-10",
        "icon-sm": "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
