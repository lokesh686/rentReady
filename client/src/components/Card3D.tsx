import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import VanillaTilt from 'vanilla-tilt';
import { useEffect } from 'react';

interface Card3DProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

export default function Card3D({
  title,
  description,
  icon,
  gradient,
  delay = 0,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      VanillaTilt.init(cardRef.current, {
        max: 25,
        scale: 1.05,
        speed: 400,
      });
    }

    return () => {
      if (cardRef.current && (cardRef.current as any).vanillaTilt) {
        (cardRef.current as any).vanillaTilt.destroy();
      }
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className={`relative w-full h-full p-8 bg-gradient-to-br ${gradient} border border-white/10 backdrop-blur-sm`}
      >
        {/* Background blur effect */}
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <motion.div
              animate={{ scale: isHovered ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
              className="mb-6 text-5xl"
            >
              {icon}
            </motion.div>

            <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-white/70 leading-relaxed">{description}</p>
          </div>

          {/* Bottom accent */}
          <motion.div
            animate={{ width: isHovered ? '100%' : '0%' }}
            transition={{ duration: 0.3 }}
            className="h-1 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full"
          />
        </div>

        {/* Shine effect */}
        <motion.div
          animate={{ x: isHovered ? 400 : -400 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ width: '200%' }}
        />
      </div>
    </motion.div>
  );
}
