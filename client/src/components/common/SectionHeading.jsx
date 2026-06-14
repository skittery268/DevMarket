import { cn } from "@/lib/utils";

// Reusable section title with optional eyebrow + trailing action.
function SectionHeading({ eyebrow, title, description, action, className, align = "left" }) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className="space-y-2">
        {eyebrow && (
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default SectionHeading;
