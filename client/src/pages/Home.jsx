import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Store, Zap } from "lucide-react";

import { useProduct } from "@/hooks/useProduct";
import { useCategory } from "@/hooks/useCategory";
import { UNSPLASH } from "@/lib/constants";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryCard from "@/components/category/CategoryCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STATS = [
  { value: "12k+", label: "Products" },
  { value: "3.5k+", label: "Sellers" },
  { value: "99.9%", label: "Uptime" },
];

const PERKS = [
  { icon: Zap, title: "Instant delivery", text: "Digital goods delivered the moment you pay." },
  { icon: ShieldCheck, title: "Secure checkout", text: "Stripe-powered payments with buyer protection." },
  { icon: Sparkles, title: "Real-time chat", text: "Talk to sellers live before you buy." },
];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-mesh">
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <Sparkles className="size-3.5" /> The marketplace built for developers
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Buy & sell <span className="text-brand-gradient">digital products</span> with confidence
          </h1>
          <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
            Discover code, templates, assets and tools from a global community of
            makers. Real-time chat, secure payments and instant access.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" variant="brand" asChild>
              <Link to="/products">
                Browse products <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">
                <Store /> Start selling
              </Link>
            </Button>
          </div>
          <div className="flex gap-8 pt-2">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl border border-border/70 shadow-glow">
            <img src={UNSPLASH.heroProduct} alt="Marketplace" className="aspect-4/3 w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border/70 bg-card/90 p-4 shadow-card backdrop-blur sm:block">
            <p className="text-xs text-muted-foreground">Trusted by</p>
            <p className="font-display text-lg font-bold">3,500+ sellers</p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function Home() {
  const { loadProducts } = useProduct();
  const { loadCategories } = useCategory();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await loadProducts({ page: 1, limit: 8 });
        setProducts(list || []);
      } catch {
        /* surfaced via console; keep page usable */
      } finally {
        setLoadingProducts(false);
      }
    })();

    (async () => {
      try {
        const list = await loadCategories({ page: 1, limit: 6 });
        setCategories((list || []).slice(0, 6));
      } catch {
        /* ignore */
      } finally {
        setLoadingCategories(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pb-4">
      <Hero />

      {/* Perks */}
      <Container className="py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {PERKS.map((p) => (
            <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-card">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <p.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Categories */}
      <Container className="py-8">
        <SectionHeading
          eyebrow="Explore"
          title="Popular categories"
          description="Jump straight into the type of product you're after."
          action={
            <Button variant="ghost" asChild>
              <Link to="/categories">View all <ArrowRight /></Link>
            </Button>
          }
        />
        {loadingCategories ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : (
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
        )}
      </Container>

      {/* Featured products */}
      <Container className="py-12">
        <SectionHeading
          eyebrow="Fresh drops"
          title="Featured products"
          description="The newest additions from our community of sellers."
          action={
            <Button variant="ghost" asChild>
              <Link to="/products">Shop all <ArrowRight /></Link>
            </Button>
          }
        />
        <ProductGrid products={products} loading={loadingProducts} skeletonCount={8} />
      </Container>

      {/* Seller CTA */}
      <Container className="py-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white sm:p-12">
          <div className="relative z-10 max-w-xl space-y-4">
            <h2 className="font-display text-3xl font-bold">Turn your skills into income</h2>
            <p className="text-white/85">
              List your digital products, reach thousands of buyers and get paid
              securely. Setting up your store takes minutes.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Become a seller <ArrowRight /></Link>
            </Button>
          </div>
          <img
            src={UNSPLASH.sellerCta}
            alt=""
            className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 object-cover opacity-25 lg:block"
          />
        </div>
      </Container>
    </div>
  );
}

export default Home;
