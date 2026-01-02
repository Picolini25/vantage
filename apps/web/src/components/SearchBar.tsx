import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <motion.div
        whileFocus={{ scale: 1.02 }}
        className="relative"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Steam Profile URL, ID, or Username..."
          disabled={isLoading}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-card border-2 
                   border-border rounded-lg 
                   focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                   text-foreground placeholder-muted-foreground text-base sm:text-lg
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 shadow-sm"
        />
        
        {isLoading && (
          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>

      <motion.button
        type="submit"
        disabled={!query.trim() || isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-3 sm:mt-4 w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg
                 hover:bg-primary/90 transition-colors shadow-md
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                 text-sm sm:text-base min-h-[44px] sm:min-h-0"
      >
        {isLoading ? 'ANALYZING...' : 'LOOKUP PLAYER'}
      </motion.button>
    </form>
  );
}
