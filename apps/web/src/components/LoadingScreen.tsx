import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const loadingSteps = [
  'Resolving Steam Identity',
  'Fetching Profile Data',
  'Analyzing Faceit History',
  'Gathering Match Statistics',
  'Calculating Risk Factor',
  'Compiling Intelligence',
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background transition-colors relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        {/* Main Radar/Scanner Animation */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto mb-8 sm:mb-12">
          {/* Outer rings */}
          <motion.div
            className="absolute inset-0 border border-primary/20 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          />
          <motion.div
            className="absolute inset-6 sm:inset-8 border border-primary/25 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.div
            className="absolute inset-12 sm:inset-16 border border-primary/30 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
          <motion.div
            className="absolute inset-18 sm:inset-24 border border-primary/30 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          />

          {/* Rotating scanner beam */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-1/2 left-1/2 w-[40%] sm:w-[45%] h-[2px] bg-gradient-to-r from-primary via-primary/60 to-transparent origin-left -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-[35%] sm:w-[40%] h-[1px] bg-gradient-to-r from-primary/40 to-transparent origin-left -translate-y-1/2 blur-sm" 
                 style={{ transform: 'translateY(-50%) rotate(8deg)' }} />
          </motion.div>

          {/* Pulsing dots at different positions */}
          <motion.div
            className="absolute"
            style={{ top: '25%', left: '65%' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            <div className="w-2 h-2 bg-primary rounded-full" />
          </motion.div>
          <motion.div
            className="absolute"
            style={{ top: '60%', left: '30%' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
          >
            <div className="w-2 h-2 bg-primary rounded-full" />
          </motion.div>
          <motion.div
            className="absolute"
            style={{ top: '70%', left: '70%' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
          >
            <div className="w-2 h-2 bg-primary rounded-full" />
          </motion.div>

          {/* Center pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full"
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {/* Crosshair overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-24 sm:h-32">
            <div className="absolute top-0 left-1/2 w-[1px] h-3 sm:h-4 bg-primary/50" />
            <div className="absolute bottom-0 left-1/2 w-[1px] h-3 sm:h-4 bg-primary/50" />
            <div className="absolute top-1/2 left-0 w-3 sm:w-4 h-[1px] bg-primary/50" />
            <div className="absolute top-1/2 right-0 w-3 sm:w-4 h-[1px] bg-primary/50" />
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider mb-2">
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              ANALYZING TARGET
            </span>
          </h2>
          <div className="h-[2px] w-24 sm:w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        {/* Loading Step Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          {/* Current step display */}
          <div className="min-h-[60px]">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-3 text-muted-foreground"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              />
              <span className="text-sm md:text-base font-medium tracking-wide">
                {loadingSteps[currentStep]}
              </span>
            </motion.div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {loadingSteps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-primary' 
                    : index < currentStep 
                      ? 'w-1.5 bg-primary/60' 
                      : 'w-1.5 bg-border'
                }`}
                animate={index === currentStep ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Status text */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs text-muted-foreground/70 tracking-wider uppercase"
          >
            Please wait...
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
