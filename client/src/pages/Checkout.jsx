import { useState } from "react";
import { Link, Navigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Lock, ShieldCheck, Truck } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { formatPrice, productImage, apiError } from "@/lib/format";

import Container from "@/components/common/Container";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Delivery fields required by the backend Payment.userInfo schema.
const DELIVERY_FIELDS = [
  { name: "fullname", label: "Full name", placeholder: "Jane Doe" },
  { name: "email", label: "Email", placeholder: "jane@example.com", type: "email" },
  { name: "phone", label: "Phone", placeholder: "+1 555 010 1234" },
  { name: "country", label: "Country", placeholder: "United States" },
  { name: "city", label: "City", placeholder: "San Francisco" },
  { name: "zipcode", label: "Zip code", placeholder: "94016" },
  { name: "address", label: "Address", placeholder: "1 Market Street, Apt 4", full: true },
];

// Client-side validation mirroring what the backend requires. zipcode must be
// numeric because Payment.userInfo.zipcode is stored as a Number.
const validate = (data) => {
  const errors = {};

  DELIVERY_FIELDS.forEach(({ name }) => {
    if (!String(data[name] ?? "").trim()) {
      errors[name] = "This field is required";
    }
  });

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (data.zipcode && !/^\d+$/.test(data.zipcode.trim())) {
    errors.zipcode = "Zip code must contain digits only";
  }

  return errors;
};

function Checkout() {
  const { items, totalPrice, itemCount, toUserOrder } = useCart();
  const { createCheckoutSession } = usePayment();
  const { user } = useAuth();

  // Prefill the fields we already know about the signed-in user.
  const [formData, handleChange] = useForm({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: "",
    country: "",
    city: "",
    zipcode: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!items.length) return <Navigate to="/cart" replace />;

  const handlePay = async (e) => {
    e.preventDefault();

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const userInfo = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      country: formData.country.trim(),
      city: formData.city.trim(),
      zipcode: formData.zipcode.trim(),
      address: formData.address.trim(),
    };

    setLoading(true);
    try {
      // On success this redirects the browser to the Stripe hosted checkout.
      await createCheckoutSession(toUserOrder(), userInfo);
    } catch (err) {
      toast.error(apiError(err, "Checkout could not be started"));
      setLoading(false);
    }
  };

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">Checkout</h1>

      <form onSubmit={handlePay} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {/* Delivery information */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="space-y-5 pt-2">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Truck className="size-5 text-primary" /> Delivery information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {DELIVERY_FIELDS.map(({ name, label, placeholder, type, full }) => (
                    <div key={name} className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
                      <Label htmlFor={name}>{label}</Label>
                      <Input
                        id={name}
                        name={name}
                        type={type || "text"}
                        placeholder={placeholder}
                        value={formData[name]}
                        onChange={handleChange}
                        aria-invalid={!!errors[name]}
                      />
                      {errors[name] && (
                        <p className="text-xs text-destructive">{errors[name]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order review */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardContent className="space-y-1 pt-2">
                <h2 className="mb-3 font-display text-lg font-semibold">
                  Order review ({itemCount} {itemCount === 1 ? "item" : "items"})
                </h2>
                <div className="divide-y divide-border/70">
                  {items.map((item) => {
                    const u = item.product.universal || {};
                    return (
                      <div key={item.product._id} className="flex items-center gap-4 py-3">
                        <ImageWithFallback
                          src={productImage(item.product)}
                          alt={u.title}
                          className="size-16 rounded-xl border border-border/60"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 font-medium">{u.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(u.price)} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold">
                          {formatPrice((u.price || 0) * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Payment summary */}
        <div className="h-fit lg:sticky lg:top-20">
          <Card>
            <CardContent className="space-y-4 pt-2">
              <h2 className="font-display text-lg font-semibold">Payment</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total due</span>
                <span className="text-brand-gradient font-display text-xl">{formatPrice(totalPrice)}</span>
              </div>

              <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
                <Lock /> {loading ? "Redirecting to Stripe..." : "Pay securely"}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Secured by Stripe
              </p>
              <Button type="button" variant="ghost" className="w-full" asChild>
                <Link to="/cart">Back to cart</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </Container>
  );
}

export default Checkout;
