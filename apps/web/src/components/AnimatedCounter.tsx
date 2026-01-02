import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

interface DigitProps {
  digit: string;
  index: number;
}

const Digit = ({ digit, index }: DigitProps) => {
  return (
    <div className="relative inline-block overflow-hidden" style={{ width: '0.6em' }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`${digit}-${index}`}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 25,
            mass: 1.2
          }}
          className="block"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default function AnimatedCounter({ value, duration = 2.5, className = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isInitialMount, setIsInitialMount] = useState(true);
  
  useEffect(() => {
    // Initial count-up animation from 0
    if (isInitialMount) {
      setIsInitialMount(false);
      const startTime = Date.now();
      const startValue = 0;
      const endValue = value;
      const animationDuration = duration * 1000;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Easing function for smooth acceleration/deceleration
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      return;
    }

    // For subsequent updates, animate to new value
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    const animationDuration = Math.min(duration * 1000, Math.abs(endValue - startValue) * 80);

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  // Format number with commas and split into individual characters
  const formattedValue = displayValue.toLocaleString();
  const digits = formattedValue.split('');

  return (
    <span className={`inline-flex ${className}`}>
      {digits.map((char, index) => (
        char === ',' ? (
          <span key={`comma-${index}`} className="inline-block w-[0.3em]">,</span>
        ) : (
          <Digit key={`${index}`} digit={char} index={index} />
        )
      ))}
    </span>
  );
}
