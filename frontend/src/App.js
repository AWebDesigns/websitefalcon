import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Layout,
  RefreshCw,
  TrendingUp,
  Zap,
  Smartphone,
  Search,
  BarChart,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  MessageCircle,
  Mail,
  Linkedin,
  Twitter,
  Quote,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Falcon logo URLs
const FALCON_LOGO = "https://customer-assets.emergentagent.com/job_falcon-studio/artifacts/lbmevzfg_image.png";
const FALCON_FLYING = "https://customer-assets.emergentagent.com/job_falcon-studio/artifacts/3pq6tkx5_image.png";

// Portfolio data
const portfolioData = [
  {
    id: 1,
    title: "Nexus Finance",
    category: "Fintech",
    image: "https://images.unsplash.com/photo-1663177320254-51b22caf9ebd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Vertex Studio",
    category: "Creative Agency",
    image: "https://images.unsplash.com/photo-1641567535859-c58187ac4954?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Pulse Health",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1735399976112-17508533c97a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Atlas Consulting",
    category: "B2B Services",
    image: "https://images.unsplash.com/photo-1717994818193-266ff93e3396?auto=format&fit=crop&w=800&q=80",
  },
];

// Testimonials data
const testimonialsData = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "CEO, TechFlow",
    content: "Falcon Web Studio delivered beyond our expectations. Our conversion rate increased by 340% within the first month of launching the new site.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Founder, Nexus App",
    content: "The attention to detail and speed of delivery was impressive. They understood our vision and translated it into a stunning digital presence.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 3,
    name: "Emily Roberts",
    role: "Marketing Director, Pulse",
    content: "Working with Falcon was seamless. They transformed our outdated website into a modern platform that truly represents our brand.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
  },
];

// Services data
const servicesData = [
  {
    icon: Layout,
    title: "Website Design",
    description: "Custom UI/UX design tailored to your brand identity. Every pixel crafted for maximum impact.",
  },
  {
    icon: RefreshCw,
    title: "Website Redesign",
    description: "Modernizing legacy sites for better performance, aesthetics, and user experience.",
  },
  {
    icon: TrendingUp,
    title: "Conversion Optimization",
    description: "Data-driven strategies to transform your traffic into measurable revenue growth.",
  },
];

// Process steps
const processSteps = [
  { number: "01", title: "Strategy", description: "Understanding your goals and target audience" },
  { number: "02", title: "Design", description: "Crafting visuals that align with your brand" },
  { number: "03", title: "Development", description: "Building with clean, optimized code" },
  { number: "04", title: "Launch", description: "Going live with ongoing support" },
];

// Why choose us data
const featuresData = [
  { icon: Zap, title: "Fast Delivery", description: "Projects delivered in 2-4 weeks" },
  { icon: Smartphone, title: "Mobile Optimized", description: "Flawless on every device" },
  { icon: Search, title: "SEO Ready", description: "Built to rank on search engines" },
  { icon: BarChart, title: "Conversion Focused", description: "Designed to drive results" },
];

// Flying Falcon Component - follows scroll in background with wing animation
const FlyingFalcon = () => {
  const { scrollYProgress } = useScroll();
  const [windowHeight, setWindowHeight] = useState(800);
  const [scrollDirection, setScrollDirection] = useState('down');
  const lastScrollY = useRef(0);
  
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Track scroll direction
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest > lastScrollY.current) {
        setScrollDirection('down');
      } else if (latest < lastScrollY.current) {
        setScrollDirection('up');
      }
      lastScrollY.current = latest;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  // Transform scroll progress to position - flies across the page
  const y = useTransform(scrollYProgress, [0, 1], [100, windowHeight - 200]);
  const x = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [
    '10vw', '60vw', '30vw', '70vw', '50vw'
  ]);
  
  // Bird rotation based on direction of horizontal movement
  const bodyRotate = useTransform(scrollYProgress, [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], 
    [0, 15, 10, -15, -10, 15, 10, -10, 0]
  );
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.5, 1]);
  
  // Opacity - visible only in the middle of scroll, fades at edges
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 0.2, 0.2, 0]);
  
  // Switch between sitting logo and flying falcon based on scroll
  const flyingOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const sittingOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [1, 0, 0, 1]);

  // Wing flapping animation variants
  const wingFlapVariants = {
    flying: {
      scaleY: [1, 0.85, 1, 1.1, 1],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        y,
        x,
        scale,
        opacity,
        zIndex: 5,
      }}
    >
      {/* Flying falcon with wing animation - visible during scroll */}
      <motion.div
        style={{ 
          rotate: bodyRotate,
          originX: 0.5,
          originY: 0.5,
        }}
        animate={{
          scaleX: scrollDirection === 'up' ? -1 : 1,
        }}
        transition={{
          scaleX: { duration: 0.3, ease: "easeInOut" }
        }}
      >
        <motion.img 
          src={FALCON_FLYING} 
          alt="Flying Falcon" 
          className="w-32 h-32 md:w-48 md:h-48 object-contain"
          style={{ 
            opacity: flyingOpacity,
            filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.2))',
          }}
          variants={wingFlapVariants}
          animate="flying"
        />
      </motion.div>
      {/* Sitting falcon - visible at start and end */}
      <motion.img 
        src={FALCON_LOGO} 
        alt="Falcon Logo" 
        className="w-24 h-24 md:w-32 md:h-32 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ 
          opacity: sittingOpacity,
          filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))',
        }}
      />
    </motion.div>
  );
};

// Lead Capture Modal Component
const LeadCaptureModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business_name: "",
    website_url: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/leads`, formData);
      toast.success("Request submitted! We'll be in touch within 24 hours.");
      setFormData({ name: "", email: "", business_name: "", website_url: "", message: "" });
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white" data-testid="lead-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-950 font-['Outfit']">
            Request Free Website Preview
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Tell us about your business and we'll design a homepage preview — completely free, no strings attached.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                data-testid="lead-name-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@company.com"
                data-testid="lead-email-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="Acme Inc."
                data-testid="lead-business-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">Current Website (if any)</Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://..."
                data-testid="lead-website-input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Tell us about your project</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="What does your business do? What are your goals for the website?"
              rows={4}
              data-testid="lead-message-input"
            />
          </div>
          <Button
            type="submit"
            className="w-full btn-accent rounded-full py-6"
            disabled={isSubmitting}
            data-testid="lead-submit-btn"
          >
            {isSubmitting ? "Submitting..." : "Get My Free Preview"}
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Navigation component
const Navigation = ({ onOpenModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#portfolio", label: "Work" },
    { href: "#process", label: "Process" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3" data-testid="logo-link">
            <img 
              src={FALCON_LOGO} 
              alt="Falcon Web Studio" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-xl font-bold text-slate-950 font-['Outfit']">Falcon</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-slate-600 hover:text-slate-950 font-medium"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
            <Button
              className="btn-primary rounded-full px-6"
              onClick={onOpenModal}
              data-testid="nav-contact-btn"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100"
            >
              <div className="py-4 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-slate-600 hover:text-slate-950 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="px-4">
                  <Button
                    className="btn-primary w-full rounded-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenModal();
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

// Hero Section
const HeroSection = ({ onOpenModal }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large falcon wing shape */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.06, x: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute top-1/4 right-0 w-[800px] h-[600px] bg-slate-950 falcon-wing"
        />
        
        {/* Floating geometric shapes */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-1/4 w-24 h-24 border-2 border-blue-500/20 rotate-45"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-blue-500/10"
        />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-20 w-32 h-32 border border-slate-200 rounded-full"
        />
        
        {/* Dotted pattern */}
        <div className="absolute top-40 left-1/4 grid grid-cols-5 gap-4">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-full mb-6">
              Premium Web Design Agency
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 leading-[1.1] mb-8"
            data-testid="hero-headline"
          >
            Websites That Turn{" "}
            <span className="text-blue-500">Visitors</span> Into{" "}
            <span className="relative">
              Customers
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 150 2 298 10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed mb-12 max-w-2xl"
            data-testid="hero-subtext"
          >
            We design fast, modern websites for businesses that want to grow online. 
            Precision-engineered digital experiences that convert.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="btn-accent rounded-full px-8 py-6 text-base font-medium group"
              onClick={onOpenModal}
              data-testid="hero-request-preview-btn"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Request Free Website Preview
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-outline rounded-full px-8 py-6 text-base font-medium group"
              onClick={() => document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })}
              data-testid="hero-view-work-btn"
            >
              View Our Work
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 pt-8 border-t border-slate-100"
          >
            <p className="text-sm text-slate-500 mb-4">Trusted by innovative companies</p>
            <div className="flex items-center gap-8 opacity-50">
              {["TechFlow", "Nexus", "Vertex", "Atlas"].map((company) => (
                <span key={company} className="text-slate-400 font-semibold text-lg">{company}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Services Section
const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-wide uppercase text-blue-500 mb-4 block">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-6">
            What We Do Best
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Specialized in creating high-performance websites that drive business growth
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="service-card bg-white p-8 md:p-10 rounded-2xl border border-slate-100"
              data-testid={`service-card-${index}`}
            >
              <div className="w-14 h-14 bg-slate-950 rounded-xl flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-950 mb-4">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
              <a
                href="#cta"
                className="inline-flex items-center mt-6 text-blue-500 font-medium hover:text-blue-600 transition-colors"
              >
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Portfolio Section
const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <span className="text-sm font-medium tracking-wide uppercase text-blue-500 mb-4 block">
              Our Work
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-950">
              Selected Projects
            </h2>
          </div>
          <p className="text-lg text-slate-600 max-w-md mt-4 md:mt-0">
            A showcase of our recent work for ambitious brands
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {portfolioData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="portfolio-item group rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
              data-testid={`portfolio-item-${index}`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="portfolio-overlay text-white">
                <span className="text-sm font-medium text-blue-400 mb-2 block">{project.category}</span>
                <h3 className="text-2xl font-semibold">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Process Section
const ProcessSection = () => {
  return (
    <section id="process" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium tracking-wide uppercase text-blue-500 mb-4 block">
            Our Process
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-6">
            How We Work
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A proven methodology that delivers exceptional results every time
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden md:block timeline-line" />

          <div className="grid md:grid-cols-4 gap-8 md:gap-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="timeline-step text-center"
                data-testid={`process-step-${index}`}
              >
                <div className="w-16 h-16 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <span className="text-2xl font-bold text-blue-500">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Why Choose Us Section
const WhyChooseUsSection = ({ onOpenModal }) => {
  return (
    <section id="features" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium tracking-wide uppercase text-blue-500 mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-6">
              Built for Performance
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              We don't just build websites — we engineer digital experiences that are fast, 
              accessible, and designed to convert visitors into loyal customers.
            </p>
            <Button
              className="btn-accent rounded-full px-8"
              onClick={onOpenModal}
              data-testid="features-cta-btn"
            >
              Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {featuresData.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                data-testid={`feature-${index}`}
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  <feature.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-wide uppercase text-blue-500 mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-6">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="testimonial-card bg-white p-8 rounded-2xl relative"
              data-testid={`testimonial-${index}`}
            >
              <Quote className="w-10 h-10 text-slate-100 absolute top-6 right-6" />
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-slate-950">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed relative z-10">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = ({ onOpenModal }) => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi, I'm interested in getting a free website demo from Falcon Web Studio.");
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <section id="cta" className="py-24 md:py-32 cta-gradient">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-white/10 text-white/80 text-sm font-medium rounded-full mb-6">
            Free Demo Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6" data-testid="cta-headline">
            Get Your Free Website Demo
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            We will design a homepage preview for your business before you pay anything. 
            No commitment, no risk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-slate-950 hover:bg-slate-100 rounded-full px-8 py-6 text-base font-medium group"
              onClick={onOpenModal}
              data-testid="cta-request-demo-btn"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Request Free Website Preview
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-medium"
              onClick={handleWhatsApp}
              data-testid="cta-whatsapp-btn"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Chat on WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 bg-slate-950 relative">
      {/* Falcon landing spot indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={FALCON_LOGO} 
                alt="Falcon Web Studio" 
                className="w-12 h-12 object-contain invert"
              />
              <span className="text-xl font-bold text-white font-['Outfit']">Falcon Web Studio</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              Premium web design agency crafting high-performance websites for businesses that want to grow online.
            </p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                data-testid="footer-whatsapp-link"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:hello@falconwebstudio.com"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                data-testid="footer-email-link"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                data-testid="footer-linkedin-link"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                data-testid="footer-twitter-link"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Services", "Portfolio", "Process", "Testimonials"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-slate-400">
              <li>hello@falconwebstudio.com</li>
              <li>WhatsApp Available</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Falcon Web Studio. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Designed with precision. Built for performance.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <FlyingFalcon />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />
      <HeroSection onOpenModal={() => setIsModalOpen(true)} />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <WhyChooseUsSection onOpenModal={() => setIsModalOpen(true)} />
      <TestimonialsSection />
      <CTASection onOpenModal={() => setIsModalOpen(true)} />
      <Footer />
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
