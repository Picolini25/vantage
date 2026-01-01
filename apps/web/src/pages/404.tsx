import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { HiArrowLeft, HiHome } from 'react-icons/hi';
import { RiErrorWarningLine } from 'react-icons/ri';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 - Page Not Found | Vantage</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center px-4 bg-background transition-colors relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 mx-auto flex items-center justify-center rounded-full bg-destructive/10 border-2 border-destructive/30"
              >
                <RiErrorWarningLine className="w-16 h-16 text-destructive" />
              </motion.div>
              
              {/* Animated rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-destructive/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-8xl md:text-9xl font-bold tracking-tighter mb-2">
              <span className="bg-gradient-to-r from-destructive via-destructive/80 to-destructive/60 bg-clip-text text-transparent">
                404
              </span>
            </h1>
            <div className="h-[2px] w-48 mx-auto bg-gradient-to-r from-transparent via-destructive/50 to-transparent" />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 space-y-3"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              TARGET NOT FOUND
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to a new location.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => router.back()}
              className="group px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="group px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <HiHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go Home
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-border/50"
          >
            <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">
              Error Code: 404 - Resource Not Found
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
