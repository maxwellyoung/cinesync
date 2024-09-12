import React from "react";
import { motion } from "framer-motion";

interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "Heartwarming indie drama",
  "Sci-fi thriller from the 90s",
  "Quirky European comedy",
  "Thought-provoking documentary",
  "Classic film noir",
  "Animated fantasy for adults",
  "Psychological horror",
  "Underrated 80s action movie",
  "Romantic period piece",
  "Mind-bending time travel story",
];

export function SearchSuggestions({
  onSuggestionClick,
}: SearchSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
}
