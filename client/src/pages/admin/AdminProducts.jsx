import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ExternalLink, PackageSearch, Trash2 } from "lucide-react";

import { useProduct } from "@/hooks/useProduct";
import { PAGE_SIZE } from "@/lib/constants";
import { formatPrice, productImage, apiError } from "@/lib/format";

import Container from "@/components/common/Container";
import AdminNav from "@/components/layout/AdminNav";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function AdminProducts() {
  const { products, productCount, loadProducts, deleteProduct } = useProduct();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    (async () => {
      setLoading(true);
      try {
        await loadProducts({ page, limit: PAGE_SIZE });
      } catch (err) {
        console.error(apiError(err, "Could not load products"));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
    } catch (err) {
      toast.error(apiError(err, "Could not delete product"));
    }
  };

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Products</h1>
      <p className="mb-6 mt-1 text-muted-foreground">Moderate every product on the marketplace.</p>
      <AdminNav />

      {loading ? (
        <Loader full label="Loading products..." />
      ) : products.length ? (
        <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => {
                    const u = p.universal || {};
                    return (
                      <TableRow key={p._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              src={productImage(p)}
                              alt={u.title}
                              className="size-11 rounded-lg border border-border/60"
                            />
                            <span className="line-clamp-1 max-w-50 font-medium">{u.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.category?.name || "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.sellerId?.fullname || "—"}
                        </TableCell>
                        <TableCell className="font-medium">{formatPrice(u.price)}</TableCell>
                        <TableCell>
                          {u.stock > 0 ? (
                            <Badge variant="secondary">{u.stock}</Badge>
                          ) : (
                            <Badge variant="destructive">0</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </motion.div>

          <Pagination className="mt-10" page={page} total={productCount} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      ) : (
        <EmptyState icon={PackageSearch} title="No products yet" description="Products created by sellers will appear here." />
      )}
    </Container>
  );
}

export default AdminProducts;
