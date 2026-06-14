import { Link } from "react-router";
import { Code2, Globe, Mail } from "lucide-react";

const COLUMNS = [
  {
    title: "Marketplace",
    links: [
      { to: "/products", label: "All products" },
      { to: "/categories", label: "Categories" },
      { to: "/wishlist", label: "Wishlist" },
      { to: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/profile", label: "Profile" },
      { to: "/chats", label: "Messages" },
      { to: "/login", label: "Sign in" },
      { to: "/register", label: "Create account" },
    ],
  },
];

function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] 2xl:max-w-350">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="DevMarket" className="size-8" />
            <span className="font-display text-lg font-extrabold tracking-tight">
              Dev<span className="text-brand-gradient">Market</span>
            </span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            The modern marketplace where developers buy and sell digital products —
            with real-time chat and secure checkout.
          </p>
          <div className="flex items-center gap-2">
            {[Code2, Globe, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="social link"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-semibold">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 2xl:max-w-350">
          <p>© {new Date().getFullYear()} DevMarket. All rights reserved.</p>
          <p>Built for developers, by developers.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
