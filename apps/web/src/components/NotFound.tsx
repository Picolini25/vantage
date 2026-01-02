import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { HiArrowLeft, HiSearch } from 'react-icons/hi';
import { RiUserUnfollowLine } from 'react-icons/ri';

interface NotFoundProps {
  title?: string;
  message?: string;
  searchQuery?: string;
}

export default function NotFound({
  title = 'Profile Not Found',
  message = "The profile you're looking for doesn't exist or the Steam ID is invalid.",
  searchQuery
}: NotFoundProps) {
  const router = useRouter();

  return (
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
        {/* Icon with Crosshair */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6 sm:mb-8 inline-block"
        >
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
            {/* Main Icon */}
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(115, 115, 115, 0.2)',
                  '0 0 0 20px rgba(115, 115, 115, 0)',
                  '0 0 0 0 rgba(115, 115, 115, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full h-full flex items-center justify-center rounded-full bg-muted/50 border-2 border-muted-foreground/30"
            >
              <RiUserUnfollowLine className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
            </motion.div>

            {/* Scanning lines */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />

            {/* Crosshair effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 w-[1px] h-4 sm:h-6 bg-primary/30" />
                <div className="absolute bottom-0 left-1/2 w-[1px] h-4 sm:h-6 bg-primary/30" />
                <div className="absolute top-1/2 left-0 w-4 sm:w-6 h-[1px] bg-primary/30" />
                <div className="absolute top-1/2 right-0 w-4 sm:w-6 h-[1px] bg-primary/30" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 sm:mb-6"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide mb-3">
            <span className="bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              {title.toUpperCase()}
            </span>
          </h1>
          <div className="h-[2px] w-32 sm:w-48 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </motion.div>

        {/* Search Query Display (if provided) */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-4 sm:mb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-muted/50 border border-border rounded-lg">
              <HiSearch className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-mono text-muted-foreground">
                {searchQuery}
              </span>
            </div>
          </motion.div>
        )}

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 sm:mb-8 space-y-3"
        >
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-sm sm:max-w-md mx-auto leading-relaxed">
            {message}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/70">
            Please verify the Steam ID or profile URL and try again.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={() => router.push('/')}
            className="group px-4 sm:px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <HiSearch className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            Search Again
          </button>
          
          <button
            onClick={() => router.back()}
            className="group px-4 sm:px-8 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50"
        >
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
            Valid Search Formats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              <div className="text-left">
                <span className="font-mono">Steam ID 64</span>
                <p className="text-muted-foreground/60">76561198012345678</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              <div className="text-left">
                <span className="font-mono">Steam Profile URL</span>
                <p className="text-muted-foreground/60">steamcommunity.com/id/username</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              <div className="text-left">
                <span className="font-mono">Custom URL</span>
                <p className="text-muted-foreground/60">/id/customname</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              <div className="text-left">
                <span className="font-mono">Faceit Username</span>
                <p className="text-muted-foreground/60">faceit.com/player-name</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
