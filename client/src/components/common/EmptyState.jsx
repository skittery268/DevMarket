import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Friendly empty/placeholder block with an icon and optional CTA.
function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-brand-mesh px-6 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
          <Icon className="size-7" />
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

export default EmptyState;
