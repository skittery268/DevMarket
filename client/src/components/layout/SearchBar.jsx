import { useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Global search input. Submits to /search?q=term where SearchResults runs the
// user / product / category lookups.
function SearchBar({ className, onSubmitted }) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onSubmitted?.();
  };

  return (
    <form onSubmit={submit} className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search products, sellers, categories..."
        className="h-10 w-full rounded-xl border border-input bg-secondary/60 pl-10 pr-4 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/25"
      />
    </form>
  );
}

export default SearchBar;
