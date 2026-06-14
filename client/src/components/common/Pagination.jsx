import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Compact numeric pager. `page` is 1-based; `total` is the item count.
function Pagination({ page, total, pageSize, onChange, className }) {
  const pageCount = Math.max(1, Math.ceil((total || 0) / pageSize));
  if (pageCount <= 1) return null;

  // Window of page numbers around the current page
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pageCount, start + 4);
  for (let p = Math.max(1, end - 4); p <= end; p++) pages.push(p);

  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      <Button
        variant="outline"
        size="icon-sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </Button>

      {pages[0] > 1 && (
        <>
          <Button variant="ghost" size="icon-sm" onClick={() => onChange(1)}>
            1
          </Button>
          {pages[0] > 2 && <span className="px-1 text-muted-foreground">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "brand" : "ghost"}
          size="icon-sm"
          onClick={() => onChange(p)}
        >
          {p}
        </Button>
      ))}

      {pages[pages.length - 1] < pageCount && (
        <>
          {pages[pages.length - 1] < pageCount - 1 && (
            <span className="px-1 text-muted-foreground">…</span>
          )}
          <Button variant="ghost" size="icon-sm" onClick={() => onChange(pageCount)}>
            {pageCount}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon-sm"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

export default Pagination;
