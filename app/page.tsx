"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Terminal,
  Cpu,
  FolderGit2,
  Briefcase,
  Mail,
  Sun,
  Moon,
  CheckCircle,
  Menu,
  X,
  FileText,
  GitFork,
  Share2,
  MapPin,
  Send,
  Database,
  Server,
  Code2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Radio,
  Layers,
  ArrowUpRight,
  Clock,
  KeyRound,
  Phone,
  Asterisk,
  ArrowUp,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import InfiniteMarquee from "./components/InfiniteMarquee";

export default function Portfolio() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const headerRef = useRef<HTMLElement>(null);

  // Close mobile navigation menu on click outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Track scroll position to update active section in navigation & show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Reveal back to top near bottom
      const scrolledToBottom = windowHeight + window.scrollY >= fullHeight - 600;
      setShowScrollTop(scrolledToBottom || window.scrollY > 1000);

      // If at or near very bottom of page, highlight contact
      if (windowHeight + window.scrollY >= fullHeight - 150) {
        setActiveSection("contact");
        return;
      }

      // Check section offsets
      const sections = ["contact", "projects", "experience", "tech-stack", "hero"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      setActiveSection("hero");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize theme based on saved user preference or system preference (fallback: light)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      return;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    // Listen for system theme changes if user hasn't explicitly set a preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Sync theme with HTML class & localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const topOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${targetId}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setContactSending(true);
    setContactError(null);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    // Check if user has set environment variables
    if (
      !serviceId ||
      !templateId ||
      !publicKey ||
      serviceId === "your_service_id_here"
    ) {
      // Simulate successful local demonstration mode if env vars are pending setup
      setTimeout(() => {
        setContactSending(false);
        setContactSubmitted(true);
        setTimeout(() => setContactSubmitted(false), 6000);
        setContactForm({ name: "", email: "", subject: "", message: "" });
      }, 900);
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: contactForm.name,
          from_email: contactForm.email,
          reply_to: contactForm.email,
          subject:
            contactForm.subject || "Portfolio Inquiry (Project / Backend Opportunity)",
          message: contactForm.message,
          to_name: "Arpit Sharma",
        },
        publicKey
      );

      setContactSending(false);
      setContactSubmitted(true);
      setTimeout(() => setContactSubmitted(false), 6000);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setContactSending(false);
      const errorMessage =
        err instanceof Error ? err.message : "Transmission failed. Please email directly.";
      setContactError(errorMessage);
      setTimeout(() => setContactError(null), 8000);
    }
  };

  // Clean, high-impact categorized tech stack list without clutter
  const techCategories = [
    {
      title: "Backend Core & Systems",
      badge: "CORE STACK",
      accent: "bg-[#A3E635]",
      border: "border-black dark:border-zinc-700",
      skills: [
        { name: "Node.js", icon: Server },
        { name: "Express.js", icon: Terminal },
        { name: "REST APIs", icon: Zap },
        { name: "JWT & RBAC", icon: KeyRound },
        { name: "Socket.IO", icon: Radio },
        { name: "Agora SDK", icon: Zap },
        { name: "Redis", icon: Database },
        { name: "BullMQ", icon: Clock },
        { name: "Razorpay & Shiprocket", icon: ArrowUpRight },
      ],
    },
    {
      title: "Databases, DevOps & Cloud",
      badge: "INFRASTRUCTURE",
      accent: "bg-[#38BDF8]",
      border: "border-black dark:border-zinc-700",
      skills: [
        { name: "MongoDB & Mongoose", icon: Database },
        { name: "Supabase", icon: Database },
        { name: "Docker", icon: Layers },
        { name: "AWS S3", icon: Server },
        { name: "Cloudinary", icon: Layers },
        { name: "Vercel & Render", icon: ArrowUpRight },
      ],
    },
    {
      title: "Languages & Frontend",
      badge: "LANGUAGES & UI",
      accent: "bg-[#FFD23F]",
      border: "border-black dark:border-zinc-700",
      skills: [
        { name: "JavaScript (ES6+)", icon: Code2 },
        { name: "TypeScript", icon: ShieldCheck },
        { name: "Java", icon: Server },
        { name: "React.js", icon: Layers },
        { name: "Next.js", icon: Zap },
        { name: "Tailwind CSS", icon: Code2 },
      ],
    },
  ];

  const workExperience = [
    {
      role: "Backend Developer (Node.js)",
      company: "Wayone IT Solutions",
      location: "Delhi, India",
      period: "Sep 2025 – Apr 2026",
      badge: "Full-Time",
      accent: "bg-[#A3E635]",
      points: [
        "Architected and deployed high-throughput Node.js & Express REST APIs with modular middleware architectures.",
        "Constructed complex MongoDB aggregation pipelines, query optimizations, and multi-tenant indexing strategies.",
        "Implemented enterprise-grade JWT authentication and granular Role-Based Access Control (RBAC) security protocols.",
        "Engineered end-to-end payment gateway workflows (Razorpay) and automated shipping fulfillment sync (Shiprocket).",
        "Built Hello Her real-time audio chat & low-latency messaging microservices leveraging Socket.IO and Agora RTC SDK.",
      ],
      tags: ["Node.js", "Express.js", "MongoDB", "Socket.IO", "Agora SDK", "Razorpay", "BullMQ"],
    },
    {
      role: "Web Developer Intern",
      company: "Code Eternity",
      location: "Noida, India",
      period: "Apr 2025 – Jul 2025",
      badge: "Internship",
      accent: "bg-[#FFD23F]",
      points: [
        "Developed Cryptalk: a secure messaging application emphasizing end-to-end encryption and ephemeral session handling.",
        "Engineered Style Sphere: a full-stack e-commerce web platform with cart persistency, inventory management, and checkout flows.",
        "Integrated responsive React frontends with scalable Node.js/Express micro-endpoints and MongoDB storage.",
      ],
      tags: ["React.js", "Node.js", "MongoDB", "Cryptography", "RESTful APIs", "Tailwind CSS"],
    },
  ];

  const projects = [
    {
      name: "MSSST Trust Platform",
      domain: "mssst.in",
      tagline: "Community welfare & verified membership platform",
      accent: "bg-[#FFD23F]",
      stats: "50% Boilerplate Reduced",
      description:
        "High-reliability community welfare infrastructure featuring automated multi-step applicant verification, Cloudinary/AWS S3 document vaults, and an extensible architecture.",
      highlights: [
        "Created an abstract CommonService controller layer reducing repetitive CRUD boilerplate code by 50%.",
        "Hardened with Bcrypt hashing, Helmet HTTP headers, strict CORS, and Redis rate-limiting policies.",
        "Robust document uploads pipeline with auto-format conversions to AWS S3 & Cloudinary.",
      ],
      stack: ["Node.js", "Express.js", "MongoDB", "AWS S3", "Cloudinary", "Bcrypt", "Helmet"],
      liveUrl: "https://mssst.in",
      repoUrl: "https://github.com/iamarpitsharma",
    },
    {
      name: "Lofi Radio",
      domain: "lofiradio.in",
      tagline: "Real-time sync web audio station & listener presence",
      accent: "bg-[#A3E635]",
      stats: "1-Hour Cache",
      description:
        "Ambient live audio streaming web application integrating YouTube Iframe audio streams with server-side playlist parsing and low-latency listener rooms.",
      highlights: [
        "Implemented server-side automated playlist parser with a resilient 1-hour cache invalidation strategy.",
        "Synchronized listener counters and real-time room presence using Supabase Realtime Presence channels.",
        "Distraction-free, responsive web audio client with custom playback event hooks.",
      ],
      stack: ["Next.js", "TypeScript", "Supabase Realtime", "YouTube API", "Tailwind CSS"],
      liveUrl: "https://lofiradio.in",
      repoUrl: "https://github.com/iamarpitsharma",
    },
    {
      name: "Amrawati Computer Center",
      domain: "amrawaticomputer.org",
      tagline: "Full-stack digital service hub, training portal & admin ecosystem",
      accent: "bg-[#a684ff]",
      stats: "Admin Panel",
      description:
        "Comprehensive digital transformation portal for an established training center and service hub, featuring a modular Next.js frontend, secure TypeScript backend, and a dynamic role-based admin dashboard.",
      highlights: [
        "Engineered a unified platform combining student course management, a live product catalog with shelf locators, and a government notifications bulletin board.",
        "Built a modular TypeScript/Express backend with abstract controllers, JWT authentication, and secure file uploads.",
        "Designed a high-performance administrative control center with dynamic form generators and automated table views.",
      ],
      stack: ["Next.js", "React", "TypeScript", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
      liveUrl: "https://www.amrawaticomputer.org",
      repoUrl: "https://github.com/iamarpitsharma",
    },
    {
      name: "Success Library",
      domain: "successlibrary.in",
      tagline: "Smart study facility & concurrent seat management system",
      accent: "bg-[#38BDF8]",
      stats: "Concurrent Booking",
      description:
        "End-to-end digital management system for a premium study library, equipped with real-time seat tracking, automated membership lifecycle updates, and an admin dashboard.",
      highlights: [
        "Developed concurrent seat allocation workflows allowing administrators to seamlessly assign, swap, and release study slots.",
        "Built automated subscription tracking and student record management to minimize administrative friction.",
        "Integrated a clean, responsive student-facing portal highlighting facility amenities, shift timings, and seat availability.",
      ],
      stack: ["Next.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "TypeScript"],
      liveUrl: "https://success-library-homepage.vercel.app",
      repoUrl: "https://github.com/iamarpitsharma",
    },
    {
      name: "Hello Her",
      domain: "helloher.in",
      tagline: "Real-time communication, voice calling & live events platform",
      accent: "bg-[#EC4899]",
      stats: "Low-Latency WebRTC",
      description:
        "Scalable real-time communication platform featuring Agora-powered voice calling, Socket.IO live chat channels, push notifications, and third-party OTP verification.",
      highlights: [
        "Architected robust backend modules using Node.js and Socket.IO for instant messaging, live event notifications, and user presence.",
        "Integrated Agora SDK to enable high-quality, low-latency real-time voice calling.",
        "Implemented secure authentication pipelines featuring third-party SMS APIs for instant OTP verification.",
      ],
      stack: ["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "Socket.IO", "Agora SDK", "MongoDB", "TypeScript", "Encryption"],
      liveUrl: "https://helloher.in",
      repoUrl: "https://github.com/iamarpitsharma",
    },
    {
      name: "Future Past E-Commerce",
      domain: "futurepast.in",
      tagline: "Transactional order management & logistics workflow",
      accent: "bg-[#F97316]",
      stats: "Shiprocket Integration",
      description:
        "Full-stack e-commerce platform and backend engine supporting product reselling, secure payment verification, and automated shipping synchronization.",
      highlights: [
        "Integrated Razorpay payment gateways to coordinate secure transaction processing and order creation workflows.",
        "Automated fulfillment pipelines via Shiprocket REST APIs for live tracking and delivery-status updates.",
        "Engineered secure admin panel backends for inventory control, order auditing, and status lifecycle management.",
      ],
      stack: ["Node.js", "Express.js", "MongoDB", "Razorpay API", "Shiprocket API", "TypeScript", "Tailwind CSS", "Next.js"],
      liveUrl: "https://futurepast.in",
      repoUrl: "https://github.com/iamarpitsharma",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#121212] text-black dark:text-zinc-100 transition-colors duration-200">
      {/* Top Command Bar & Global Header with uniform height navbar items */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-[#FFFDF5] dark:bg-[#121212] border-b-[3px] border-black dark:border-zinc-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo / Brand Ident */}
          <div className="flex items-center gap-3">
            <a
              href="#hero"
              onClick={(e) => handleSmoothScroll(e, "hero")}
              className="h-10.5 flex items-center gap-2 font-mono font-bold text-base sm:text-lg tracking-tight bg-[#FFD23F] text-black px-3.5 border-[3px] border-black shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform cursor-pointer"
            >
              <Terminal className="w-5 h-5" />
              <span>ARPIT.SHARMA</span>
            </a>
          </div>

          {/* Quick Actions (Theme Switcher and Mobile Menu) */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button: In dark mode, Sun icon is bright yellow with clear contrast */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              aria-label="Toggle Light and Dark Mode"
              className="h-10.5 w-10.5 flex items-center justify-center bg-white dark:bg-[#1A1A1A] text-black dark:text-zinc-100 border-[3px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#3F3F46] hover:bg-[#FFD23F] dark:hover:bg-[#FFD23F] dark:hover:text-black transition-colors cursor-pointer"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-black" />
              ) : (
                <Sun className="w-5 h-5 text-[#FFD23F] hover:text-black transition-colors" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-10.5 w-10.5 flex items-center justify-center bg-white dark:bg-[#1A1A1A] text-black dark:text-zinc-100 border-[3px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#3F3F46] cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-[3px] border-black dark:border-zinc-700 bg-[#FFFDF5] dark:bg-[#121212] p-4 flex flex-col gap-3">
            <a
              href="#hero"
              onClick={(e) => handleSmoothScroll(e, "hero")}
              className={`flex items-center gap-3 p-3 font-mono font-bold text-sm border-[2px] border-black dark:border-zinc-700 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] cursor-pointer transition-colors ${activeSection === "hero"
                ? "bg-[#FFD23F] text-black"
                : "bg-white dark:bg-[#1A1A1A] text-black dark:text-zinc-100"
                }`}
            >
              <Terminal className={`w-4 h-4 ${activeSection === "hero" ? "text-black" : "text-black dark:text-[#FFD23F]"}`} /> Command Center
            </a>
            <a
              href="#tech-stack"
              onClick={(e) => handleSmoothScroll(e, "tech-stack")}
              className={`flex items-center gap-3 p-3 font-mono font-bold text-sm border-[2px] border-black dark:border-zinc-700 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] cursor-pointer transition-colors ${activeSection === "tech-stack"
                ? "bg-[#A3E635] text-black"
                : "bg-white dark:bg-[#1A1A1A] text-black dark:text-zinc-100"
                }`}
            >
              <Cpu className={`w-4 h-4 ${activeSection === "tech-stack" ? "text-black" : "text-black dark:text-[#A3E635]"}`} /> Tech Stack & Capabilities
            </a>
            <a
              href="#experience"
              onClick={(e) => handleSmoothScroll(e, "experience")}
              className={`flex items-center gap-3 p-3 font-mono font-bold text-sm border-[2px] border-black dark:border-zinc-700 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] cursor-pointer transition-colors ${activeSection === "experience"
                ? "bg-[#38BDF8] text-black"
                : "bg-white dark:bg-[#1A1A1A] text-black dark:text-zinc-100"
                }`}
            >
              <Briefcase className={`w-4 h-4 ${activeSection === "experience" ? "text-black" : "text-black dark:text-[#38BDF8]"}`} /> Work Experience
            </a>
            <a
              href="#projects"
              onClick={(e) => handleSmoothScroll(e, "projects")}
              className={`flex items-center gap-3 p-3 font-mono font-bold text-sm border-[2px] border-black dark:border-zinc-700 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] cursor-pointer transition-colors ${activeSection === "projects"
                ? "bg-[#FF6B6B] text-black"
                : "bg-white dark:bg-[#1A1A1A] text-black dark:text-zinc-100"
                }`}
            >
              <FolderGit2 className={`w-4 h-4 ${activeSection === "projects" ? "text-black" : "text-black dark:text-[#FF6B6B]"}`} /> Featured Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "contact")}
              className={`flex items-center gap-3 p-3 font-mono font-bold text-sm border-[2px] border-black dark:border-zinc-700 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] cursor-pointer transition-colors ${activeSection === "contact"
                ? "bg-[#C084FC] text-black"
                : "bg-white dark:bg-[#1A1A1A] text-black dark:text-zinc-100"
                }`}
            >
              <Mail className={`w-4 h-4 ${activeSection === "contact" ? "text-black" : "text-black dark:text-[#C084FC]"}`} /> Contact Me
            </a>
            <div className="flex items-center gap-2 p-2.5 bg-[#A3E635] text-black font-mono font-bold text-xs border-[2px] border-black">
              <CheckCircle className="w-4 h-4" /> Available for Hire in Bengaluru
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay on mobile: closes navbar on tap outside */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Layout Container (Sidebar + Content Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sticky Desktop Left Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 flex flex-col gap-6">
            {/* Profile Neo-Box */}
            <div className="bg-white dark:bg-[#1A1A1A] border-[3px] border-black dark:border-zinc-700 shadow-[5px_5px_0_0_#000] dark:shadow-[5px_5px_0_0_#3F3F46] p-4">
              <div className="relative w-full h-48 bg-[#FFD23F] border-[3px] border-black dark:border-zinc-700 overflow-hidden mb-4 shadow-[3px_3px_0_0_#000]">
                <Image
                  src="/Arpit.jpg"
                  alt="Arpit Sharma"
                  fill
                  sizes="220px"
                  priority
                  className="object-cover object-center grayscale contrast-110 hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <h2 className="text-xl font-bold font-mono tracking-tight">Arpit Sharma</h2>
              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" /> Bengaluru, India
              </p>

              {/* Status Indicator */}
              <div className="mt-4 p-2 bg-[#A3E635] text-black border-[2px] border-black shadow-[2px_2px_0_0_#000] flex items-center gap-2 font-mono text-xs font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Open to Backend Roles</span>
              </div>
            </div>

            {/* Sidebar Navigation with dynamic active highlight & smooth scroll */}
            <nav className="bg-white dark:bg-[#1A1A1A] border-[3px] border-black dark:border-zinc-700 shadow-[5px_5px_0_0_#000] dark:shadow-[5px_5px_0_0_#3F3F46] p-3 flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-500 px-2 py-1">
                Navigation
              </span>
              <a
                href="#hero"
                onClick={(e) => handleSmoothScroll(e, "hero")}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-mono font-bold transition-all cursor-pointer ${activeSection === "hero"
                  ? "bg-[#FFD23F] text-black border-[2px] border-black shadow-[3px_3px_0_0_#000] translate-x-1"
                  : "hover:bg-[#FFD23F] hover:text-black border-[2px] border-transparent hover:border-black text-black dark:text-zinc-200"
                  }`}
              >
                <Terminal className="w-4 h-4" /> Command Center
              </a>
              <a
                href="#tech-stack"
                onClick={(e) => handleSmoothScroll(e, "tech-stack")}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-mono font-bold transition-all cursor-pointer ${activeSection === "tech-stack"
                  ? "bg-[#A3E635] text-black border-[2px] border-black shadow-[3px_3px_0_0_#000] translate-x-1"
                  : "hover:bg-[#A3E635] hover:text-black border-[2px] border-transparent hover:border-black text-black dark:text-zinc-200"
                  }`}
              >
                <Cpu className="w-4 h-4" /> Tech Stack
              </a>
              <a
                href="#experience"
                onClick={(e) => handleSmoothScroll(e, "experience")}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-mono font-bold transition-all cursor-pointer ${activeSection === "experience"
                  ? "bg-[#38BDF8] text-black border-[2px] border-black shadow-[3px_3px_0_0_#000] translate-x-1"
                  : "hover:bg-[#38BDF8] hover:text-black border-[2px] border-transparent hover:border-black text-black dark:text-zinc-200"
                  }`}
              >
                <Briefcase className="w-4 h-4" /> Work Experience
              </a>
              <a
                href="#projects"
                onClick={(e) => handleSmoothScroll(e, "projects")}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-mono font-bold transition-all cursor-pointer ${activeSection === "projects"
                  ? "bg-[#FF6B6B] text-black border-[2px] border-black shadow-[3px_3px_0_0_#000] translate-x-1"
                  : "hover:bg-[#FF6B6B] hover:text-black border-[2px] border-transparent hover:border-black text-black dark:text-zinc-200"
                  }`}
              >
                <FolderGit2 className="w-4 h-4" /> Projects
              </a>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, "contact")}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-mono font-bold transition-all cursor-pointer ${activeSection === "contact"
                  ? "bg-[#C084FC] text-black border-[2px] border-black shadow-[3px_3px_0_0_#000] translate-x-1"
                  : "hover:bg-[#C084FC] hover:text-black border-[2px] border-transparent hover:border-black text-black dark:text-zinc-200"
                  }`}
              >
                <Mail className="w-4 h-4" /> Contact Me
              </a>
            </nav>

            {/* External Links Neo-Box */}
            <div className="bg-white dark:bg-[#1A1A1A] border-[3px] border-black dark:border-zinc-700 shadow-[5px_5px_0_0_#000] dark:shadow-[5px_5px_0_0_#3F3F46] p-3 flex flex-col gap-2 font-mono text-xs">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-500 px-2 py-1">
                External Profiles
              </span>
              <a
                href="https://github.com/iamarpitsharma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 border-[2px] border-black dark:border-zinc-700 bg-[#FFFDF5] dark:bg-[#121212] hover:bg-[#FFD23F] hover:text-black transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <GitFork className="w-4 h-4" /> GitHub
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com/in/iarpitsharma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 border-[2px] border-black dark:border-zinc-700 bg-[#FFFDF5] dark:bg-[#121212] hover:bg-[#38BDF8] hover:text-black transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> LinkedIn
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/Arpit Resume.pdf"
                download="Arpit_Sharma_Resume.pdf"
                className="flex items-center justify-between px-3 py-2 border-[2px] border-black dark:border-zinc-700 bg-[#FFFDF5] dark:bg-[#121212] hover:bg-[#A3E635] hover:text-black transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Resume PDF
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-12 w-full overflow-hidden">
          {/* SECTION 1: HERO COMMAND CENTER SECTION */}
          <section id="hero" className="w-full scroll-mt-24">
            <div className="bg-white dark:bg-[#1A1A1A] border-[3px] border-black dark:border-zinc-700 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#3F3F46] p-6 sm:p-8">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b-[3px] border-black dark:border-zinc-700">
                <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs font-bold truncate">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#FF6B6B] border-[2px] border-black dark:border-zinc-700 shrink-0" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#FFD23F] border-[2px] border-black dark:border-zinc-700 shrink-0" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#A3E635] border-[2px] border-black dark:border-zinc-700 shrink-0" />
                  <span className="ml-1 sm:ml-2 block sm:hidden truncate">DEV://ARPIT_SHARMA.EXE</span>
                  <span className="ml-1 sm:ml-2 hidden sm:block truncate">DEV://BENGALURU/ARPIT_SHARMA.EXE</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-xs bg-[#A3E635] text-black px-2 sm:px-2.5 py-1 border-[2px] border-black font-bold shrink-0">
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>ONLINE & AVAILABLE</span>
                </div>
              </div>

              {/* Title & Headline */}
              <div className="space-y-4">
                <div className="inline-block bg-[#FFD23F] text-black px-3 py-1 text-xs font-mono font-bold border-[2px] border-black shadow-[3px_3px_0_0_#000]">
                  SYSTEM_ROLE: BACKEND_DEVELOPER
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight leading-tight">
                  Arpit Sharma — <br />
                  <span className="bg-black text-[#A3E635] dark:bg-zinc-100 dark:text-black px-2 py-0.5 inline-block mt-1 whitespace-nowrap text-2xl sm:text-5xl lg:text-6xl">
                    Backend Developer
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans max-w-3xl leading-relaxed pt-2">
                  Specialized in architecting high-performance server-side architectures, robust REST APIs,
                  database aggregation pipelines, and secure real-time microservices. Based in Bengaluru,
                  engineering scalable backends that do not fail under peak load.
                </p>
              </div>

              {/* Live Status Ticker */}
              <div className="mt-6 p-4 bg-[#FFFDF5] dark:bg-[#121212] border-[3px] border-black dark:border-zinc-700 shadow-[5px_5px_0_0_#000] dark:shadow-[5px_5px_0_0_#3F3F46]">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 bg-[#FFD23F] text-black border-[2px] border-black shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase font-bold text-zinc-500 block">
                      Core Specialty
                    </span>
                    <p className="font-mono text-xs sm:text-sm font-bold text-black dark:text-zinc-100 mt-0.5">
                      Building robust Node.js/Express.js REST APIs, JWT/RBAC security, and MongoDB aggregation pipelines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Unified responsive grid (equal height, equal sizing, no awkward single buttons on mobile) */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
                <a
                  href="#projects"
                  onClick={(e) => handleSmoothScroll(e, "projects")}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#FFD23F] text-black font-mono font-bold text-xs sm:text-sm border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform cursor-pointer"
                >
                  <FolderGit2 className="w-4 h-4 shrink-0" />
                  <span>Explore Projects</span>
                </a>

                <a
                  href="/Arpit Resume.pdf"
                  download="Arpit_Sharma_Resume.pdf"
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#A3E635] text-black font-mono font-bold text-xs sm:text-sm border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform cursor-pointer"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Download Resume</span>
                </a>

                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "contact")}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-white dark:bg-[#1A1A1A] text-black dark:text-zinc-100 font-mono font-bold text-xs sm:text-sm border-[3px] border-black dark:border-zinc-700 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#3F3F46] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform cursor-pointer"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Get in Touch</span>
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 2: TECH STACK & CAPABILITIES (Crisp, High-Impact Modern Neo-Brutalist Layout) */}
          <section id="tech-stack" className="w-full scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#A3E635] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000]">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
                  TECH STACK & CAPABILITIES
                </h2>
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  Production-grade backend systems, frameworks, databases, and tooling
                </p>
              </div>
            </div>

            {/* Categorized Visual Bento Layout */}
            <div className="flex flex-col gap-6">
              {techCategories.map((cat, catIdx) => {
                const isExpanded = expandedCategories.includes(catIdx);
                const toggleCategory = () => {
                  setExpandedCategories((prev) =>
                    prev.includes(catIdx)
                      ? prev.filter((i) => i !== catIdx)
                      : [...prev, catIdx]
                  );
                };

                return (
                  <div
                    key={catIdx}
                    className="bg-white dark:bg-[#1A1A1A] border-[3px] border-black dark:border-zinc-700 shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#3F3F46] p-4 sm:p-6"
                  >
                    {/* Header: clickable button on mobile to toggle collapse, static header on desktop */}
                    <div
                      onClick={toggleCategory}
                      className="flex items-center justify-between pb-3.5 border-b-[2px] border-black dark:border-zinc-700 cursor-pointer sm:cursor-default select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`px-3 py-1 text-xs font-mono font-bold border-[2px] border-black text-black shrink-0 whitespace-nowrap ${cat.accent}`}
                        >
                          {cat.badge}
                        </span>
                        <h3 className="font-mono font-black text-base sm:text-lg tracking-tight truncate">
                          {cat.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Hidden on mobile, visible on sm and up */}
                        <span className="hidden sm:inline font-mono text-xs font-bold text-zinc-500">
                          {cat.skills.length} ITEMS
                        </span>
                        {/* Mobile collapse toggle indicator */}
                        <button
                          type="button"
                          aria-label={isExpanded ? "Collapse category" : "Expand category"}
                          className="sm:hidden flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-1 bg-[#FFFDF5] dark:bg-[#222] border-[1.5px] border-black dark:border-zinc-600 shadow-[1.5px_1.5px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                        >
                          <span>{isExpanded ? "HIDE" : "SHOW"}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"
                              }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Enhanced responsive grid design: animated collapse on mobile, always visible on sm+ */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0 sm:grid-rows-[1fr] sm:opacity-100"
                        }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                          {cat.skills.map((skill, sIdx) => {
                            const Icon = skill.icon;
                            return (
                              <div
                                key={sIdx}
                                className="flex items-center justify-between p-3 bg-[#FFFDF5] dark:bg-[#141414] border-[2px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#3F3F46] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_#3F3F46] transition-all cursor-default group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="p-2 bg-white dark:bg-[#222] border-[1.5px] border-black dark:border-zinc-700 text-black dark:text-zinc-100 group-hover:bg-[#FFD23F] group-hover:text-black transition-colors shrink-0">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="font-mono text-xs sm:text-sm font-bold text-black dark:text-zinc-100 truncate tracking-tight">
                                    {skill.name}
                                  </span>
                                </div>
                                <span className="w-2 h-2 rounded-none bg-black dark:bg-zinc-700 group-hover:bg-[#A3E635] transition-colors shrink-0 ml-2" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: WORK EXPERIENCE SECTION */}
          <section id="experience" className="w-full scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#38BDF8] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000]">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
                  WORK EXPERIENCE
                </h2>
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  Engineering roles, milestones, and high-impact backend contributions
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {workExperience.map((job, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#1A1A1A] border-[3px] border-black dark:border-zinc-700 shadow-[5px_5px_0_0_#000] dark:shadow-[5px_5px_0_0_#3F3F46] p-6 relative"
                >
                  {/* Top Bar with Role & Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-[2px] border-black dark:border-zinc-700">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-mono text-xs font-extrabold px-2.5 py-0.5 border-[2px] border-black text-black ${job.accent}`}
                        >
                          {job.badge}
                        </span>
                        <h3 className="text-lg sm:text-xl font-mono font-bold">{job.role}</h3>
                      </div>
                      <div className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-black dark:text-zinc-100">{job.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF6B6B]" /> {job.location}
                        </span>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-bold px-3 py-1.5 bg-[#FFFDF5] dark:bg-[#121212] border-[2px] border-black dark:border-zinc-700 shrink-0 self-start sm:self-center shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {job.period}
                    </div>
                  </div>

                  {/* Bullet points */}
                  <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-sans text-zinc-800 dark:text-zinc-200">
                    {job.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <span className="p-0.5 bg-black dark:bg-zinc-100 text-white dark:text-black font-mono text-[10px] mt-1 shrink-0 font-bold">
                          {">"}
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack pill tags */}
                  <div className="mt-5 pt-4 border-t-[2px] border-dashed border-black/40 dark:border-zinc-700 flex flex-wrap gap-2">
                    {job.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 text-xs font-mono font-bold bg-[#FFFDF5] dark:bg-[#121212] border-[2px] border-black dark:border-zinc-700 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: PROJECTS SECTION */}
          <section id="projects" className="w-full scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#FF6B6B] text-white border-[3px] border-black shadow-[3px_3px_0_0_#000]">
                <FolderGit2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
                  FEATURED PROJECTS
                </h2>
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  Production-grade web apps, APIs, and real-time platforms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((proj, pIdx) => (
                <div
                  key={pIdx}
                  className="bg-white dark:bg-[#1A1A1A] border-[3px] border-black dark:border-zinc-700 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#3F3F46] flex flex-col justify-between"
                >
                  <div>
                    {/* Project Header Bar */}
                    <div className="p-4 border-b-[3px] border-black dark:border-zinc-700 flex items-center justify-between bg-[#FFFDF5] dark:bg-[#121212]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 border-[2px] border-black text-black ${proj.accent}`}
                        >
                          PROD://{proj.domain}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-black text-white dark:bg-zinc-100 dark:text-black">
                        {proj.stats}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl sm:text-2xl font-black font-mono tracking-tight">
                        {proj.name}
                      </h3>
                      <p className="font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
                        {proj.tagline}
                      </p>

                      <p className="mt-4 text-xs sm:text-sm font-sans leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {proj.description}
                      </p>

                      <div className="mt-4 p-3 bg-[#FFFDF5] dark:bg-[#121212] border-[2px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#3F3F46]">
                        <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 block mb-2">
                          Engineering Highlights
                        </span>
                        <ul className="space-y-1.5 text-xs font-sans">
                          {proj.highlights.map((h, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2">
                              <span className="text-[#A3E635] font-bold">✓</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="p-6 pt-0">
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {proj.stack.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 font-mono text-[11px] font-bold bg-white dark:bg-[#222] border-[1.5px] border-black dark:border-zinc-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t-[2px] border-black dark:border-zinc-700">
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 bg-[#FFD23F] text-black font-mono font-bold text-xs text-center border-[2px] border-black shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Visit Live
                        {/* ({proj.domain}) */}
                      </a>
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-white dark:bg-[#1A1A1A] text-black dark:text-zinc-100 font-mono font-bold text-xs border-[2px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#3F3F46] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex items-center gap-1.5 cursor-pointer"
                      >
                        <GitFork className="w-3.5 h-3.5" /> Code
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: CONTACT ME SECTION */}
          <section id="contact" className="w-full scroll-mt-24 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#C084FC] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
                  GET IN TOUCH
                </h2>
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  Direct channels for hiring, engineering queries, or collaboration
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] border-[3px] border-black dark:border-zinc-700 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#3F3F46] p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left side: Direct contact badges */}
                <div className="lg:col-span-2 flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="font-mono text-xl font-bold">Contact Coordinates</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
                      Currently based in Bengaluru, open to both full-time on-site backend positions and remote opportunities.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 font-mono text-xs">
                      {/* Email Badge */}
                      <a
                        href="mailto:arpitsharma684@gmail.com"
                        className="p-3 bg-[#FFFDF5] dark:bg-[#121212] border-[2px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#3F3F46] hover:bg-[#FFD23F] hover:text-black transition-colors block cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-[#FFD23F] group-hover:text-black transition-colors" /> Direct Email
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-sm block mt-1 break-all">
                          arpitsharma684@gmail.com
                        </span>
                      </a>

                      {/* Phone Badge */}
                      <a
                        href="tel:+918765710580"
                        className="p-3 bg-[#FFFDF5] dark:bg-[#121212] border-[2px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#3F3F46] hover:bg-[#A3E635] hover:text-black transition-colors block cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-[#A3E635] group-hover:text-black transition-colors" /> Phone / WhatsApp
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-sm block mt-1">
                          +91 8765710580
                        </span>
                      </a>

                      {/* LinkedIn Badge */}
                      <a
                        href="https://linkedin.com/in/iarpitsharma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-[#FFFDF5] dark:bg-[#121212] border-[2px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#3F3F46] hover:bg-[#38BDF8] hover:text-black transition-colors block cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 group-hover:text-zinc-900 uppercase font-bold flex items-center gap-2">
                            <Share2 className="w-4.5 h-4.5 text-[#0284C7] dark:text-[#38BDF8] group-hover:text-[#BAE6FD] group-hover:drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] transition-all" />
                            <span>LinkedIn Profile</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-black" />
                        </div>
                        <span className="font-bold text-sm block mt-1">
                          linkedin.com/in/iarpitsharma
                        </span>
                      </a>

                      {/* GitHub Badge */}
                      <a
                        href="https://github.com/iamarpitsharma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-[#FFFDF5] dark:bg-[#121212] border-[2px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#3F3F46] hover:bg-[#FF6B6B] hover:text-white transition-colors block cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 group-hover:text-white uppercase font-bold flex items-center gap-2">
                            <GitFork className="w-4.5 h-4.5 text-[#DC2626] dark:text-[#FF6B6B] group-hover:text-[#FECDD3] group-hover:drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] transition-all" />
                            <span>GitHub Organization</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-white" />
                        </div>
                        <span className="font-bold text-sm block mt-1">
                          github.com/iamarpitsharma
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Availability badge */}
                  <div className="p-3 bg-[#A3E635] text-black border-[2px] border-black font-mono text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Immediate joiner for backend engineering roles in Bengaluru.</span>
                  </div>
                </div>

                {/* Right side: Interactive Contact Form with crystal-clear dynamic placeholder contrast */}
                <div className="lg:col-span-3 bg-[#FFFDF5] dark:bg-[#121212] border-[3px] border-black dark:border-zinc-700 shadow-[5px_5px_0_0_#000] dark:shadow-[5px_5px_0_0_#3F3F46] p-6">
                  <h4 className="font-mono text-base font-bold mb-4 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#FFD23F]" /> Send a Direct Transmission
                  </h4>

                  {contactSubmitted && (
                    <div className="mb-4 p-3 bg-[#A3E635] text-black border-[2px] border-black font-mono text-xs font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0" /> Message transmission confirmed! I will get back to you shortly.
                    </div>
                  )}

                  {contactError && (
                    <div className="mb-4 p-3 bg-[#FF6B6B] text-black border-[2px] border-black font-mono text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {contactError}
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs font-bold uppercase mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, name: e.target.value })
                          }
                          placeholder="Arpit Sharma"
                          disabled={contactSending}
                          className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#1A1A1A] text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 border-[2px] border-black dark:border-zinc-700 rounded-none shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] focus:outline-none focus:bg-[#FFD23F] focus:text-black focus:placeholder:text-zinc-700 disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs font-bold uppercase mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, email: e.target.value })
                          }
                          placeholder="arpit@tech.co"
                          disabled={contactSending}
                          className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#1A1A1A] text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 border-[2px] border-black dark:border-zinc-700 rounded-none shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] focus:outline-none focus:bg-[#FFD23F] focus:text-black focus:placeholder:text-zinc-700 disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        Subject / Project / Opportunity
                      </label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, subject: e.target.value })
                        }
                        placeholder="Need backend developer for custom SaaS / Backend Role"
                        disabled={contactSending}
                        className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#1A1A1A] text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 border-[2px] border-black dark:border-zinc-700 rounded-none shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] focus:outline-none focus:bg-[#FFD23F] focus:text-black focus:placeholder:text-zinc-700 disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        Message / Project Brief *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, message: e.target.value })
                        }
                        placeholder="Hey Arpit, we want to build a high-performance backend / discuss a project or role..."
                        disabled={contactSending}
                        className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#1A1A1A] text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 border-[2px] border-black dark:border-zinc-700 rounded-none shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#3F3F46] focus:outline-none focus:bg-[#FFD23F] focus:text-black focus:placeholder:text-zinc-700 disabled:opacity-60"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactSending}
                      className="w-full py-3 px-4 bg-[#FFD23F] text-black font-mono font-bold text-sm border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {contactSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> TRANSMITTING TRANSMISSION...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> TRANSMIT MESSAGE
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* INFINITE MARQUEE TICKER (Moving Left-to-Right smoothly above footer) */}
          <div className="-mt-9 -mb-9">
            <InfiniteMarquee />
          </div>

          {/* Footer Bar: Flush at the exact base line with zero bottom space */}
          <footer className="pt-2 pb-0 mb-0 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#A3E635] inline-block shrink-0" />
              <span>
                Engineered with high precision by{" "}
                <strong className="text-black dark:text-zinc-100 font-bold">
                  Arpit Sharma
                </strong>{" "}
                — Bengaluru, India
              </span>
            </div>
          </footer>
        </main>
      </div>

      {/* Floating Back to Top Button: Compact size & only visible when user reaches bottom */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 h-8 w-8 flex items-center justify-center bg-[#FFD23F] text-black border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] active:translate-y-0.5 transition-all cursor-pointer animate-in fade-in duration-200"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
