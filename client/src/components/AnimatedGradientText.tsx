import { motion } from 'framer-motion';

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function AnimatedGradientText({
  text,
  className = '',
  delay = 0,
}: AnimatedGradientTextProps) {
  const words = text.split(' ');

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + idx * 0.1, duration: 0.5 }}
          className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
