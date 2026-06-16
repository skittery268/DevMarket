import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router";
import { motion } from "framer-motion";

import { useProduct } from "@/hooks/useProduct";
import { PAGE_SIZE } from "@/lib/constants";
import { categoryImage } from "@/lib/format";

import Container from "@/components/common/Container";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/common/Pagination";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { Button } from "@/components/ui/button";

function CategoryProducts() {
  const { id } = useParams();
  const location = useLocation();
  const { loadProductsByCategory } = useProduct();

  const [category] = useState(location.state?.category || null);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    (async () => {
      setLoading(true);
      try {
        const res = await loadProductsByCategory(id, { page, limit: PAGE_SIZE });
        setProducts(res?.products || []);
        setCount(res?.productCount || 0);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

  return (
    <Container className="py-10">
      {/* Category banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-10 overflow-hidden rounded-3xl border border-border/70"
      >
        <ImageWithFallback
          src={categoryImage(category)}
          alt={category?.name || "Category"}
          className="h-48 w-full sm:h-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/85 to-foreground/20" />
        <div className="absolute bottom-0 left-0 space-y-2 p-6 text-background sm:p-8">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {category?.name || "Category"}
          </h1>
          {category?.description && (
            <p className="max-w-2xl text-sm text-background/85">{category.description}</p>
          )}
        </div>
      </motion.div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        {!loading && <p className="text-sm text-muted-foreground">{count} items</p>}
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        skeletonCount={PAGE_SIZE}
        emptyTitle="No products in this category"
        emptyDescription="Check back soon — sellers are adding new items all the time."
        emptyAction={
          <Button variant="brand" asChild>
            <Link to="/products">Browse all products</Link>
          </Button>
        }
      />

      <Pagination
        className="mt-12"
        page={page}
        total={count}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </Container>
  );
}

export default CategoryProducts;
