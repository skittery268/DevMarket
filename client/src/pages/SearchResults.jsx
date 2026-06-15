import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

import { useSearch } from "@/hooks/useSearch";
import { avatarUrl, initials } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/constants";

import Container from "@/components/common/Container";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryCard from "@/components/category/CategoryCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function UserResult({ user }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
      className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-card"
    >
      <Avatar className="size-12">
        <AvatarImage src={avatarUrl(user)} alt={user.fullname} />
        <AvatarFallback>{initials(user.fullname)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold">{user.fullname}</p>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
      </div>
      <Badge variant="accent" className="ml-auto">
        {ROLE_LABELS[user.role] || "Buyer"}
      </Badge>
    </motion.div>
  );
}

function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const { results, searchUsers, searchProducts, searchCategories } = useSearch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;
    (async () => {
      setLoading(true);
      await Promise.allSettled([searchUsers(q), searchProducts(q), searchCategories(q)]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const { users = [], products = [], categories = [] } = results || {};

  if (!q) {
    return (
      <Container className="py-16">
        <EmptyState icon={SearchX} title="Start searching" description="Type a query in the search bar above." />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Search</span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Results for “<span className="text-brand-gradient">{q}</span>”
        </h1>
      </div>

      {loading ? (
        <Loader full label="Searching..." />
      ) : (
        <Tabs defaultValue="products">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="pt-6">
            <ProductGrid
              products={products}
              emptyTitle="No matching products"
              emptyDescription="We couldn't find products matching your query."
            />
          </TabsContent>

          <TabsContent value="categories" className="pt-6">
            {categories.length ? (
              <motion.div
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                initial="hidden"
                animate="show"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {categories.map((c) => (
                  <CategoryCard key={c._id} category={c} />
                ))}
              </motion.div>
            ) : (
              <EmptyState icon={SearchX} title="No matching categories" />
            )}
          </TabsContent>

          <TabsContent value="users" className="pt-6">
            {users.length ? (
              <motion.div
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="show"
                className="grid gap-4 sm:grid-cols-2"
              >
                {users.map((u) => (
                  <UserResult key={u._id} user={u} />
                ))}
              </motion.div>
            ) : (
              <EmptyState icon={SearchX} title="No matching sellers" />
            )}
          </TabsContent>
        </Tabs>
      )}
    </Container>
  );
}

export default SearchResults;
