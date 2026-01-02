import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { HiArrowLeft, HiHome, HiRefresh } from 'react-icons/hi';
import { RiAlertLine } from 'react-icons/ri';
import type { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
  title?: string;
}

function Error({ statusCode, title }: ErrorProps) {
  const router = useRouter();

  const errorTitle = title || (statusCode === 404 
    ? 'Page Not Found' 
    : statusCode === 500 
      ? 'Internal Server Error' 
      : 'An Error Occurred');

  const errorMessage = statusCode === 404
    ? "The page you're looking for doesn't exist or has been moved."
    : statusCode === 500
      ? 'Something went wrong on our end. Please try again later.'
      : 'An unexpected error occurred. Please try again.';

  const errorCode = statusCode || 'ERROR';

  return (
    <>
      <Head>
        <title>{errorTitle} | Vantage</title>
      </Head>

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
            className="mb-8 inline-block"
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
                className="w-32 h-32 mx-auto flex items-center justify-center rounded-full bg-destructive/10 border-2 border-destructive/40"
              >
                <RiAlertLine className="w-16 h-16 text-destructive" />
              </motion.div>
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-7xl md:text-8xl font-bold tracking-tighter mb-2">
              <span className="bg-gradient-to-r from-destructive via-destructive/80 to-destructive/60 bg-clip-text text-transparent">
                {errorCode}
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
            <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide">
              {errorTitle}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto">
              {errorMessage}
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
              onClick={() => router.reload()}
              className="group px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <HiRefresh className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>

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
              Status Code: {errorCode}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
