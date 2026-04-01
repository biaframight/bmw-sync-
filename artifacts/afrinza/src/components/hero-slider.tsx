import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=75&auto=format&fit=crop",
    label: "African Food",
    title: "Taste of Home",
    subtitle: "Jollof rice, egusi soup, suya & more — authentic African flavours in Malaysia",
    color: "from-orange-900/70",
  },
  {
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=75&auto=format&fit=crop",
    label: "African Fashion",
    title: "Wear Your Culture",
    subtitle: "Ankara prints, kente, dashiki & bespoke African fashion styles",
    color: "from-emerald-900/70",
  },
  {
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1400&q=75&auto=format&fit=crop",
    label: "Beauty & Braiding",
    title: "Look & Feel Beautiful",
    subtitle: "Professional African hair braiding, skincare & beauty services near you",
    color: "from-purple-900/70",
  },
  {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=75&auto=format&fit=crop",
    label: "Community",
    title: "Our Community",
    subtitle: "Join thousands of Africans building a thriving home away from home in Malaysia",
    color: "from-blue-900/70",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  return (
    <div
      className="relative w-full h-[340px] md:h-[480px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].color} via-black/40 to-transparent`} />

          {/* Slide content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-14">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-xs font-bold tracking-widest uppercase text-amber-400 mb-2"
            >
              {slides[current].label}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-bold text-white font-serif mb-3 leading-tight drop-shadow-lg"
            >
              {slides[current].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/85 text-sm md:text-base max-w-lg"
            >
              {slides[current].subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "bg-white w-6 h-2" : "bg-white/50 w-2 h-2"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
