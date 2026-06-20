import { useState } from "react";
import { Link, Navigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { apiError } from "@/lib/format";
import { UNSPLASH } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthAside from "@/components/layout/AuthAside";

const Login = () => {
  const [formData, handleChange, handleSubmit] = useForm({ email: "", password: "" });
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const googleOAuth = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(apiError(err, "Invalid email or password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <AuthAside
        image={UNSPLASH.heroSecondary}
        title="Welcome back to DevMarket"
        text="Pick up where you left off — your cart, wishlist and conversations are waiting."
      />

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-4">
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
                  placeholder="••••••••"
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
              <LogIn /> {loading ? "Signing in..." : "Sign in"}
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
    </div>
  );
};

export default Login;
