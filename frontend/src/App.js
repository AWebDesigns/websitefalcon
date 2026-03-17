import { useState, useEffect, useRef, createContext, useContext } from "react";
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
const FALCON_LOGO = "https://customer-assets.emergentagent.com/job_falcon-studio/artifacts/vou21f5x_image.png";
const FALCON_FLYING = "https://customer-assets.emergentagent.com/job_falcon-studio/artifacts/3pq6tkx5_image.png";

// Language Context
const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Translations
const translations = {
  en: {
    // Navigation
    nav: {
      services: "Services",
      work: "Work",
      process: "Process",
      getStarted: "Get Started",
    },
    // Hero
    hero: {
      badge: "Premium Web Design Agency",
      headline1: "Websites That Turn",
      headline2: "Visitors",
      headline3: "Into",
      headline4: "Customers",
      subtext: "We design fast, modern websites for businesses that want to grow online. Precision-engineered digital experiences that convert.",
      ctaPreview: "Request Free Website Preview",
      ctaWork: "View Our Work",
      trustedBy: "Trusted by innovative companies",
    },
    // Services
    services: {
      badge: "Our Services",
      title: "What We Do Best",
      subtitle: "Specialized in creating high-performance websites that drive business growth",
      learnMore: "Learn more",
      items: [
        {
          title: "Website Design",
          description: "Custom UI/UX design tailored to your brand identity. Every pixel crafted for maximum impact.",
        },
        {
          title: "Website Redesign",
          description: "Modernizing legacy sites for better performance, aesthetics, and user experience.",
        },
        {
          title: "Conversion Optimization",
          description: "Data-driven strategies to transform your traffic into measurable revenue growth.",
        },
      ],
    },
    // Portfolio
    portfolio: {
      badge: "Our Work",
      title: "Selected Projects",
      subtitle: "A showcase of our recent work for ambitious brands",
    },
    // Process
    process: {
      badge: "Our Process",
      title: "How We Work",
      subtitle: "A proven methodology that delivers exceptional results every time",
      steps: [
        { number: "01", title: "Strategy", description: "Understanding your goals and target audience" },
        { number: "02", title: "Design", description: "Crafting visuals that align with your brand" },
        { number: "03", title: "Development", description: "Building with clean, optimized code" },
        { number: "04", title: "Launch", description: "Going live with ongoing support" },
      ],
    },
    // Why Choose Us
    features: {
      badge: "Why Choose Us",
      title: "Built for Performance",
      subtitle: "We don't just build websites — we engineer digital experiences that are fast, accessible, and designed to convert visitors into loyal customers.",
      cta: "Start Your Project",
      items: [
        { title: "Fast Delivery", description: "Within 1 week" },
        { title: "Mobile Optimized", description: "Flawless on every device" },
        { title: "SEO Ready", description: "Built to rank on search engines" },
        { title: "Conversion Focused", description: "Designed to drive results" },
      ],
    },
    // Questions
    questions: {
      title: "Questions?",
      subtitle: "We're here to help. Reach out anytime — no pressure, no obligations.",
      whatsapp: "Chat on WhatsApp",
      email: "Send Email",
    },
    // CTA
    cta: {
      badge: "Free Demo Offer",
      title: "Get Your Free Website Demo",
      subtitle: "We will design a homepage preview for your business before you pay anything. No commitment, no risk.",
      ctaPreview: "Request Free Website Preview",
      ctaWhatsapp: "Chat on WhatsApp",
    },
    // Footer
    footer: {
      description: "Premium web design agency crafting high-performance websites for businesses that want to grow online.",
      quickLinks: "Quick Links",
      contact: "Contact",
      whatsappAvailable: "WhatsApp Available",
      rights: "All rights reserved.",
      tagline: "Designed with precision. Built for performance.",
    },
    // Modal
    modal: {
      title: "Request Free Website Preview",
      subtitle: "Tell us about your business and we'll design a homepage preview — completely free, no strings attached.",
      whatNeed: "What do you need?",
      newWebsite: "New Website",
      newWebsiteDesc: "Build from scratch",
      fixExisting: "Fix / Redesign",
      fixExistingDesc: "Improve existing site",
      yourName: "Your Name",
      email: "Email",
      businessName: "Business Name",
      currentWebsite: "Current Website (if any)",
      preferredContact: "Preferred contact method for your preview",
      whatsapp: "WhatsApp",
      fasterResponse: "Faster response",
      traditional: "Traditional",
      whatsappNumber: "WhatsApp Number",
      projectWork: "Tell us about your project / work",
      projectPlaceholder: "Example: I'm looking for a modern, minimalist website for my consulting business with a booking system...",
      submit: "Get My Free Preview",
      submitting: "Submitting...",
    },
  },
  sv: {
    // Navigation
    nav: {
      services: "Tjänster",
      work: "Arbeten",
      process: "Process",
      getStarted: "Kom igång",
    },
    // Hero
    hero: {
      badge: "Premium Webbdesignbyrå",
      headline1: "Webbplatser som förvandlar",
      headline2: "besökare",
      headline3: "till",
      headline4: "kunder",
      subtext: "Vi designar snabba, moderna webbplatser för företag som vill växa online. Precisionsbyggda digitala upplevelser som konverterar.",
      ctaPreview: "Begär gratis webbförhandsvisning",
      ctaWork: "Se våra arbeten",
      trustedBy: "Betrodd av innovativa företag",
    },
    // Services
    services: {
      badge: "Våra tjänster",
      title: "Vad vi gör bäst",
      subtitle: "Specialiserade på att skapa högpresterande webbplatser som driver affärstillväxt",
      learnMore: "Läs mer",
      items: [
        {
          title: "Webbdesign",
          description: "Skräddarsydd UI/UX-design anpassad till ditt varumärke. Varje pixel skapad för maximal effekt.",
        },
        {
          title: "Webbomdesign",
          description: "Modernisering av äldre webbplatser för bättre prestanda, estetik och användarupplevelse.",
        },
        {
          title: "Konverteringsoptimering",
          description: "Datadrivna strategier för att omvandla din trafik till mätbar intäktstillväxt.",
        },
      ],
    },
    // Portfolio
    portfolio: {
      badge: "Våra arbeten",
      title: "Utvalda projekt",
      subtitle: "En presentation av vårt senaste arbete för ambitiösa varumärken",
    },
    // Process
    process: {
      badge: "Vår process",
      title: "Hur vi arbetar",
      subtitle: "En beprövad metodik som levererar exceptionella resultat varje gång",
      steps: [
        { number: "01", title: "Strategi", description: "Förstå dina mål och målgrupp" },
        { number: "02", title: "Design", description: "Skapa visuellt som passar ditt varumärke" },
        { number: "03", title: "Utveckling", description: "Bygga med ren, optimerad kod" },
        { number: "04", title: "Lansering", description: "Gå live med löpande support" },
      ],
    },
    // Why Choose Us
    features: {
      badge: "Varför välja oss",
      title: "Byggd för prestanda",
      subtitle: "Vi bygger inte bara webbplatser — vi skapar digitala upplevelser som är snabba, tillgängliga och designade för att konvertera besökare till lojala kunder.",
      cta: "Starta ditt projekt",
      items: [
        { title: "Snabb leverans", description: "Inom 1 vecka" },
        { title: "Mobiloptimerad", description: "Felfri på alla enheter" },
        { title: "SEO-redo", description: "Byggd för att ranka på sökmotorer" },
        { title: "Konverteringsfokuserad", description: "Designad för att driva resultat" },
      ],
    },
    // Questions
    questions: {
      title: "Frågor?",
      subtitle: "Vi finns här för att hjälpa. Kontakta oss när som helst — ingen press, inga förpliktelser.",
      whatsapp: "Chatta på WhatsApp",
      email: "Skicka e-post",
    },
    // CTA
    cta: {
      badge: "Gratis demo-erbjudande",
      title: "Få din gratis webbdemo",
      subtitle: "Vi designar en förhandsvisning av startsidan för ditt företag innan du betalar något. Ingen förbindelse, ingen risk.",
      ctaPreview: "Begär gratis webbförhandsvisning",
      ctaWhatsapp: "Chatta på WhatsApp",
    },
    // Footer
    footer: {
      description: "Premium webbdesignbyrå som skapar högpresterande webbplatser för företag som vill växa online.",
      quickLinks: "Snabblänkar",
      contact: "Kontakt",
      whatsappAvailable: "WhatsApp tillgänglig",
      rights: "Alla rättigheter förbehållna.",
      tagline: "Designad med precision. Byggd för prestanda.",
    },
    // Modal
    modal: {
      title: "Begär gratis webbförhandsvisning",
      subtitle: "Berätta om ditt företag så designar vi en förhandsvisning av startsidan — helt gratis, utan förpliktelser.",
      whatNeed: "Vad behöver du?",
      newWebsite: "Ny webbplats",
      newWebsiteDesc: "Bygg från grunden",
      fixExisting: "Fixa / Omdesigna",
      fixExistingDesc: "Förbättra befintlig webbplats",
      yourName: "Ditt namn",
      email: "E-post",
      businessName: "Företagsnamn",
      currentWebsite: "Nuvarande webbplats (om någon)",
      preferredContact: "Föredragen kontaktmetod för din förhandsvisning",
      whatsapp: "WhatsApp",
      fasterResponse: "Snabbare svar",
      traditional: "Traditionell",
      whatsappNumber: "WhatsApp-nummer",
      projectWork: "Berätta om ditt projekt / arbete",
      projectPlaceholder: "Exempel: Jag letar efter en modern, minimalistisk webbplats för mitt konsultföretag med ett bokningssystem...",
      submit: "Få min gratis förhandsvisning",
      submitting: "Skickar...",
    },
  },
};

// Language Switcher Component
const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1" data-testid="language-switcher">
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === 'en' 
            ? 'bg-white shadow-sm text-slate-900' 
            : 'text-slate-500 hover:text-slate-700'
        }`}
        data-testid="lang-en-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-3 rounded-sm overflow-hidden">
          <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z"/>
          </clipPath>
          <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
          </clipPath>
          <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </svg>
        <span>EN</span>
      </button>
      <button
        onClick={() => setLanguage('sv')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === 'sv' 
            ? 'bg-white shadow-sm text-slate-900' 
            : 'text-slate-500 hover:text-slate-700'
        }`}
        data-testid="lang-sv-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10" className="w-5 h-3 rounded-sm overflow-hidden">
          <rect width="16" height="10" fill="#006AA7"/>
          <rect x="5" width="2" height="10" fill="#FECC00"/>
          <rect y="4" width="16" height="2" fill="#FECC00"/>
        </svg>
        <span>SV</span>
      </button>
    </div>
  );
};

// Portfolio data - each project has an array of images that cycle
const portfolioData = [
  {
    id: 1,
    title: "WAbilvård",
    category: "Automotive",
    imagePosition: "left top",
    images: [
      "https://customer-assets.emergentagent.com/job_falcon-studio/artifacts/mksuf8yz_Screenshot_17-3-2026_13541_www.xn--wabilvrd-f0a.com.jpeg",
      "https://customer-assets.emergentagent.com/job_falcon-studio/artifacts/lhycqnuo_Screenshot_17-3-2026_13560_www.xn--wabilvrd-f0a.com.jpeg",
      "https://customer-assets.emergentagent.com/job_falcon-studio/artifacts/4e0a8936_Screenshot_17-3-2026_135646_www.xn--wabilvrd-f0a.com.jpeg",
    ],
  },
  {
    id: 2,
    title: "Noura's Cookies",
    category: "Bakery",
    imagePosition: "left top",
    images: [
      "https://customer-assets.emergentagent.com/job_176d58f8-ba28-4a29-a0a7-3a7eaa4a0b7c/artifacts/hwdwzmrl_Screenshot_17-3-2026_162444_noura-treats.preview.emergentagent.com.jpeg",
      "https://customer-assets.emergentagent.com/job_176d58f8-ba28-4a29-a0a7-3a7eaa4a0b7c/artifacts/micgyzwq_Screenshot_17-3-2026_162838_noura-treats.preview.emergentagent.com.jpeg",
    ],
  },
  {
    id: 3,
    title: "Markholm & Partners",
    category: "Real Estate",
    images: [
      "https://customer-assets.emergentagent.com/job_176d58f8-ba28-4a29-a0a7-3a7eaa4a0b7c/artifacts/kipygt9v_Screenshot_17-3-2026_163724_landskrona-homes.preview.emergentagent.com.jpeg",
      "https://customer-assets.emergentagent.com/job_176d58f8-ba28-4a29-a0a7-3a7eaa4a0b7c/artifacts/ebftyivw_Screenshot_17-3-2026_164026_landskrona-homes.preview.emergentagent.com.jpeg",
    ],
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
  const [flipX, setFlipX] = useState(1);
  const lastScrollY = useRef(0);
  
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Track scroll direction and calculate flip
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Determine scroll direction
      const isScrollingUp = latest < lastScrollY.current;
      if (latest > lastScrollY.current) {
        setScrollDirection('down');
      } else if (latest < lastScrollY.current) {
        setScrollDirection('up');
      }
      lastScrollY.current = latest;
      
      // Determine path direction (which way falcon is moving horizontally)
      // Path: 10vw -> 60vw -> 30vw -> 70vw -> 50vw
      // Going right: 0-0.25, 0.5-0.75 | Going left: 0.25-0.5, 0.75-1
      let pathFlip = 1;
      if ((latest > 0.25 && latest <= 0.5) || (latest > 0.75 && latest <= 1)) {
        pathFlip = -1; // Going left
      }
      
      // Combine: scroll up reverses, path direction applies
      const scrollFlip = isScrollingUp ? -1 : 1;
      setFlipX(pathFlip * scrollFlip);
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
          scaleX: flipX,
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
  const { language } = useLanguage();
  const t = translations[language].modal;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business_name: "",
    website_url: "",
    message: "",
    project_type: "",
    preferred_contact: "whatsapp",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/leads`, formData);
      toast.success(language === 'en' ? "Request submitted! We'll be in touch within 24 hours." : "Förfrågan skickad! Vi hör av oss inom 24 timmar.");
      setFormData({ name: "", email: "", business_name: "", website_url: "", message: "", project_type: "", preferred_contact: "whatsapp", phone: "" });
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
      <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto" data-testid="lead-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-950 font-['Outfit']">
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Project Type Selection */}
          <div className="space-y-2">
            <Label>{t.whatNeed} *</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, project_type: "new_website" })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.project_type === "new_website" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
                data-testid="project-type-new"
              >
                <Layout className="w-6 h-6 text-blue-500 mb-2" />
                <div className="font-medium text-slate-900">{t.newWebsite}</div>
                <div className="text-sm text-slate-500">{t.newWebsiteDesc}</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, project_type: "fix_existing" })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.project_type === "fix_existing" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
                data-testid="project-type-fix"
              >
                <RefreshCw className="w-6 h-6 text-blue-500 mb-2" />
                <div className="font-medium text-slate-900">{t.fixExisting}</div>
                <div className="text-sm text-slate-500">{t.fixExistingDesc}</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.yourName} *</Label>
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
              <Label htmlFor="email">{t.email} *</Label>
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
              <Label htmlFor="business_name">{t.businessName}</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="Acme Inc."
                data-testid="lead-business-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">{t.currentWebsite}</Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://..."
                data-testid="lead-website-input"
              />
            </div>
          </div>
          
          {/* Preferred Contact Method */}
          <div className="space-y-2">
            <Label>{t.preferredContact} *</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, preferred_contact: "whatsapp" })}
                className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  formData.preferred_contact === "whatsapp" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
                data-testid="contact-whatsapp"
              >
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium text-slate-900 text-sm">{t.whatsapp}</div>
                  <div className="text-xs text-slate-500">{t.fasterResponse}</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, preferred_contact: "email" })}
                className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  formData.preferred_contact === "email" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
                data-testid="contact-email"
              >
                <Mail className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-slate-900 text-sm">{t.email}</div>
                  <div className="text-xs text-slate-500">{t.traditional}</div>
                </div>
              </button>
            </div>
          </div>

          {formData.preferred_contact === "whatsapp" && (
            <div className="space-y-2">
              <Label htmlFor="phone">{t.whatsappNumber} *</Label>
              <Input
                id="phone"
                type="tel"
                required={formData.preferred_contact === "whatsapp"}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
                data-testid="lead-phone-input"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">{t.projectWork}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t.projectPlaceholder}
              rows={4}
              data-testid="lead-message-input"
              className="placeholder:text-slate-400 placeholder:italic"
            />
          </div>
          <Button
            type="submit"
            className="w-full btn-accent rounded-full py-6"
            disabled={isSubmitting}
            data-testid="lead-submit-btn"
          >
            {isSubmitting ? t.submitting : t.submit}
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Navigation component
const Navigation = ({ onOpenModal }) => {
  const { language } = useLanguage();
  const t = translations[language].nav;
  
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
    { href: "#services", label: t.services },
    { href: "#portfolio", label: t.work },
    { href: "#process", label: t.process },
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
          {/* Language Switcher - Left side */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
          
          {/* Logo - Center */}
          <a href="#" className="flex items-center gap-3" data-testid="logo-link">
            <img 
              src={FALCON_LOGO} 
              alt="Falcon Web Studio" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-xl font-bold text-slate-950 font-['Outfit']">Falcon Web Studio</span>
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
              {t.getStarted}
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
                    {t.getStarted}
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
  const { language } = useLanguage();
  const t = translations[language].hero;
  
  const handleGetFreeDemo = () => {
    // First scroll to CTA section
    document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
    // Then open modal slowly after scroll completes
    setTimeout(() => {
      onOpenModal();
    }, 1500);
  };

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
              {t.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 leading-[1.1] mb-8"
            data-testid="hero-headline"
          >
            {t.headline1}{" "}
            <span className="text-blue-500">{t.headline2}</span> {t.headline3}{" "}
            <span className="relative">
              {t.headline4}
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
            {t.subtext}
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
              onClick={handleGetFreeDemo}
              data-testid="hero-request-preview-btn"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              {t.ctaPreview}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-outline rounded-full px-8 py-6 text-base font-medium group"
              onClick={() => document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })}
              data-testid="hero-view-work-btn"
            >
              {t.ctaWork}
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
            <p className="text-lg text-slate-600">{language === 'en' ? 'Ready to help your business grow online?' : 'Redo att hjälpa ditt företag växa online?'}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Services Section
const ServicesSection = () => {
  const { language } = useLanguage();
  const t = translations[language].services;
  
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
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-6">
            {t.title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.items.map((service, index) => (
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
                {index === 0 && <Layout className="w-7 h-7 text-white" />}
                {index === 1 && <RefreshCw className="w-7 h-7 text-white" />}
                {index === 2 && <TrendingUp className="w-7 h-7 text-white" />}
              </div>
              <h3 className="text-2xl font-semibold text-slate-950 mb-4">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
              <a
                href="#cta"
                className="inline-flex items-center mt-6 text-blue-500 font-medium hover:text-blue-600 transition-colors"
              >
                {t.learnMore} <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Portfolio Card - individual image cycling per card
const PortfolioCard = ({ project, index }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (project.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % project.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [project.images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="portfolio-item group rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer relative"
      data-testid={`portfolio-item-${index}`}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={project.images[currentImage]}
          alt={project.title}
          className="w-full h-full object-cover absolute inset-0"
          style={{ objectPosition: project.imagePosition || "center" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          data-testid={`portfolio-img-${index}`}
        />
      </AnimatePresence>
      <div className="portfolio-overlay text-white">
        <span className="text-sm font-medium text-blue-400 mb-2 block">{project.category}</span>
        <h3 className="text-2xl font-semibold">{project.title}</h3>
      </div>
    </motion.div>
  );
};

// Portfolio Section - 2x2 grid with individual image cycling
const PortfolioSection = () => {
  const { language } = useLanguage();
  const t = translations[language].portfolio;

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
              {t.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-950">
              {t.title}
            </h2>
          </div>
          <p className="text-lg text-slate-600 max-w-md mt-4 md:mt-0">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {portfolioData.map((project, index) => (
            <PortfolioCard key={project.id} project={project} index={index} />
          ))}
          {/* Engaging text card in the 4th spot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl aspect-[4/3] flex flex-col justify-center px-10 md:px-14"
            data-testid="portfolio-cta-card"
          >
            <span className="text-blue-500 text-sm font-medium tracking-wide uppercase mb-4">
              {language === 'en' ? 'Your project next?' : 'Ditt projekt härnäst?'}
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-950 leading-tight mb-4">
              {language === 'en' ? "Let's build something" : 'Låt oss bygga något'}
              <br />
              <span className="text-blue-500">{language === 'en' ? 'extraordinary.' : 'extraordinärt.'}</span>
            </h3>
            <p className="text-slate-500 text-base leading-relaxed">
              {language === 'en'
                ? 'Every great brand deserves a website that works as hard as they do. Yours could be here.'
                : 'Varje starkt varumärke förtjänar en webbplats som arbetar lika hårt som de gör. Din kan vara här.'}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Process Section
const ProcessSection = () => {
  const { language } = useLanguage();
  const t = translations[language].process;
  
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
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-6">
            {t.title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden md:block timeline-line" />

          <div className="grid md:grid-cols-4 gap-8 md:gap-4">
            {t.steps.map((step, index) => (
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
  const { language } = useLanguage();
  const t = translations[language].features;
  
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
              {t.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-6">
              {t.title}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {t.subtitle}
            </p>
            <Button
              className="btn-accent rounded-full px-8"
              onClick={onOpenModal}
              data-testid="features-cta-btn"
            >
              {t.cta} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {t.items.map((feature, index) => (
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
                  {index === 0 && <Zap className="w-6 h-6 text-blue-500" />}
                  {index === 1 && <Smartphone className="w-6 h-6 text-blue-500" />}
                  {index === 2 && <Search className="w-6 h-6 text-blue-500" />}
                  {index === 3 && <BarChart className="w-6 h-6 text-blue-500" />}
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
  const { language } = useLanguage();
  const t = translations[language].cta;
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent(language === 'en'
      ? "Hi, I'm interested in getting a free website demo from Falcon Web Studio."
      : "Hej, jag är intresserad av att få en gratis webbdemo från Falcon Web Studio.");
    window.open(`https://wa.me/46735066026?text=${message}`, "_blank");
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
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6" data-testid="cta-headline">
            {t.title}
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-slate-950 hover:bg-slate-100 rounded-full px-8 py-6 text-base font-medium group"
              onClick={onOpenModal}
              data-testid="cta-request-demo-btn"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              {t.ctaPreview}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-medium"
              onClick={handleWhatsApp}
              data-testid="cta-whatsapp-btn"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              {t.ctaWhatsapp}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Questions Section
const QuestionsSection = () => {
  const { language } = useLanguage();
  const t = translations[language].questions;
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent(language === 'en' 
      ? "Hi, I have a question about your web design services."
      : "Hej, jag har en fråga om era webbdesigntjänster.");
    window.open(`https://wa.me/46735066026?text=${message}`, "_blank");
  };

  return (
    <section id="questions" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-950 mb-2">
                {t.title}
              </h3>
              <p className="text-slate-600">
                {t.subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-5"
                data-testid="questions-whatsapp-btn"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                {t.whatsapp}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "mailto:falconwebdesignit@gmail.com"}
                className="rounded-full px-6 py-5 border-slate-300"
                data-testid="questions-email-btn"
              >
                <Mail className="mr-2 w-5 h-5" />
                {t.email}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language].footer;
  const tNav = translations[language].nav;
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
              {t.description}
            </p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/46735066026"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                data-testid="footer-whatsapp-link"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:falconwebdesignit@gmail.com"
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
            <h4 className="text-white font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-slate-400 hover:text-white transition-colors">
                  {tNav.services}
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-slate-400 hover:text-white transition-colors">
                  {tNav.work}
                </a>
              </li>
              <li>
                <a href="#process" className="text-slate-400 hover:text-white transition-colors">
                  {tNav.process}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.contact}</h4>
            <ul className="space-y-3 text-slate-400">
              <li>falconwebdesignit@gmail.com</li>
              <li>{t.whatsappAvailable}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Falcon Web Studio. {t.rights}
          </p>
          <p className="text-slate-500 text-sm">
            {t.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="App">
        <Toaster position="top-center" richColors />
        <FlyingFalcon />
        <Navigation onOpenModal={() => setIsModalOpen(true)} />
        <HeroSection onOpenModal={() => setIsModalOpen(true)} />
        <ServicesSection />
        <PortfolioSection />
        <ProcessSection />
        <WhyChooseUsSection onOpenModal={() => setIsModalOpen(true)} />
        <QuestionsSection />
        <CTASection onOpenModal={() => setIsModalOpen(true)} />
        <Footer />
        <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
