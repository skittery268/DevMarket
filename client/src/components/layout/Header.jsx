import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Heart, Menu, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
];

function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5">
      <img src="/favicon.svg" alt="DevMarket" className="size-8" />
      <span className="font-display text-lg font-extrabold tracking-tight">
        Dev<span className="text-brand-gradient">Market</span>
      </span>
    </Link>
  );
}

function CountBadge({ count }) {
  if (!count) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute -right-1 -top-1 flex min-w-4.5 items-center justify-center rounded-full bg-brand-gradient px-1 text-[10px] font-bold leading-4 text-white shadow"
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
}

function Header() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    cn(
      "relative text-sm font-medium transition-colors hover:text-foreground",
      isActive ? "text-foreground" : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 2xl:max-w-350">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle asChild>
                <Logo onClick={() => setMobileOpen(false)} />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-6">
              <SearchBar className="mb-4" onSubmitted={() => setMobileOpen(false)} />
              {NAV.map((item) => (
                <SheetClose asChild key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </SheetClose>
              ))}
              {!user && (
                <div className="mt-4 flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button variant="outline" asChild>
                      <Link to="/login">Sign in</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="brand" asChild>
                      <Link to="/register">Create account</Link>
                    </Button>
                  </SheetClose>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Logo />

        {/* Desktop nav */}
        <nav className="ml-2 hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Search (desktop) */}
        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
            <Link to="/wishlist" className="relative">
              <Heart />
              <CountBadge count={wishlistItems.length} />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild aria-label="Cart">
            <Link to="/cart" className="relative">
              <ShoppingCart />
              <CountBadge count={itemCount} />
            </Link>
          </Button>

          {user ? (
            <div className="ml-1">
              <UserMenu />
            </div>
          ) : (
            <div className="ml-1 hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button variant="brand" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
