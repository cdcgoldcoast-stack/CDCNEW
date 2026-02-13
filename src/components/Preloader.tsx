import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

const quotes = [
  "Build the life you want to walk into.",
  "Small changes, lasting impact.",
  "Comfort is crafted, not bought.",
  "Where light flows, life follows.",
  "Thoughtful design changes how you live.",
  "Good design makes everyday life easier.",
  "Spaces should feel calm before they look impressive.",
  "Renovation is progress made visible.",
  "Better flow, better living.",
  "Thoughtful spaces create better routines.",
  "Design for how you live, not how it looks.",
  "Start fresh. Build better. Live fully.",
  "The right space changes everything.",
];

const Preloader = ({ onComplete, minDuration = 1800 }: PreloaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Randomize quote on mount
  const randomQuote = useMemo(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  useEffect(() => {
    // Animate progress from 0 to 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, minDuration / 50);

    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, minDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
          data-preloader="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center gap-10 w-full max-w-lg px-8">
            {/* Quote */}
            <motion.p
              className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary-foreground/90 text-center italic leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {randomQuote}
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="w-full h-px bg-primary-foreground/20 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-primary-foreground/80"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
