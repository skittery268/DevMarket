import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Camera, Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useForm } from "@/hooks/useForm";
import { avatarUrl, initials, apiError } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/constants";

import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function Profile() {
  const { user, refreshMe } = useAuth();
  const { editUser } = useUser();

  const [formData, handleChange] = useForm({
    fullname: user?.fullname || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(avatarUrl(user));
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    if (avatarFile) data.append("image", avatarFile);
    if (formData.fullname && formData.fullname !== user.fullname) data.append("fullname", formData.fullname);
    if (formData.email && formData.email !== user.email) data.append("email", formData.email);
    if (formData.newPassword) {
      data.append("currentPassword", formData.currentPassword);
      data.append("newPassword", formData.newPassword);
    }

    try {
      await editUser(user._id, data);
      await refreshMe();
      toast.success("Profile updated");
      setAvatarFile(null);
    } catch (err) {
      toast.error(apiError(err, "Could not update profile"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* Summary card */}
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center gap-4 pt-2 text-center">
            <div className="relative">
              <Avatar className="size-28 ring-4 ring-primary/15">
                <AvatarImage src={preview} alt={user?.fullname} />
                <AvatarFallback className="text-2xl">{initials(user?.fullname)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow"
                aria-label="Change avatar"
              >
                <Camera className="size-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickAvatar} />
            </div>

            <div className="space-y-1">
              <h2 className="font-display text-xl font-bold">{user?.fullname}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="accent">{ROLE_LABELS[user?.role] || "Buyer"}</Badge>
              {user?.isVerified ? (
                <Badge variant="success"><BadgeCheck className="size-3" /> Verified</Badge>
              ) : (
                <Badge variant="outline"><ShieldAlert className="size-3" /> Unverified</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit profile</CardTitle>
            <CardDescription>
              Update your details. Changing your email will require re-verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full name</Label>
                  <Input id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <Separator />
              <div>
                <h3 className="text-sm font-semibold">Change password</h3>
                <p className="text-xs text-muted-foreground">Leave blank to keep your current password.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    placeholder="At least 8 characters"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="brand" disabled={loading}>
                  <Save /> {loading ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}

export default Profile;
