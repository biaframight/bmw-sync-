import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute inset-0 bg-[#C84B31]/20 mix-blend-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      <motion.h1 
        className="text-[12vw] font-black text-[#C84B31] tracking-tight mb-4 drop-shadow-2xl"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        Afrinza
      </motion.h1>

      <motion.h2
        className="text-[6vw] font-bold mb-8"
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        Africa to Africa.<br/>
        <span className="text-white/70 font-normal">Even in Malaysia.</span>
      </motion.h2>

      <motion.p
        className="text-[4.5vw] text-[#C84B31] italic mb-12"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        The taste of home, away from home.
      </motion.p>

      <motion.div
        className="px-10 py-4 bg-white text-[#0f3460] font-bold rounded-full text-[5vw] shadow-[0_0_40px_rgba(200,75,49,0.4)]"
        initial={{ scale: 0, opacity: 0 }}
        animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        Join the community today
      </motion.div>
    </motion.div>
  );
}