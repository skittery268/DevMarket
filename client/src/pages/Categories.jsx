import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

import { useCategory } from "@/hooks/useCategory";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import CategoryCard from "@/components/category/CategoryCard";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

function Categories() {
  const { loadCategories } = useCategory();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await loadCategories({ page: 1, limit: 100 });
        setCategories(list || []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Browse"
        title="All categories"
        description="Find exactly the kind of digital product you're looking for."
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : categories.length ? (
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
        <EmptyState
          icon={FolderOpen}
          title="No categories yet"
          description="Categories will appear here once an admin creates them."
        />
      )}
    </Container>
  );
}

export default Categories;
