import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative z-10 w-full mt-[20vh]">
        <motion.div
          className="text-[#C84B31] text-[12vw] font-black tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          Afrinza.
        </motion.div>
        
        <motion.h2
          className="text-[7vw] font-bold text-white mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Your African marketplace.<br/>
          <span className="text-[#C84B31]">In Malaysia.</span>
        </motion.h2>

        <motion.p
          className="text-[4.5vw] text-white/70 mt-8"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          Like Shopee or Lazada —<br/>
          but built for the African community.
        </motion.p>
      </div>

      {/* Decorative App Card */}
      <motion.div
        className="absolute bottom-[10vh] right-[-10vw] w-[70vw] h-[40vh] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
        initial={{ y: 200, rotate: 10, opacity: 0 }}
        animate={{ y: 0, rotate: -5, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.5 }}
      >
        <div className="p-6">
          <div className="w-1/2 h-4 bg-white/20 rounded-full mb-4" />
          <div className="w-3/4 h-4 bg-white/10 rounded-full mb-8" />
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-[#C84B31]/30 rounded-2xl" />
            <div className="w-20 h-20 bg-[#0f3460]/50 rounded-2xl" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}