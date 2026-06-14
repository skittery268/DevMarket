import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus, LayoutGrid, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useCategory } from "@/hooks/useCategory";
import { categoryImage, apiError } from "@/lib/format";

import Container from "@/components/common/Container";
import AdminNav from "@/components/layout/AdminNav";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import CategoryFormDialog from "@/components/category/CategoryFormDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function AdminCategories() {
  const { categories, loadCategories, createCategory, editCategory, deleteCategory } = useCategory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await loadCategories({ page: 1, limit: 100 });
      } catch (err) {
        toast.error(apiError(err, "Could not load categories"));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
    } catch (err) {
      toast.error(apiError(err, "Could not delete category"));
    }
  };

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Categories</h1>
          <p className="mt-1 text-muted-foreground">Create and manage marketplace categories.</p>
        </div>
        <CategoryFormDialog
          categories={categories}
          onSubmit={(fd) => createCategory(fd)}
          trigger={
            <Button variant="brand">
              <Plus /> New category
            </Button>
          }
        />
      </div>

      <div className="mt-6">
        <AdminNav />
      </div>

      {loading ? (
        <Loader full label="Loading categories..." />
      ) : categories.length ? (
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          initial="hidden"
          animate="show"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((c) => (
            <motion.div key={c._id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <Card className="overflow-hidden py-0">
                <div className="relative h-36">
                  <ImageWithFallback src={categoryImage(c)} alt={c.name} className="size-full" />
                  {!c.isActive && (
                    <Badge variant="destructive" className="absolute left-3 top-3">Inactive</Badge>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                  </div>
                  {c.allowedAttributes?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {c.allowedAttributes.slice(0, 4).map((a) => (
                        <Badge key={a} variant="secondary">{a}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <CategoryFormDialog
                      category={c}
                      categories={categories}
                      onSubmit={(fd) => editCategory(c._id, fd)}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1">
                          <Pencil /> Edit
                        </Button>
                      }
                    />
                    <ConfirmDialog
                      title="Delete category?"
                      description={`"${c.name}" will be permanently removed.`}
                      confirmText="Delete"
                      onConfirm={() => handleDelete(c._id)}
                      trigger={
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                          <Trash2 />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={LayoutGrid}
          title="No categories yet"
          description="Create your first category to start organizing products."
          action={
            <CategoryFormDialog
              categories={categories}
              onSubmit={(fd) => createCategory(fd)}
              trigger={<Button variant="brand"><FolderPlus /> New category</Button>}
            />
          }
        />
      )}
    </Container>
  );
}

export default AdminCategories;
