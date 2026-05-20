import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.8 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/chat.png`}
        className="w-[30vw] h-[30vw] object-contain mb-12 drop-shadow-[0_0_30px_rgba(37,211,102,0.3)]"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      />

      <motion.h2 
        className="text-[9vw] font-bold leading-tight"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      >
        Browse. Connect.<br/>
        <span className="text-[#25D366]">Order via WhatsApp.</span>
      </motion.h2>

      <motion.div
        className="mt-8 space-y-4"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
      >
        <p className="text-[5vw] text-white/80">Simple.</p>
        <p className="text-[5vw] text-white/80">No complicated checkout.</p>
        <p className="text-[5.5vw] font-bold text-[#C84B31] mt-4">Just real community trade.</p>
      </motion.div>
    </motion.div>
  );
}