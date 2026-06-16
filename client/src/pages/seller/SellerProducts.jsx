import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ExternalLink, Package, Pencil, Plus, Store, Trash2 } from "lucide-react";

import { useProduct } from "@/hooks/useProduct";
import { useCategory } from "@/hooks/useCategory";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, productImage, apiError } from "@/lib/format";

import Container from "@/components/common/Container";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import ProductFormDialog from "@/components/product/ProductFormDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function SellerProducts() {
  const { products, loadProducts, createProduct, editProduct, deleteProduct } = useProduct();
  const { categories, loadCategories } = useCategory();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // No "my products" endpoint exists, so we pull a wide page and filter.
        await Promise.all([
          loadProducts({ page: 1, limit: 200 }),
          loadCategories({ page: 1, limit: 100 }),
        ]);
      } catch (err) {
        console.error(apiError(err, "Could not load your products"));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myProducts = useMemo(
    () =>
      products.filter((p) => {
        const sid = p.universal?.sellerId?._id || p.universal?.sellerId;
        return sid === user?._id;
      }),
    [products, user]
  );

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      console.log("Product deleted");
    } catch (err) {
      console.error(apiError(err, "Could not delete product"));
    }
  };

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
            <Store className="size-5" />
          </span>
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">My products</h1>
            <p className="mt-1 text-muted-foreground">Create, edit and manage your listings.</p>
          </div>
        </div>
        <ProductFormDialog
          categories={categories}
          onSubmit={(fd, categoryId) => createProduct(categoryId, fd)}
          trigger={
            <Button variant="brand">
              <Plus /> New product
            </Button>
          }
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader full label="Loading your products..." />
        ) : myProducts.length ? (
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.04 } } }}
            initial="hidden"
            animate="show"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          >
            {myProducts.map((p) => {
              const u = p.universal || {};
              return (
                <motion.div key={p._id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                  <Card className="overflow-hidden py-0">
                    <div className="relative aspect-4/3">
                      <ImageWithFallback src={productImage(p)} alt={u.title} className="size-full" />
                      <Badge
                        variant={u.stock > 0 ? "success" : "destructive"}
                        className="absolute left-3 top-3 backdrop-blur"
                      >
                        {u.stock > 0 ? `${u.stock} in stock` : "Out of stock"}
                      </Badge>
                    </div>
                    <CardContent className="space-y-2 py-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 font-semibold">{u.title}</h3>
                        <span className="shrink-0 font-display font-bold">{formatPrice(u.price)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{u.category?.name}</p>
                      <div className="flex gap-2 pt-2">
                        <ProductFormDialog
                          product={p}
                          categories={categories}
                          onSubmit={(fd) => editProduct(p._id, fd)}
                          trigger={
                            <Button variant="outline" size="sm" className="flex-1">
                              <Pencil /> Edit
                            </Button>
                          }
                        />
                        <Button variant="ghost" size="icon-sm" asChild aria-label="View">
                          <Link to={`/products/${p._id}`} state={{ product: p }}>
                            <ExternalLink className="size-4" />
                          </Link>
                        </Button>
                        <ConfirmDialog
                          title="Delete product?"
                          description={`"${u.title}" will be permanently removed.`}
                          confirmText="Delete"
                          onConfirm={() => handleDelete(p._id)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Delete"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <EmptyState
            icon={Package}
            title="You haven't listed any products"
            description="Create your first listing to start selling on DevMarket."
            action={
              <ProductFormDialog
                categories={categories}
                onSubmit={(fd, categoryId) => createProduct(categoryId, fd)}
                trigger={<Button variant="brand"><Plus /> New product</Button>}
              />
            }
          />
        )}
      </div>
    </Container>
  );
}

export default SellerProducts;
