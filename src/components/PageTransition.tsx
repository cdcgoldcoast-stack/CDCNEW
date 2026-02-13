import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{
        duration: prefersReducedMotion ? 0.08 : 0.14,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
