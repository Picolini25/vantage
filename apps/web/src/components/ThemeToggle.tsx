import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { HiMoon, HiSun } from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted" />
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-card border-2 border-border 
                 hover:border-primary transition-colors shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <HiSun className="w-6 h-6 text-yellow-400" />
      ) : (
        <HiMoon className="w-6 h-6 text-primary" />
      )}
    </motion.button>
  );
}