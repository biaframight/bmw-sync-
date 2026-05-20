import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/shelf.png`}
          alt="Empty shelf"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/60 to-transparent" />
      </motion.div>

      <div className="relative z-10 w-full text-center mt-auto mb-[15vh]">
        <motion.h1 
          className="text-[10vw] leading-[1.1] font-bold text-white mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Missing home?
        </motion.h1>
        
        <motion.p 
          className="text-[5vw] text-white/80"
          initial={{ y: 20, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Missing the taste,
        </motion.p>
        <motion.p 
          className="text-[5vw] text-white/80 mt-2"
          initial={{ y: 20, opacity: 0 }}
          animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          the culture, the products?
        </motion.p>
      </div>
    </motion.div>
  );
}