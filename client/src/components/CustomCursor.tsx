import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBlobRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cursorX = useRef(0);
  const cursorY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const animate = () => {
      // Smooth follow with lerp
      cursorX.current += (mouseX.current - cursorX.current) * 0.15;
      cursorY.current += (mouseY.current - cursorY.current) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorX.current}px`;
        cursorRef.current.style.top = `${cursorY.current}px`;
      }

      if (cursorBlobRef.current) {
        cursorBlobRef.current.style.left = `${cursorX.current}px`;
        cursorBlobRef.current.style.top = `${cursorY.current}px`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Cursor blob */}
      <div
        ref={cursorBlobRef}
        className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 opacity-30 blur-lg mix-blend-screen"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Cursor dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full bg-white border-2 border-violet-400"
        style={{
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
        }}
      />
    </>
  );
}
