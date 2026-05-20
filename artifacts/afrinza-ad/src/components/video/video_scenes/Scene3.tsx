import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 p-8"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2 
        className="text-[8vw] font-bold mt-[15vh] leading-tight"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        African food.<br/>
        <span className="text-[#C84B31]">Fashion. Skincare.</span><br/>
        Groceries. And more.
      </motion.h2>

      <div className="relative w-full h-[40vh] mt-8">
        <motion.img
          src={`${import.meta.env.BASE_URL}images/food.png`}
          className="absolute top-0 left-0 w-[40vw] h-[40vw] object-cover rounded-2xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, rotate: -5 } : { opacity: 0, scale: 0.5, rotate: -15 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
        <motion.img
          src={`${import.meta.env.BASE_URL}images/fashion.png`}
          className="absolute top-[15vh] right-0 w-[45vw] h-[45vw] object-cover rounded-2xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.5, rotate: 15 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, rotate: 5 } : { opacity: 0, scale: 0.5, rotate: 15 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
      </div>

      <motion.p
        className="absolute bottom-[10vh] left-8 right-8 text-[4vw] text-white/60 leading-relaxed text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
      >
        Sellers from Nigeria, Ghana, Kenya, Uganda, Cameroon, South Africa.
      </motion.p>
    </motion.div>
  );
}