import { Link } from "react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";

const POINTS = [
  { icon: Zap, text: "Instant access to your purchases" },
  { icon: ShieldCheck, text: "Secure, Stripe-powered checkout" },
  { icon: Sparkles, text: "Chat with sellers in real time" },
];

// Decorative brand panel shown next to the auth forms on large screens.
function AuthAside({ image, title, text }) {
  return (
    <div className="relative hidden overflow-hidden bg-brand-gradient h-full lg:block">
      {image && (
        <img src={image} alt="" className="absolute inset-0 size-full object-cover opacity-20" />
      )}
      <div className="absolute inset-0 bg-brand-gradient opacity-80" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex h-full flex-col justify-between p-12 text-white"
      >
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="DevMarket" className="size-9 rounded-lg bg-white/15 p-1" />
          <span className="font-display text-xl font-extrabold tracking-tight">DevMarket</span>
        </Link>

        <div className="space-y-6">
          <h2 className="font-display text-4xl font-bold leading-tight">{title}</h2>
          <p className="max-w-md text-white/85">{text}</p>
          <ul className="space-y-3 pt-2">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
                  <p.icon className="size-4.5" />
                </span>
                <span className="text-sm text-white/90">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/70">© {new Date().getFullYear()} DevMarket</p>
      </motion.div>
    </div>
  );
}

export default AuthAside;
