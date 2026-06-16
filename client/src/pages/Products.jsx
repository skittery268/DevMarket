import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useProduct } from "@/hooks/useProduct";
import { PAGE_SIZE } from "@/lib/constants";

import Container from "@/components/common/Container";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/common/Pagination";

function Products() {
  const { loadProducts, productCount } = useProduct();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    (async () => {
      setLoading(true);
      try {
        const list = await loadProducts({ page, limit: PAGE_SIZE });
        setProducts(list || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Container className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-2"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Catalog
        </span>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-bold sm:text-4xl">All products</h1>
          {!loading && (
            <p className="text-sm text-muted-foreground">
              {productCount} {productCount === 1 ? "item" : "items"}
            </p>
          )}
        </div>
      </motion.div>

      <ProductGrid products={products} loading={loading} skeletonCount={PAGE_SIZE} />

      <Pagination
        className="mt-12"
        page={page}
        total={productCount}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </Container>
  );
}

export default Products;
