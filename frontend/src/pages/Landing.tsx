import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed, QrCode, Smartphone, Palette, ArrowRight, Check,
  Menu, X, Zap, BarChart3, ShoppingCart, ChevronDown, Star, Globe,
  LogOut, LayoutDashboard, Eye, Folder
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

const features = [
  { icon: UtensilsCrossed, title: 'Digital Menu Builder', desc: 'Create beautiful menus with categories, images, and pricing in minutes.' },
  { icon: QrCode, title: 'QR Code Generator', desc: 'Auto-generate QR codes. Customers scan and instantly view your menu.' },
  { icon: Smartphone, title: 'Mobile Optimized', desc: 'Menus look stunning on every device — phone, tablet, or desktop.' },
  { icon: Palette, title: 'Brand Customization', desc: 'Match your restaurant brand with custom colors, logos, and fonts.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track menu views, popular items, and order trends in real-time.' },
];

const steps = [
  { num: '01', title: 'Create your restaurant', desc: 'Sign up and add your restaurant details in seconds.' },
  { num: '02', title: 'Build your menu', desc: 'Add categories, items, images and prices with our intuitive editor.' },
  { num: '03', title: 'Share with QR', desc: 'Generate a QR code, print it, and place it on your tables.' },
  { num: '04', title: 'Get your insights', desc: 'Track menu views, popular items, and order trends in real-time.' },
];

const plans = [
  { name: 'Free', price: '₹0', period: '/year', features: ['Up to 15 menu items', '1 QR code', 'Basic customization', 'Mobile-ready menu'], cta: 'Start Free', popular: false },
  { name: 'Pro', price: '₹1499', period: '/year', features: ['Unlimited menu items', 'Multiple QR codes', 'Full brand customization', 'Table ordering system', 'Analytics dashboard', 'Priority support'], cta: 'Start Free Trial', popular: true },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Owner, Spice Garden', text: 'Menova transformed how we handle orders. Our customers love scanning the QR and ordering directly!', rating: 5 },
  { name: 'Rahul Mehta', role: 'Manager, Café Bliss', text: 'Setup took 10 minutes. The table ordering feature alone has saved us two waitstaff per shift.', rating: 5 },
  { name: 'Anita Desai', role: 'Owner, Taj Kitchen', text: 'Beautiful menus, easy to update. Our online orders went up 40% in the first month.', rating: 5 },
];

const faqs = [
  { q: 'How does the QR code menu work?', a: 'You create your digital menu on Menova, generate a QR code, and print it. Customers scan the QR with their phone camera and your menu opens instantly — no app download needed.' },
  { q: 'Can customers order from the menu?', a: 'Yes! With the Pro plan, customers can add items to a cart, enter their table number, and place orders directly from their phone.' },
  { q: 'Can I customize the look of my menu?', a: 'Absolutely. You can change colors, fonts, upload your logo, and make your digital menu match your restaurant\'s brand identity.' },
  { q: 'Is there a free plan?', a: 'Yes, our Free plan lets you create a menu with up to 15 items and 1 QR code — perfect for getting started.' },
  { q: 'Do I need technical skills?', a: 'Not at all. Menova is designed for restaurant owners. If you can use a smartphone, you can set up your menu.' },
];

export default function Landing() {
  const [mobileNav, setMobileNav] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isLoggedIn = !!localStorage.getItem('menova_token');
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Menova</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    navigate('/login', { replace: true });
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
                <Button asChild className="shadow-md">
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild><Link to="/login">Log In</Link></Button>
                <Button asChild><Link to="/register">Start Free Trial</Link></Button>
              </>
            )}
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileNav && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border bg-card p-4 space-y-3"
          >
            <a href="#features" className="block text-sm py-2" onClick={() => setMobileNav(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm py-2" onClick={() => setMobileNav(false)}>How it Works</a>
            <a href="#pricing" className="block text-sm py-2" onClick={() => setMobileNav(false)}>Pricing</a>
            <a href="#faq" className="block text-sm py-2" onClick={() => setMobileNav(false)}>FAQ</a>
            <div className="pt-2 space-y-2">
              {isLoggedIn ? (
                <>
                  <Button className="w-full shadow-md" asChild><Link to="/dashboard">Go to Dashboard</Link></Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-500 border-red-100 bg-red-50/30"
                    onClick={() => {
                      logout();
                      navigate('/login', { replace: true });
                    }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild><Link to="/login">Log In</Link></Button>
                  <Button className="w-full" asChild><Link to="/register">Start Free Trial</Link></Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" /> Modernize your restaurant today
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Your restaurant menu,
              <br />
              <span className="text-gradient">gone digital.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Create stunning digital menus, and let customers like their food and let you get the insights of your buisness
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              {!isLoggedIn ? (
                <>
                  <Button size="lg" className="text-base px-8 h-12 shadow-glow" asChild>
                    <Link to="/register">Start Free Trial <ArrowRight className="ml-2 w-4 h-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                    <Link to="/menu/demo">View Demo Menu</Link>
                  </Button>
                </>
              ) : (
                <Button size="lg" className="text-base px-8 h-12 shadow-glow" asChild>
                  <Link to="/dashboard">Welcome back! Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              )}
            </div>
          </motion.div>

          {/* Product Demo Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto max-w-4xl"
          >
            <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-3 py-1 rounded-md">
                    <Globe className="w-3 h-3" />
                    dashboard.menova.app
                  </div>
                </div>
              </div>
              <div className="p-6 bg-background">
                <h3 className="font-display text-2xl font-bold mb-1 text-left">Dashboard</h3>
                <p className="text-sm text-muted-foreground mb-6 text-left">Overview of your restaurant's digital menu</p>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 rounded-lg border border-border bg-card flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-display text-2xl font-extrabold">1,204</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Menu Views</div>
                    </div>
                  </div>
                  <div className="p-5 rounded-lg border border-border bg-card flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-display text-2xl font-extrabold">48</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Menu Items</div>
                    </div>
                  </div>
                  <div className="p-5 rounded-lg border border-border bg-card flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-display text-xl font-extrabold">Chef&apos;s Special</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Popular Item</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="font-display font-semibold mb-4 text-left">Quick Actions</div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="border rounded-full px-5 py-3 flex items-center gap-3 text-sm">
                      <Folder className="w-4 h-4 text-primary" />
                      <span>Add Category</span>
                    </div>
                    <div className="border rounded-full px-5 py-3 flex items-center gap-3 text-sm">
                      <UtensilsCrossed className="w-4 h-4 text-primary" />
                      <span>Add Menu Item</span>
                    </div>
                    <div className="border rounded-full px-5 py-3 flex items-center gap-3 text-sm">
                      <QrCode className="w-4 h-4 text-primary" />
                      <span>Download QR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-2 uppercase tracking-wide">Features</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Everything you need to go digital</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Powerful tools to digitize your restaurant menu and enhance customer experience.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="p-6 rounded-xl border border-border bg-background hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-2 uppercase tracking-wide">How it works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Four simple steps</h2>
            <p className="text-muted-foreground text-lg">Get your digital menu live in under 10 minutes.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center group"
              >
                <div className="text-6xl font-display font-extrabold text-gradient mb-4 group-hover:scale-110 transition-transform">{s.num}</div>
                <h3 className="font-display font-semibold text-xl mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-2 uppercase tracking-wide">Pricing</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-lg">Start free. Scale when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`rounded-xl border p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 ${plan.popular ? 'border-primary bg-accent/50 shadow-glow relative' : 'border-border bg-card hover:shadow-lg'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-display font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? 'default' : 'outline'} className="w-full" asChild>
                  <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                    {isLoggedIn ? "Upgrade Plan" : plan.cta}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-2 uppercase tracking-wide">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-border rounded-xl bg-background overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-display font-semibold text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            {isLoggedIn ? "Ready to manage your menu?" : "Ready to go digital?"}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">Join hundreds of restaurants using Menova to delight their customers.</p>
          <Button size="lg" className="text-base px-8 h-12 shadow-glow" asChild>
            <Link to={isLoggedIn ? "/dashboard" : "/register"}>
              {isLoggedIn ? "Go to Dashboard" : "Start Free Trial"} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <UtensilsCrossed className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Menova</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                }}
                className="hover:text-red-500 transition-colors"
              >
                Log Out
              </button>
            ) : (
              <Link to="/login" className="hover:text-foreground transition-colors">Log In</Link>
            )}
          </div>
          <p className="text-xs text-muted-foreground">© 2024 Menova. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
