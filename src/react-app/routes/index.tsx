import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ListTodo,
  Zap,
  Calendar,
  ArrowRight,
  Star,
  BarChart3,
  Clock,
  CheckCircle2,
  Sparkles,
  Target,
  TrendingUp,
  Moon,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Play,
  Menu,
  X,
  Mic,
  Globe,
} from "lucide-react";
import { getSession } from "@/lib/auth-client";
import { motion, useInView, AnimatePresence, type Easing } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await getSession();
    if (data?.session) {
      redirect({ to: "/dashboard", throw: true });
    }
  },
  component: LandingPage,
});

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};



// Custom hook for scroll animations
function useScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return { ref, isInView };
}

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return { count, ref };
}

// Data
const features = [
  {
    icon: <Mic className="h-6 w-6" />,
    title: "Voice Input",
    description: "Speak to create tasks in 15+ languages including Urdu, Pashto, Balochi, and regional Pakistani languages.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Multi-Language Support",
    description: "AI-powered transcription supporting English, Urdu, Punjabi, Sindhi, Pashto, Balochi, Shina, Khowar & more.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: <ListTodo className="h-6 w-6" />,
    title: "Task Management",
    description: "Create, edit, and organize tasks with priorities, due dates, and descriptions.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Kanban Boards",
    description: "Touch-friendly drag-and-drop task organization with smooth animations.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Dashboard Analytics",
    description: "Real-time stats with animated counters and progress tracking.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Smart Tags & Labels",
    description: "Color-coded tags with filtering to organize tasks your way.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Due Date Tracking",
    description: "Calendar picker with smart overdue detection and relative dates.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Keyboard Shortcuts",
    description: "Power user shortcuts with Cmd+K command palette for fast navigation.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: <Moon className="h-6 w-6" />,
    title: "Dark & Light Mode",
    description: "Beautiful themes that adapt to your preference automatically.",
    gradient: "from-slate-500 to-gray-500",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Priority System",
    description: "Four-level priority with visual indicators: Urgent, High, Medium, Low.",
    gradient: "from-teal-500 to-cyan-500",
  },
];

const testimonials = [
  {
    quote: "TaskFlow's Kanban board transformed our sprint planning. The drag-and-drop is incredibly smooth.",
    author: "Ahmed Hassan",
    role: "Tech Lead",
    company: "Islamabad Tech",
    avatar: "AH",
    rating: 5,
  },
  {
    quote: "The priority system and due date tracking help me never miss a deadline. Confetti on completion is a nice touch!",
    author: "Fatima Khan",
    role: "Project Manager",
    company: "Karachi Digital",
    avatar: "FK",
    rating: 5,
  },
  {
    quote: "Clean interface with powerful features. The command palette saves me so much time navigating.",
    author: "Bilal Ahmed",
    role: "Software Engineer",
    company: "Lahore Solutions",
    avatar: "BA",
    rating: 5,
  },
  {
    quote: "Finally a task manager that looks beautiful in dark mode. The animations make it enjoyable to use.",
    author: "Sara Malik",
    role: "UI/UX Designer",
    company: "Creative Studio",
    avatar: "SM",
    rating: 5,
  },
  {
    quote: "The tag filtering system is exactly what we needed to organize our complex workflows.",
    author: "Usman Ali",
    role: "Operations Manager",
    company: "Peshawar Logistics",
    avatar: "UA",
    rating: 5,
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Create Account",
    description: "Sign up with email in seconds. Password strength indicator helps you stay secure.",
    icon: <Sparkles className="h-8 w-8" />,
  },
  {
    step: 2,
    title: "Add Tasks",
    description: "Create tasks with title, description, priority, due dates, and color-coded tags.",
    icon: <ListTodo className="h-8 w-8" />,
  },
  {
    step: 3,
    title: "Organize",
    description: "Use the Kanban board to drag tasks between To Do, In Progress, and Completed.",
    icon: <Target className="h-8 w-8" />,
  },
  {
    step: 4,
    title: "Track Progress",
    description: "Monitor your completion rate on the dashboard with animated stats cards.",
    icon: <TrendingUp className="h-8 w-8" />,
  },
];

const pricingPlans = [
  {
    name: "Free Forever",
    price: "$0",
    period: "",
    description: "Everything you need to get started",
    features: [
      "Unlimited tasks",
      "Voice input in 15+ languages",
      "AI-powered transcription",
      "Kanban board view",
      "Table view with sorting",
      "Custom tags & colors",
      "Priority levels",
      "Due date tracking",
      "Dark & light mode",
      "Keyboard shortcuts",
      "Mobile-optimized UI",
    ],
    cta: "Get Started Free",
    popular: true,
  },
];

const faqs = [
  {
    question: "Is TaskFlow really free?",
    answer: "Yes! TaskFlow is completely free with all features included, including AI voice input. No credit card required.",
  },
  {
    question: "How does voice input work?",
    answer: "Click the microphone icon when creating a task, speak in your preferred language, and the AI will transcribe your speech into text automatically.",
  },
  {
    question: "Which languages are supported for voice input?",
    answer: "We support 15+ languages including English, Urdu, Pashto, Punjabi, Sindhi, Balochi, Shina, Khowar, Burushaski, Balti, Wakhi, and more regional Pakistani languages.",
  },
  {
    question: "How do I use the Kanban board?",
    answer: "Simply drag and drop tasks between columns (To Do, In Progress, Completed). Works with both mouse and touch on mobile.",
  },
  {
    question: "What are keyboard shortcuts?",
    answer: "Press Cmd/Ctrl+K to open the command palette for quick navigation. Press Ctrl+/ to see all available shortcuts.",
  },
  {
    question: "Can I organize tasks with tags?",
    answer: "Yes! Create custom color-coded tags and filter tasks by tag. You can add multiple tags to each task.",
  },
  {
    question: "Is there a dark mode?",
    answer: "Yes! Toggle between dark and light themes using the theme switcher in the header. Your preference is saved automatically.",
  },
];

const techStack = [
  { name: "React 19", icon: "⚛️" },
  { name: "TypeScript", icon: "📘" },
  { name: "Cloudflare", icon: "☁️" },
  { name: "Tailwind", icon: "🎨" },
  { name: "Framer", icon: "✨" },
  { name: "shadcn/ui", icon: "🧩" },
];

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="bg-linear-to-br from-blue-500 to-purple-600 text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-lg">
              <ListTodo className="size-5" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ scale: 1.05 }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Link to="/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-background"
            >
              <div className="px-4 py-4 space-y-4">
                {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button className="w-full bg-linear-to-r from-blue-500 to-purple-600" asChild>
                    <Link to="/sign-up">Get Started</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-linear-to-r from-pink-500/20 to-orange-500/20 blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, -50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-linear-to-r from-cyan-500/10 to-blue-500/10 blur-3xl"
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-linear-to-r from-blue-400 to-purple-400 opacity-20"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 15}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
                <Mic className="mr-2 h-4 w-4 text-rose-500" />
                <span>Now with Voice Input in 15+ Languages</span>
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mx-auto max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl lg:text-7xl"
            >
              Manage tasks with{" "}
              <span className="relative">
                <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  voice and ease
                </span>
                <motion.span
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 bg-linear-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-sm"
                  animate={{ scaleX: [0, 1] }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground lg:text-xl px-2"
            >
              Create tasks by speaking in Urdu, Pashto, Balochi, or any of 15+ languages.
              AI-powered voice transcription meets beautiful task management.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                  asChild
                >
                  <Link to="/sign-up">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            <motion.p
              variants={fadeIn}
              className="mt-4 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="inline-block mr-1 h-4 w-4 text-green-500" />
              No credit card required • 14-day free trial • Cancel anytime
            </motion.p>
          </motion.div>

          {/* App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 sm:mt-20 relative"
          >
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl sm:rounded-2xl border bg-card p-1.5 sm:p-2 shadow-2xl shadow-blue-500/10"
            >
              <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-muted/50 to-muted p-4 sm:p-8">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                  {["To Do", "In Progress", "Completed"].map((column, idx) => (
                    <motion.div
                      key={column}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="rounded-lg bg-background p-4 shadow-sm"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-medium">{column}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                          {idx === 0 ? 4 : idx === 1 ? 2 : 3}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {[1, 2].map((task) => (
                          <TaskCard
                            key={task}
                            title={`Task ${task}`}
                            tag={["Design", "Development", "Marketing"][idx]}
                            color={["bg-chart-1", "bg-chart-2", "bg-chart-3"][idx]}
                            completed={idx === 2}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="How It Works"
            subtitle="Get started in minutes with our simple 4-step process"
          />

          <div className="mt-10 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <HowItWorksCard key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-16 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Everything you need to stay organized"
            subtitle="Powerful features designed to help you and your team work smarter, not harder."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mt-10 sm:mt-16 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
            <AnimatedStatCard number={10000} suffix="+" label="Active Teams" />
            <AnimatedStatCard number={2} suffix="M+" label="Tasks Completed" />
            <AnimatedStatCard number={99.9} suffix="%" label="Uptime" decimal />
            <AnimatedStatCard number={4.9} suffix="/5" label="User Rating" decimal />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Loved by teams everywhere"
            subtitle="See what our customers have to say about their experience."
          />

          <div className="mt-10 sm:mt-16">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <TestimonialCard testimonial={testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Simple, transparent pricing"
            subtitle="Choose the plan that's right for you. All plans include a 14-day free trial."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mt-10 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3"
          >
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Frequently asked questions"
            subtitle="Can't find what you're looking for? Contact our support team."
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-8">
              Built with modern technologies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-purple-600 px-6 py-16 text-center sm:px-16"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </div>

            <Mail className="mx-auto h-12 w-12 text-white/80 mb-6" />
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Stay updated with our newsletter
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Get the latest updates, tips, and news delivered to your inbox.
            </p>

            <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-white text-purple-600 hover:bg-white/90"
              >
                Subscribe
              </Button>
            </form>

            <p className="mt-4 text-sm text-white/60">
              No spam, unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of teams already using TaskFlow to manage their work more effectively.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="h-14 px-8 text-base bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  asChild
                >
                  <Link to="/sign-up">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <CheckCircle2 className="inline-block mr-1 h-4 w-4 text-green-500" />
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-linear-to-br from-blue-500 to-purple-600 text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                  <ListTodo className="size-5" />
                </div>
                <span className="text-xl font-bold">TaskFlow</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Modern task management for modern teams.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/yoinks-yoinks/tm" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 TaskFlow. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ by the TaskFlow team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component: Section Header
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="text-center"
    >
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}

// Component: How It Works Card
function HowItWorksCard({
  step,
  index,
}: {
  step: { step: number; title: string; description: string; icon: React.ReactNode };
  index: number;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {index < 3 && (
        <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-linear-to-r from-blue-500/50 to-transparent" />
      )}
      <div className="text-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg"
        >
          {step.icon}
        </motion.div>
        <div className="text-sm font-bold text-blue-600 mb-2">Step {step.step}</div>
        <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>
    </motion.div>
  );
}

// Component: Feature Card
function FeatureCard({
  feature,
  index,
}: {
  feature: { icon: React.ReactNode; title: string; description: string; gradient: string };
  index: number;
}) {
  // Make first two cards span 2 columns on larger screens
  const isLarge = index < 2;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group rounded-2xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl ${
        isLarge ? "sm:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} text-white shadow-lg`}
      >
        {feature.icon}
      </motion.div>
      <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
      <p className="text-sm text-muted-foreground">{feature.description}</p>
    </motion.div>
  );
}

// Component: Animated Stat Card
function AnimatedStatCard({
  number,
  suffix,
  label,
  decimal,
}: {
  number: number;
  suffix: string;
  label: string;
  decimal?: boolean;
}) {
  const { count, ref } = useCounter(decimal ? number * 10 : number);
  const displayValue = decimal ? (count / 10).toFixed(1) : count;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-3xl font-bold sm:text-5xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {displayValue}{suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

// Component: Testimonial Card
function TestimonialCard({
  testimonial,
}: {
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
    avatar: string;
    rating: number;
  };
}) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="mb-4 flex gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="mb-6 text-muted-foreground">"{testimonial.quote}"</p>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white">
              {testimonial.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{testimonial.author}</div>
            <div className="text-sm text-muted-foreground">
              {testimonial.role} at {testimonial.company}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component: Pricing Card
function PricingCard({
  plan,
}: {
  plan: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
  };
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className={`relative rounded-2xl border bg-card p-8 ${
        plan.popular ? "border-blue-500 shadow-xl shadow-blue-500/10" : ""
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-linear-to-r from-blue-500 to-purple-600 text-white">
            Most Popular
          </Badge>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-muted-foreground">{plan.period}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`w-full ${
          plan.popular
            ? "bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            : ""
        }`}
        variant={plan.popular ? "default" : "outline"}
        asChild
      >
        <Link to="/sign-up">{plan.cta}</Link>
      </Button>
    </motion.div>
  );
}

// Component: Task Card (for preview)
function TaskCard({
  title,
  tag,
  color,
  completed,
}: {
  title: string;
  tag: string;
  color: string;
  completed?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-card p-3 ${completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-sm font-medium ${completed ? "line-through" : ""}`}>
          {title}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
        <span className="text-xs text-muted-foreground">{tag}</span>
      </div>
      {!completed && (
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Due in 3 days</span>
        </div>
      )}
    </div>
  );
}
