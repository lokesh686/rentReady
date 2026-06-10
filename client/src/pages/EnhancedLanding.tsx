import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Shield,
  Zap,
  TrendingUp,
  Users,
  FileCheck,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Sparkles,
  Rocket,
  Lock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdvancedSceneCanvas from '@/components/AdvancedScene';
import Card3D from '@/components/Card3D';
import Carousel3D from '@/components/Carousel3D';
import AnimatedCounter from '@/components/AnimatedCounter';
import HorizontalScroll from '@/components/HorizontalScroll';
import MeshGradient from '@/components/MeshGradient';
import { getLoginUrl } from '@/const';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    title: 'Perfect for Renters',
    content:
      'RentReady made my rental search so much easier. I built my profile once and applied to 5 apartments in minutes. No more repeated paperwork!',
    author: 'Sarah Johnson',
    role: 'Renter, New York',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 2,
    title: 'Game Changer for Landlords',
    content:
      'We review verified applications instantly. The verification badges give us confidence, and the process is incredibly streamlined.',
    author: 'Michael Chen',
    role: 'Landlord, California',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
  {
    id: 3,
    title: 'Transparent & Secure',
    content:
      'I love that I control who sees my documents. The security is top-notch, and I can track my applications in real-time.',
    author: 'Emma Williams',
    role: 'Renter, Texas',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  },
];

export default function EnhancedLanding() {
  const { scrollYProgress } = useScroll();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Hero section animations
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero text animations
    if (heroHeadingRef.current) {
      gsap.fromTo(
        heroHeadingRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5 }
      );
    }

    if (heroSubtitleRef.current) {
      gsap.fromTo(
        heroSubtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.7 }
      );
    }

    if (heroCTARef.current) {
      gsap.fromTo(
        heroCTARef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.9 }
      );
    }

    // Section animations
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1.5,
          markers: false,
        },
        opacity: 1,
        y: 0,
        duration: 1,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a78bfa', '#06b6d4', '#ec4899'],
    });
  };

  return (
    <div className="bg-slate-900 text-white overflow-hidden cursor-none">
      <MeshGradient colors={['#a78bfa', '#06b6d4', '#ec4899']} />
      <Navbar />

      {/* Hero Section with 3D Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <AdvancedSceneCanvas />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            ref={heroHeadingRef}
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Rental Applications Made Simple
          </motion.h1>

          <motion.p
            ref={heroSubtitleRef}
            className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed"
          >
            RentReady streamlines the rental application process. Renters build verified profiles once, landlords review applications instantly. Trust, transparency, and efficiency in every transaction.
          </motion.p>

          <motion.div
            ref={heroCTARef}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href={getLoginUrl()}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-violet-400 text-violet-400 font-bold rounded-lg hover:bg-violet-400/10 transition-all"
            >
              Learn More
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-violet-400 rounded-full flex items-start justify-center p-2">
            <motion.div className="w-1 h-2 bg-violet-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        data-animate
        className="py-24 px-4 opacity-0 translate-y-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Why RentReady?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Profiles',
                description: 'Renters build comprehensive, verified profiles with ID, income, and employment verification.',
              },
              {
                icon: Zap,
                title: 'One-Tap Apply',
                description: 'Send verified applications to landlords instantly. No repeated paperwork, no delays.',
              },
              {
                icon: TrendingUp,
                title: 'Smart Screening',
                description: 'Landlords review complete applicant packets with simulated credit scores and verification badges.',
              },
              {
                icon: Users,
                title: 'Renter Community',
                description: 'Build your rental reputation. Track application status and landlord responses in real-time.',
              },
              {
                icon: CheckCircle2,
                title: 'Transparent Process',
                description: 'Know exactly where your application stands. Clear communication at every step.',
              },
              {
                icon: FileCheck,
                title: 'Secure Documents',
                description: 'Your sensitive documents are encrypted and stored securely. Only shared with landlords you choose.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)' }}
                className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-400/50 transition-all backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: hoveredCard === idx ? 360 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-12 h-12 text-violet-400 mb-4" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        data-animate
        className="py-24 px-4 opacity-0 translate-y-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Profile',
                description: 'Build your verified profile with all necessary documents and information.',
                icon: Sparkles,
              },
              {
                step: '02',
                title: 'Apply Instantly',
                description: 'Apply to properties with just one click. Your verified profile does the heavy lifting.',
                icon: Rocket,
              },
              {
                step: '03',
                title: 'Get Approved',
                description: 'Landlords review your complete application and respond quickly with decisions.',
                icon: CheckCircle2,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-violet-400/20 mb-4">
                  {item.step}
                </div>
                <item.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>

                {idx < 2 && (
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2"
                  >
                    <ArrowRight className="text-violet-400" size={32} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects/Work Section with 3D Cards */}
      <section
        id="projects"
        data-animate
        className="py-24 px-4 opacity-0 translate-y-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Our Solutions
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card3D
              title="Renter Dashboard"
              description="Manage your profile, track applications, and communicate with landlords all in one place."
              icon="📊"
              gradient="from-violet-500/20 to-purple-500/20"
              delay={0}
            />
            <Card3D
              title="Landlord Portal"
              description="Review verified applications, make decisions, and manage your properties efficiently."
              icon="🏢"
              gradient="from-cyan-500/20 to-blue-500/20"
              delay={0.1}
            />
            <Card3D
              title="Verification System"
              description="Advanced verification badges and security features for complete peace of mind."
              icon="🔒"
              gradient="from-pink-500/20 to-rose-500/20"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section
        id="stats"
        data-animate
        className="py-24 px-4 opacity-0 translate-y-10 bg-slate-800/30 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AnimatedCounter
              from={0}
              to={50000}
              suffix="+"
              label="Active Users"
              delay={0}
            />
            <AnimatedCounter
              from={0}
              to={10000}
              suffix="+"
              label="Applications Processed"
              delay={0.1}
            />
            <AnimatedCounter
              from={0}
              to={5000}
              suffix="+"
              label="Properties Listed"
              delay={0.2}
            />
            <AnimatedCounter
              from={0}
              to={99}
              suffix="%"
              label="Success Rate"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        data-animate
        className="py-24 px-4 opacity-0 translate-y-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
          >
            What Our Users Say
          </motion.h2>

          <Carousel3D items={testimonials} />
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        data-animate
        className="py-24 px-4 opacity-0 translate-y-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <p className="text-center text-slate-400 mb-16 text-lg">
            No hidden fees. No surprises.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'For Renters',
                price: '$49',
                period: '/year',
                description: 'Unlimited applications with one verified profile',
                features: [
                  'Verified profile with ID & income verification',
                  'Unlimited one-tap applications',
                  'Application status tracking',
                  'Secure document storage',
                  'Employment verification badges',
                ],
                highlight: false,
              },
              {
                title: 'For Landlords',
                price: '$10',
                period: '/application',
                description: 'Pay only for applications you review',
                features: [
                  'Review verified renter profiles',
                  'Access complete application packets',
                  'Approve, reject, or mark pending',
                  'Application notes & communication',
                  'Billing history & invoices',
                  'List unlimited properties',
                ],
                highlight: true,
              },
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-2xl backdrop-blur-sm transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-2 border-violet-400'
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                {plan.highlight && (
                  <div className="mb-4 inline-block px-3 py-1 bg-violet-500 text-white text-sm font-bold rounded-full">
                    POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                <p className="text-slate-400 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-slate-400 ml-2">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={getLoginUrl()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 font-bold rounded-lg transition-all text-center block ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-violet-500/50'
                      : 'border border-violet-400 text-violet-400 hover:bg-violet-400/10'
                  }`}
                >
                  Get Started
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        data-animate
        className="py-24 px-4 opacity-0 translate-y-10"
      >
        <div className="max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Ready to Transform Your Rental Experience?
          </motion.h2>

          <motion.form
            onSubmit={handleFormSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 transition-colors"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-violet-500/50 transition-all"
            >
              Get Started Today
            </motion.button>
          </motion.form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Join thousands of renters and landlords using RentReady.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                RentReady
              </h4>
              <p className="text-slate-400 text-sm">
                Simplifying rental applications for everyone.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Security'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers'],
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Contact'],
              },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-violet-400 transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">
              &copy; 2026 RentReady. All rights reserved.
            </p>

            <div className="flex gap-4 mt-4 md:mt-0">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ scale: 1.2, color: '#a78bfa' }}
                  className="text-slate-400 hover:text-violet-400 transition-colors"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
