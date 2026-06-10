import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
}

export default function AnimatedCounter({
  from,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  label,
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isInView || !countRef.current) return;

    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const current = Math.floor(from + (to - from) * progress);

      if (countRef.current) {
        countRef.current.textContent = `${prefix}${current}${suffix}`;
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isInView, from, to, duration, suffix, prefix]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
        <span ref={countRef}>{prefix}0{suffix}</span>
      </div>
      <p className="text-slate-400 text-lg">{label}</p>
    </motion.div>
  );
}
