import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: React.ReactNode;
  title?: string;
}

export default function HorizontalScroll({ children, title }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scroller = scrollerRef.current;
    const scrollWidth = scroller.scrollWidth - scroller.clientWidth;

    gsap.to(scroller, {
      scrollLeft: scrollWidth,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1.5,
        markers: false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-24 px-4 overflow-hidden"
    >
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-12 max-w-6xl mx-auto bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
        >
          {title}
        </motion.h2>
      )}

      <div
        ref={scrollerRef}
        className="flex gap-8 overflow-x-auto pb-4 px-4 max-w-6xl mx-auto"
        style={{ scrollBehavior: 'auto' }}
      >
        {children}
      </div>
    </section>
  );
}
