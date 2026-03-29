import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed, QrCode, Smartphone, Palette, ArrowRight, Check,
  Menu, X, Zap, BarChart3, ShoppingCart, ChevronDown, Star, Globe,
  LogOut, LayoutDashboard, Eye, Folder, ShoppingBag, Heart, Phone
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
  { name: 'Free', price: '₹0', period: '/year', features: ['Up to 15 menu items', 'Basic customization'], cta: 'Start Free', popular: false },
  { name: 'Pro', price: '₹1499', period: '/year', features: ['Unlimited menu items', 'Analytics dashboard', 'Modern customization','Priority support'], cta: 'Start Free Trial', popular: true },
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
    <div className="min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-200/40 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-300">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-slate-900">Menova</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-widest px-2 py-1"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <Button asChild className="h-12 px-8 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all active:scale-95">
                <Link to="/dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-orange-500 px-4">Log In</Link>
                <Button asChild className="h-12 px-8 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-xl shadow-orange-500/20 transition-all active:scale-95">
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        <AnimatePresence>
          {mobileNav && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                    className="block text-lg font-bold text-slate-600 py-2" 
                    onClick={() => setMobileNav(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 border-t border-slate-50 flex flex-col gap-3">
                  {isLoggedIn ? (
                    <Button className="w-full h-14 rounded-2xl font-bold bg-slate-900" asChild><Link to="/dashboard">Dashboard</Link></Button>
                  ) : (
                    <>
                      <Link to="/login" className="block text-center font-bold py-3 text-slate-600">Log In</Link>
                      <Button className="w-full h-14 rounded-2xl font-bold bg-orange-500 shadow-xl shadow-orange-500/20" asChild><Link to="/register">Start Free Trial</Link></Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
              <Zap className="w-3 h-3 fill-current" /> Next-Gen Menu Studio
            </div>
            
            <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8 text-slate-900">
              Modern menus<br />
              <span className="text-orange-500 relative inline-block">
                for modern
                <div className="absolute -bottom-1.5 left-0 right-0 h-2 bg-orange-100/50 -rotate-1 -z-10" />
              </span><br />
              dining.
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              Create immersive digital menus that feel like an extension of your brand. Increase sales with beautiful visuals and analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 text-center">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all active:scale-95 group" asChild>
                <Link to="/register">
                  Claim your spot <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="h-14 px-10 rounded-2xl text-slate-600 font-bold hover:bg-slate-100/50 transition-all group" asChild>
                <Link to="/menu/demo">
                   Live Demo <Eye className="ml-2 w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Immersive Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-400/20 to-blue-400/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
            
            <div className="relative rounded-[2rem] border border-white/50 bg-white/40 backdrop-blur-3xl shadow-2xl p-1.5 overflow-hidden overflow-x-hidden">
               <div className="rounded-[1.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col">
                  {/* Browser Header */}
                  <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/50 border-b border-slate-50">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-200" />
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-white border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <Globe className="w-2.5 h-2.5" /> menova.app/dashboard
                    </div>
                    <div className="w-10 h-1.5 rounded-full bg-slate-200 opacity-20" />
                  </div>
                  
                  {/* Mock Content */}
                  <div className="p-8 lg:p-10 text-left">
                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                        <div>
                           <h3 className="font-display font-black text-2xl text-slate-900 mb-1.5 tracking-tight">Morning, Spice Garden 👋</h3>
                           <p className="text-slate-400 text-sm font-medium">Your digital menu is currently live and performing well.</p>
                        </div>
                        <div className="flex gap-2">
                           <div className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest border border-orange-100">Live</div>
                           <div className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-100">Pro Plan</div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { label: 'Views Today', val: '2,841', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
                          { label: 'Scans', val: '432', icon: QrCode, color: 'text-orange-500', bg: 'bg-orange-50' },
                          { label: 'Orders', val: '₹14.2k', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-50' },
                          { label: 'Likes', val: '1.2k', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
                        ].map((stat) => (
                          <div key={stat.label} className="p-5 rounded-[1.5rem] border border-slate-100 bg-white shadow-sm hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-500">
                             <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                                <stat.icon className="w-5 h-5" />
                             </div>
                             <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</div>
                             <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Bento Features */}
      <section id="features" className="py-24 px-6 text-center lg:text-left">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl text-left">
              <div className="text-orange-500 font-black text-[9px] uppercase tracking-[0.3em] mb-4">Core Capabilities</div>
              <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[0.9]">Everything you need to <span className="text-slate-400 italic">wow</span> guests.</h2>
            </div>
            <p className="text-lg text-slate-500 font-medium max-w-sm text-left">From creation to analytics, we handle the heavy lifting of digital operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[240px] gap-5">
            <div className="md:col-span-8 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between group overflow-hidden relative text-left">
              <div className="relative z-10">
                <UtensilsCrossed className="w-10 h-10 text-slate-900 mb-4 group-hover:rotate-12 transition-transform duration-500" />
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Studio Menu Builder</h3>
                <p className="text-slate-500 font-medium text-sm max-w-md">Our high-fidelity editor gives you professional control without the technical complexity. Drag, drop, and customize in seconds.</p>
              </div>
              <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700 pointer-events-none translate-y-16 translate-x-8">
                 <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-[8rem]" />
              </div>
            </div>

            <div className="md:col-span-4 p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-900/10 flex flex-col justify-between group text-left">
              <div>
                <QrCode className="w-10 h-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black mb-3 tracking-tight">Instant QR Dispatch</h3>
                <p className="text-slate-400 font-medium text-sm">Download dynamic QR codes that never expire. Change your menu instantly without reprinting.</p>
              </div>
              <ArrowRight className="w-6 h-6 text-white/20 group-hover:translate-x-2 transition-all group-hover:text-orange-500" />
            </div>

            <div className="md:col-span-4 p-8 rounded-[2rem] bg-orange-500 text-white flex flex-col justify-between group text-left">
              <div>
                <Smartphone className="w-10 h-10 text-white mb-4" />
                <h3 className="text-2xl font-black mb-3 tracking-tight">Immersive Mobile UX</h3>
                <p className="text-orange-50/80 font-medium text-sm">Not just a PDF. A fully interactive web-app experience with blur effects, animations, and smooth scrolling.</p>
              </div>
            </div>

            <div className="md:col-span-4 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between group text-left">
              <div>
                <Palette className="w-10 h-10 text-slate-900 mb-4" />
                <h3 className="text-2xl font-black mb-3 tracking-tight">Pixel Perfect Branding</h3>
                <p className="text-slate-500 font-medium text-sm">Fine-tune spacing, colors, and shadows to match your high-end interior and brand identity.</p>
              </div>
            </div>

            <div className="md:col-span-4 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between group text-left">
              <div>
                <BarChart3 className="w-10 h-10 text-slate-900 mb-4" />
                <h3 className="text-2xl font-black mb-3 tracking-tight">Deep Analytics</h3>
                <p className="text-slate-500 font-medium text-sm">See what your customers are looking at. Track dish popularity and view engagement in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Steps Section */}
      <section id="how-it-works" className="min-h-screen flex items-center pt-20 px-6 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full noise-bg opacity-10" />
         <div className="max-w-7xl mx-auto relative z-10 w-full py-20 lg:py-0">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2 space-y-10 text-left">
                  <div className="space-y-4">
                    <h2 className="text-4xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">From setup to<br />orders in <span className="text-orange-500">minutes.</span></h2>
                    <p className="text-lg text-slate-400 font-medium max-w-md">We&apos;ve eliminated the friction of going digital. No technical degree required.</p>
                  </div>
                  
                  <div className="space-y-6">
                     {steps.map((s, idx) => (
                        <motion.div 
                          key={s.num} 
                          initial={{ opacity: 0, x: -20 }} 
                          whileInView={{ opacity: 1, x: 0 }} 
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-5 group"
                        >
                           <div className="font-display font-black text-xl text-slate-800 group-hover:text-orange-500 transition-colors shrink-0">{s.num}</div>
                           <div>
                              <h4 className="text-lg font-black mb-1.5 tracking-tight">{s.title}</h4>
                              <p className="text-slate-500 text-sm font-medium">{s.desc}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
               
               <div className="lg:w-1/2 relative">
                  <div className="w-full aspect-square rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl flex items-center justify-center p-10">
                     <div className="relative w-full h-full bg-slate-800 rounded-[2rem] border border-white/10 shadow-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-blue-400/20 opacity-40 animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <QrCode className="w-32 h-32 text-white opacity-20" />
                        </div>
                     </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500 rounded-full blur-[60px] opacity-30" />
               </div>
            </div>
         </div>
      </section>

      {/* High-End Pricing Cards */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <div className="text-orange-500 font-black text-[9px] uppercase tracking-[0.3em] mb-4">Investment</div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">Simple pricing.<br />Rapid ROI.</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">Choose the plan that fits your operation. Scale as your business grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className={`group relative rounded-[2.5rem] p-8 lg:p-10 flex flex-col text-left transition-all duration-500 ${
                  plan.popular 
                    ? 'bg-slate-900 text-white shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] scale-105 z-10' 
                    : 'bg-white border border-slate-100 text-slate-900 shadow-lg shadow-slate-200/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-10 px-4 py-1 rounded-full bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                    Recommended Choice
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className={`font-black text-xl tracking-tight mb-3 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                    <span className={`text-xs font-bold opacity-60`}>{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-4 text-xs font-bold font-display">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="opacity-80">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? 'default' : 'outline'} 
                  className={`h-14 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
                    plan.popular 
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20' 
                      : 'bg-white text-slate-900 border-2 border-slate-100'
                  }`}
                  asChild
                >
                  <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                    {isLoggedIn ? "Manage My Account" : plan.cta}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Glass Accordion */}
      <section id="faq" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-orange-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="text-orange-500 font-black text-[9px] uppercase tracking-[0.3em]">Support</div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-[0.95]">Curious?<br />We have answers.</h2>
          </div>
          
          <div className="grid gap-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-[1.5rem] border overflow-hidden transition-all duration-500 ${openFaq === i ? 'bg-white border-white shadow-2xl shadow-slate-200/60' : 'bg-white/40 border-slate-200/40 hover:bg-white/80'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 lg:p-7 text-left transition-colors"
                >
                  <span className="font-black text-slate-900 text-sm lg:text-base pr-6 tracking-tight">{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === i ? 'bg-slate-900 text-white scale-110' : 'bg-slate-100 text-slate-400'}`}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 lg:px-7 pb-6 lg:pb-7"
                    >
                      <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global CTA Section */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] bg-slate-900 text-white p-12 lg:p-20 overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500 skew-x-[-12deg] translate-x-1/2 opacity-10" />
             <div className="relative z-10 max-w-2xl text-left">
                <h2 className="text-4xl lg:text-8xl font-black tracking-tight leading-[0.8] mb-8">Start your<br />transformation<br /><span className="text-orange-500">today.</span></h2>
                <p className="text-lg text-slate-400 font-medium mb-10 max-w-md">Join over 500+ restaurants already using Menova to elevate their customer experience.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                   <Button size="lg" className="h-14 px-10 rounded-xl bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-500/20" asChild>
                     <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                       {isLoggedIn ? "Return to Dashboard" : "Begin onboarding"} <ArrowRight className="ml-2 w-4 h-4" />
                     </Link>
                   </Button>
                </div>
             </div>
             
             {/* Floating UI Element for CTA */}
             <div className="absolute bottom-[-10%] right-[-5%] w-[35%] aspect-square rounded-full border-[25px] border-white/5 opacity-30 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-slate-900">Menova</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-10">
              {['Features', 'Pricing', 'FAQ', 'Privacy', 'Terms'].map((link) => (
                <a key={link} href="#" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors">{link}</a>
              ))}
            </div>

            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-orange-500 cursor-pointer transition-all"><Globe className="w-4 h-4" /></div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-orange-500 cursor-pointer transition-all"><Phone className="w-4 h-4" /></div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
             <p>© 2024 MENOVA LABS PVT LTD. ALL RIGHTS RESERVED.</p>
             <div className="flex items-center gap-6">
                <span>Handcrafted with ❤️ by Menova</span>
                <span className="text-orange-500">IND 🇮🇳</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
