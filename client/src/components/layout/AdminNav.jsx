import { NavLink } from "react-router";
import { Package, ShieldCheck, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/admin/users", label: "Users", icon: ShieldCheck },
  { to: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { to: "/admin/products", label: "Products", icon: Package },
];

// Sub-navigation shared across admin screens.
function AdminNav() {
  return (
    <div className="mb-8 inline-flex gap-1 rounded-xl border border-border/70 bg-card p-1 shadow-sm">
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-gradient text-white shadow-sm"
                : "text-muted-foreground hover:bg-secondary"
            )
          }
        >
          <l.icon className="size-4" />
          {l.label}
        </NavLink>
      ))}
    </div>
  );
}

export default AdminNav;
