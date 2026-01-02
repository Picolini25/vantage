import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { HiArrowLeft, HiHome, HiRefresh } from 'react-icons/hi';
import { RiAlertLine } from 'react-icons/ri';

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred. Please try again.',
  errorCode,
  showRetry = true,
  onRetry
}: ErrorStateProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background transition-colors relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(var(--destructive) 1px, transparent 1px), linear-gradient(90deg, var(--destructive) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="mb-6 sm:mb-8 inline-block"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(239, 68, 68, 0.2)',
                  '0 0 0 20px rgba(239, 68, 68, 0)',
                  '0 0 0 0 rgba(239, 68, 68, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center rounded-full bg-destructive/10 border-2 border-destructive/40"
            >
              <RiAlertLine className="w-12 h-12 sm:w-16 sm:h-16 text-destructive" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Code (if provided) */}
        {errorCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4 sm:mb-6"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-2">
              <span className="bg-gradient-to-r from-destructive via-destructive/80 to-destructive/60 bg-clip-text text-transparent">
                {errorCode}
              </span>
            </h1>
            <div className="h-[2px] w-32 sm:w-48 mx-auto bg-gradient-to-r from-transparent via-destructive/50 to-transparent" />
          </motion.div>
        )}

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 sm:mb-8 space-y-3"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide">
            {title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-sm sm:max-w-md mx-auto">
            {message}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          {showRetry && (
            <button
              onClick={handleRetry}
              className="group px-4 sm:px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>
          )}

          <button
            onClick={() => router.back()}
            className="group px-4 sm:px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="group px-4 sm:px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <HiHome className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            Go Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
