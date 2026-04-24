import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Eye,
  Heart,
  Menu,
  Search,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/year",
    features: ["Up to 15 menu items", "Basic customization"],
    popular: false,
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "₹1499",
    period: "/year",
    features: [
      "Unlimited menu items",
      "Analytics dashboard",
      "Modern customization",
      "Priority support",
    ],
    popular: true,
    cta: "Start free trial",
  },
];

const features = [
  {
    title: "All menu updates in one place",
    copy: "Edit categories, pricing, and availability once and sync changes everywhere in real time.",
  },
  {
    title: "QR ordering without friction",
    copy: "Guests scan, browse, and order instantly with a clean flow designed for busy service hours.",
  },
  {
    title: "Brand styling that feels yours",
    copy: "Adjust fonts, colors, and media to match your restaurant atmosphere with no design tools needed.",
  },
  {
    title: "Insights that help daily decisions",
    copy: "Track popular dishes and menu performance so you can improve what guests actually order.",
  },
];

const experienceTiles = [
  {
    title: "Food & Drink",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Cafes",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Fine Dining",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Street Food",
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Bakeries",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Desserts",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Cloud Kitchens",
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Family Restaurants",
    image:
      "https://images.unsplash.com/photo-1515669097368-22e68427d265?auto=format&fit=crop&w=1200&q=80",
  },
];

const steps = [
  {
    title: "Set up your restaurant",
    copy: "Add your name, logo, and menu categories in a few guided steps.",
  },
  {
    title: "Start taking digital orders",
    copy: "Publish your QR menu and let guests browse and place orders right from their table.",
  },
  {
    title: "Grow with confidence",
    copy: "Use live performance data to improve conversion and repeat ordering.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Owner, Spice Garden",
    quote:
      "Menova helped us move from printed menus to a cleaner digital flow in under one day. Guests now order faster and our team spends less time clarifying items.",
  },
  {
    name: "Rahul Mehta",
    role: "Manager, Cafe Bliss",
    quote:
      "The menu builder is simple enough for our floor team, not just managers. Updates happen in minutes and we see the impact right away.",
  },
  {
    name: "Anita Desai",
    role: "Founder, Taj Kitchen",
    quote:
      "What stood out was how natural it feels for customers. The menu looks premium, the flow is fast, and we finally have useful engagement data.",
  },
];

const faqs = [
  {
    q: "How does the QR code menu work?",
    a: "You create your digital menu on Menova, generate a QR code, and print it. Customers scan the QR with their phone camera and your menu opens instantly — no app download needed.",
  },
  {
    q: "Can I customize the look of my menu?",
    a: "Absolutely. You can change colors, fonts, upload your logo, and make your digital menu match your restaurant's brand identity.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, our Free plan lets you create a menu with up to 15 items and 1 QR code — perfect for getting started. It is activate for you for first 15 days, then you have to take pro plan.",
  },
  {
    q: "Do I need technical skills to use Menova?",
    a: "Not at all. Menova is designed for restaurant owners. If you can use a smartphone, you can set up your menu."
  }
];

export default function Landing() {
  const [mobileNav, setMobileNav] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isLoggedIn = !!localStorage.getItem("menova_token");
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  const navItems = [
    { label: "Features", href: "#features", chevron: false },
    { label: "How it works", href: "#how-it-works", chevron: false },
    { label: "Pricing", href: "#pricing", chevron: false },
    { label: "FAQ", href: "#faq", chevron: false },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <div className="sticky top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
        <nav
          className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-5 md:gap-3"
          aria-label="Main"
        >
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2 shrink-0 pl-0.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background sm:h-9 sm:w-9">
              <UtensilsCrossed className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </div>
            <span className="font-body text-lg font-bold tracking-tight text-foreground lowercase sm:text-xl">
              menova
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-0.5 rounded-full px-2 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-slate-100/80 hover:text-foreground"
              >
                {item.label}
                {item.chevron ? (
                  <ChevronDown
                    className="h-3.5 w-3.5 opacity-60"
                    strokeWidth={2}
                  />
                ) : null}
              </a>
            ))}
          </div>

          <div className="hidden items-center justify-end gap-1 sm:gap-2 md:flex">

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-slate-100/80 hover:text-foreground"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/", { replace: true });
                  }}
                  className="rounded-full border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-slate-100/80 hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-[#F2E6A0] px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-[#E8DC8F]"
                >
                  Get a demo
                </Link>
              </>
            )}
          </div>

          <button
            className="rounded-full p-2 text-foreground md:hidden"
            onClick={() => setMobileNav((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileNav ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>

        {mobileNav && (
          <div className="mt-2 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur-md md:hidden">
            <div className="mb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/90 hover:bg-slate-50"
                  onClick={() => setMobileNav(false)}
                >
                  {item.label}
                  {item.chevron ? (
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  ) : null}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <Button variant="outline" className="w-full" asChild>
                <Link
                  to={isLoggedIn ? "/dashboard" : "/login"}
                  onClick={() => setMobileNav(false)}
                >
                  {isLoggedIn ? "Dashboard" : "Sign in"}
                </Link>
              </Button>
              <Button
                asChild
                className="w-full rounded-full border-0 bg-[#F2E6A0] text-foreground font-semibold hover:bg-[#E8DC8F]"
              >
                <Link
                  to={isLoggedIn ? "/dashboard" : "/register"}
                  onClick={() => setMobileNav(false)}
                >
                  {isLoggedIn ? "Open dashboard" : "Get a demo"}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <header className="border-b border-border/70">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              For restaurants, cafes, and food brands
            </p>
            <h1 className="mb-6 text-5xl font-semibold leading-tight sm:text-6xl">
              Finally, a better way to run your digital menu.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Build a menu that feels like your restaurant. Take QR orders
              faster, reduce admin work, and help guests enjoy a smoother dining
              experience.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                  {isLoggedIn ? "Go to dashboard" : "Try for free"}{" "}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/menu/demo">View live demo</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80"
              alt="Guests enjoying food in a warm restaurant setting"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </header>

      <section
        id="dashboard-preview"
        className="border-b border-border/70 py-10 sm:py-14"
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Product preview
          </p>
          <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">
            Your dashboard at a glance
          </h2>
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-lg sm:p-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-border/80 bg-background text-left">
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  menova.app/dashboard
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Live preview
                </button>
              </div>

              <div className="p-5">
                <h3 className="text-2xl font-semibold">
                  Morning, Spice Garden 👋
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your digital menu is currently live and performing well.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <article className="rounded-3xl border border-border bg-card p-5 md:col-span-2">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Total menu views
                    </p>
                    <div className="mt-1 flex items-end justify-between">
                      <p className="text-5xl font-semibold leading-none">
                        12,841
                      </p>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </article>

                  <article className="rounded-3xl border border-border bg-card p-5">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                      <UtensilsCrossed className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Live dishes
                    </p>
                    <p className="mt-1 text-4xl font-semibold leading-none">
                      84
                    </p>
                    <p className="mt-3 text-xs font-semibold text-primary">
                      Manage
                    </p>
                  </article>

                  <article className="rounded-3xl border border-border bg-card p-5">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Bestseller
                    </p>
                    <p className="mt-1 line-clamp-1 text-2xl font-semibold leading-tight">
                      Truffle Pizza
                    </p>
                    <p className="mt-3 text-xs font-semibold text-primary">
                      Insights
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-border/70 py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Built for daily operations
            </p>
            <h2 className="mb-4 text-4xl font-semibold">
              Less admin, more guest experience
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Menova keeps menu publishing, ordering, and tracking in one clean
              workflow so your team can focus on service.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.75rem] border border-border bg-card p-7"
              >
                <h3 className="mb-3 text-2xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-border/70 py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="mb-12 text-4xl font-semibold">
            Get started in three simple steps
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[1.75rem] border border-border bg-card p-7"
              >
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Step {index + 1}
                </p>
                <h3 className="mb-3 text-2xl font-semibold">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {step.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-border/70 py-20">
        <div className="mx-auto w-full max-w-6xl px-6 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Investment
          </p>
          <h2 className="mb-4 text-5xl font-semibold leading-tight sm:text-6xl">
            Simple pricing.
            <br />
            Rapid ROI.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Choose the plan that fits your operation. Scale as your business
            grows.
          </p>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-[2rem] border p-8 text-left shadow-md ${
                  plan.popular
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground">
                    Recommended choice
                  </span>
                )}

                <h3 className="mb-3 text-2xl font-semibold">{plan.name}</h3>
                <div className="mb-8 flex items-end gap-1.5">
                  <span className="text-5xl font-semibold leading-none">
                    {plan.price}
                  </span>
                  <span
                    className={
                      plan.popular
                        ? "text-background/70"
                        : "text-muted-foreground"
                    }
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="mb-8 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <Check className="h-4 w-4 text-primary" />
                      <span
                        className={
                          plan.popular
                            ? "text-background/90"
                            : "text-muted-foreground"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={plan.popular ? "secondary" : "outline"}
                  className={
                    plan.popular
                      ? "w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      : "w-full"
                  }
                >
                  <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                    {isLoggedIn ? "Manage my account" : plan.cta}
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-b border-border/70 py-20">
        <div className="mx-auto w-full max-w-4xl px-6">
          <h2 className="mb-10 text-center text-4xl font-semibold">
            Here to help
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className="overflow-hidden rounded-3xl border border-border bg-card"
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <p className="px-6 pb-6 leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-lg">
            <div className="grid lg:grid-cols-2">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80"
                alt="Restaurant team working together in service"
                className="h-full min-h-[300px] w-full object-cover"
              />
              <div className="flex flex-col justify-center p-10 lg:p-12">
                <h2 className="mb-5 text-4xl font-semibold">
                  Ready to get your time back?
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  Start your free trial and launch a menu experience that feels
                  premium, simple, and fast for your team and guests.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                      {isLoggedIn ? "Go to dashboard" : "Try for free"}
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Book a walkthrough</Link>
                  </Button>
                </div>
                <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-primary" />
                    Cancel anytime
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-primary" />
                    No setup fee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 Menova. Built for modern restaurant teams.</p>
          <div className="flex items-center gap-5">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
