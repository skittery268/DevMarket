import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { apiError } from "@/lib/format";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ImageWithFallback from "@/components/common/ImageWithFallback";

const MAX_IMAGES = 5;

// Create / edit a product. In create mode the seller picks a category (which
// drives the allowed attributes). `onSubmit(formData, categoryId)` does the call.
function ProductFormDialog({ trigger, product, categories = [], onSubmit }) {
  const isEdit = Boolean(product);
  const [open, setOpen] = useState(false);

  const u = product?.universal || {};
  const [categoryId, setCategoryId] = useState(u.category?._id || "");
  const [title, setTitle] = useState(u.title || "");
  const [description, setDescription] = useState(u.description || "");
  const [price, setPrice] = useState(u.price ?? "");
  const [stock, setStock] = useState(u.stock ?? "");
  const [attributes, setAttributes] = useState(product?.attributes || {});
  const [images, setImages] = useState([]); // [{ file, url }]
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  // Active categories drive create-mode selection
  const activeCategories = categories.filter((c) => c.isActive !== false);
  const selectedCategory = isEdit
    ? u.category
    : categories.find((c) => c._id === categoryId);
  const allowedAttributes = selectedCategory?.allowedAttributes || [];

  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []);
    const next = files.slice(0, MAX_IMAGES - images.length).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const submit = async (e) => {
    e.preventDefault();

    if (!isEdit && !categoryId) {
      toast.error("Please choose a category");
      return;
    }

    const fd = new FormData();
    if (title) fd.append("title", title);
    if (description) fd.append("description", description);
    if (price !== "") fd.append("price", String(price));
    if (stock !== "") fd.append("stock", String(stock));

    // Only send filled attributes whose keys are allowed by the category
    const cleaned = {};
    allowedAttributes.forEach((key) => {
      const val = attributes[key];
      if (val !== undefined && String(val).trim() !== "") cleaned[key] = String(val);
    });
    if (Object.keys(cleaned).length) fd.append("attributes", JSON.stringify(cleaned));

    images.forEach((img) => fd.append("images", img.file));

    setLoading(true);
    try {
      await onSubmit(fd, categoryId);
      toast.success(isEdit ? "Product updated" : "Product created");
      setOpen(false);
    } catch (err) {
      toast.error(apiError(err, "Could not save product"));
    } finally {
      setLoading(false);
    }
  };

  // Existing images preview (edit mode, before replacement)
  const existingImages = isEdit ? u.images || [] : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your product details. Uploading new images replaces the existing ones."
              : "List a new product for sale."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {!isEdit && (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {activeCategories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="p-title">Title</Label>
            <Input id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} required minLength={5} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea
              id="p-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="p-price">Price ($)</Label>
              <Input
                id="p-price"
                type="number"
                min="1"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-stock">Stock</Label>
              <Input
                id="p-stock"
                type="number"
                min="1"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          {allowedAttributes.length > 0 && (
            <div className="space-y-2">
              <Label>Attributes</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {allowedAttributes.map((key) => (
                  <div key={key} className="space-y-1.5">
                    <span className="text-xs font-medium capitalize text-muted-foreground">{key}</span>
                    <Input
                      value={attributes[key] || ""}
                      onChange={(e) => setAttributes((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={key}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          <div className="space-y-2">
            <Label>Images (up to {MAX_IMAGES})</Label>
            {existingImages.length > 0 && images.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img, i) => (
                  <ImageWithFallback
                    key={i}
                    src={img.url}
                    alt=""
                    className="size-16 rounded-lg border border-border/60 opacity-70"
                  />
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <ImageWithFallback src={img.url} alt="" className="size-16 rounded-lg border border-border/60" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex size-16 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50"
                >
                  <ImagePlus className="size-5" />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onPickImages} />
          </div>

          <DialogFooter>
            <Button type="submit" variant="brand" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save changes" : "Create product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductFormDialog;
