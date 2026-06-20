import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { ImagePlus, Plus, X } from "lucide-react";

import { categoryImage, apiError } from "@/lib/format";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ImageWithFallback from "@/components/common/ImageWithFallback";

// Create / edit a category. `category` (optional) switches the dialog to edit mode.
// `onSubmit(formData)` receives a ready-to-send FormData and should return a promise.
function CategoryFormDialog({ trigger, category, categories = [], onSubmit }) {
  const isEdit = Boolean(category);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [attrs, setAttrs] = useState(category?.allowedAttributes || []);
  const [attrInput, setAttrInput] = useState("");
  const [parent, setParent] = useState(category?.parentCategory?._id || category?.parentCategory || "none");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(isEdit ? categoryImage(category) : "");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const addAttr = () => {
    const v = attrInput.trim();
    if (v && !attrs.includes(v)) setAttrs((a) => [...a, v]);
    setAttrInput("");
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (attrs.length === 0) {
      toast.error("Add at least one allowed attribute");
      return;
    }
    if (!isEdit && !imageFile) {
      toast.error("An image is required");
      return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("allowedAttributes", JSON.stringify(attrs));
    if (parent && parent !== "none") fd.append("parentCategory", parent);
    if (imageFile) fd.append("image", imageFile);

    setLoading(true);
    try {
      await onSubmit(fd);
      toast.success(isEdit ? "Category updated" : "Category created");
      setOpen(false);
    } catch (err) {
      toast.error(apiError(err, "Could not save category"));
    } finally {
      setLoading(false);
    }
  };

  const parentOptions = categories.filter((c) => c._id !== category?._id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this category's details." : "Add a new category to the marketplace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {/* Image */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/40 text-muted-foreground transition-colors hover:border-primary/50"
            >
              {preview ? (
                <ImageWithFallback src={preview} alt="" className="size-full" />
              ) : (
                <ImagePlus className="size-6" />
              )}
            </button>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Category image</p>
              <p>{isEdit ? "Upload to replace the current image." : "Required. PNG or JPG."}</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickImage} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-name">Name</Label>
            <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={5} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Allowed attributes</Label>
            <div className="flex gap-2">
              <Input
                value={attrInput}
                onChange={(e) => setAttrInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAttr();
                  }
                }}
                placeholder="e.g. language, license"
              />
              <Button type="button" variant="outline" size="icon" onClick={addAttr}>
                <Plus />
              </Button>
            </div>
            {attrs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {attrs.map((a) => (
                  <Badge key={a} variant="secondary" className="gap-1">
                    {a}
                    <button type="button" onClick={() => setAttrs((prev) => prev.filter((x) => x !== a))}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {parentOptions.length > 0 && (
            <div className="space-y-2">
              <Label>Parent category (optional)</Label>
              <Select value={parent} onValueChange={setParent}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {parentOptions.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" variant="brand" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryFormDialog;
