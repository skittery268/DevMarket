import { useState } from "react";
import { Link, Navigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { apiError } from "@/lib/format";
import { UNSPLASH } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthAside from "@/components/layout/AuthAside";

const Register = () => {
  const [formData, handleChange, handleSubmit] = useForm({
    fullname: "",
    email: "",
    password: "",
  });
  const { register, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const googleOAuth = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await register(data);
      toast.success("Account created! Please sign in to continue.");
    } catch (err) {
      toast.error(apiError(err, "Could not create your account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="order-2 flex items-center justify-center px-4 py-12 sm:px-8 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Already a member?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full name</Label>
              <Input
                id="fullname"
                type="text"
                name="fullname"
                placeholder="Ada Lovelace"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
              <UserPlus /> {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" size="lg" className="w-full" onClick={googleOAuth}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="size-4" />
            Continue with Google
          </Button>
        </motion.div>
      </div>

      <div className="order-1 lg:order-2">
        <AuthAside
          image={UNSPLASH.bannerCode}
          title="Join the developer marketplace"
          text="Create an account to buy, sell and chat with a global community of makers."
        />
      </div>
    </div>
  );
};

export default Register;
