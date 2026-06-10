import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  title: string;
  content: string;
  author: string;
  role: string;
  image?: string;
}

interface Carousel3DProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

export default function Carousel3D({
  items,
  autoplay = true,
  autoplayInterval = 5000,
}: Carousel3DProps) {
  const [current, setCurrent] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!autoplay) return;

    autoplayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, autoplayInterval);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, autoplayInterval, items.length]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % items.length);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative h-96 overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          {items.map((item, idx) => (
            idx === current && (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 p-8 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-400/50 backdrop-blur-sm rounded-2xl flex flex-col justify-between"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div>
                  <p className="text-xl text-white mb-6 leading-relaxed italic">
                    "{item.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-bold text-white">{item.author}</p>
                    <p className="text-sm text-slate-400">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="p-3 rounded-full bg-violet-500/20 border border-violet-400/50 text-violet-400 hover:bg-violet-500/30 transition-colors"
        >
          <ChevronLeft size={24} />
        </motion.button>

        {/* Indicators */}
        <div className="flex gap-2">
          {items.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrent(idx)}
              animate={{
                width: idx === current ? 32 : 8,
                backgroundColor: idx === current ? '#a78bfa' : '#475569',
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="p-3 rounded-full bg-violet-500/20 border border-violet-400/50 text-violet-400 hover:bg-violet-500/30 transition-colors"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </div>
  );
}
