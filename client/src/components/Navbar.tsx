import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { getLoginUrl } from '@/const';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer"
        >
          RentReady
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              whileHover={{ color: '#a78bfa' }}
              className="text-slate-300 hover:text-violet-400 transition-colors text-sm font-medium"
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex gap-3">
          <motion.a
            href={getLoginUrl()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-medium border border-slate-600 rounded-lg hover:border-violet-400 hover:text-violet-400 transition-colors"
          >
            Sign In
          </motion.a>
          <motion.a
            href={getLoginUrl()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/50 transition-all"
          >
            Get Started
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-violet-400 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 overflow-hidden"
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              whileHover={{ x: 4 }}
              className="block text-slate-300 hover:text-violet-400 transition-colors py-2 font-medium"
            >
              {item.label}
            </motion.a>
          ))}
          <div className="border-t border-slate-700/50 pt-3 mt-3 space-y-2">
            <motion.a
              href={getLoginUrl()}
              whileHover={{ scale: 1.02 }}
              className="block w-full px-4 py-2 text-center text-sm font-medium border border-slate-600 rounded-lg hover:border-violet-400 hover:text-violet-400 transition-colors"
            >
              Sign In
            </motion.a>
            <motion.a
              href={getLoginUrl()}
              whileHover={{ scale: 1.02 }}
              className="block w-full px-4 py-2 text-center text-sm font-medium bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg"
            >
              Get Started
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
