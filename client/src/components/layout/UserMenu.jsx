import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  ShieldCheck,
  Store,
  User as UserIcon,
  Heart,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { avatarUrl, initials, apiError } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Avatar + dropdown shown when a user is authenticated.
function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Signed out");
    } catch (err) {
      console.error(apiError(err, "Could not sign out"));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
        <Avatar className="size-9 ring-2 ring-transparent transition hover:ring-primary/40">
          <AvatarImage src={avatarUrl(user)} alt={user?.fullname} />
          <AvatarFallback>{initials(user?.fullname)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="flex flex-col gap-1 py-2 text-foreground">
          <span className="truncate text-sm font-semibold">{user?.fullname}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
          <Badge variant="accent" className="mt-1 w-fit">
            {ROLE_LABELS[user?.role] || "Buyer"}
          </Badge>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <UserIcon /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/wishlist")}>
          <Heart /> Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/chats")}>
          <MessageSquare /> Messages
        </DropdownMenuItem>

        {user?.role === "seller" && (
          <DropdownMenuItem onClick={() => navigate("/seller/products")}>
            <Store /> My products
          </DropdownMenuItem>
        )}

        {user?.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/admin/users")}>
              <ShieldCheck /> Users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/categories")}>
              <LayoutDashboard /> Categories
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/products")}>
              <Package /> Products
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
