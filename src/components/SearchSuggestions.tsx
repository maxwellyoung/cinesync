import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
}

export function SearchSuggestions({
  query,
  onSuggestionClick,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async (query: string) => {
      const { data, error } = await supabase
        .from("movies")
        .select("title")
        .ilike("title", `%${query}%`)
        .limit(5);

      if (error) {
        console.error("Error fetching suggestions:", error);
        return;
      }

      if (data && Array.isArray(data)) {
        setSuggestions(data.map((item) => item.title || "").filter(Boolean));
      }
    };

    fetchSuggestions(query);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-10 w-full bg-secondary rounded-md shadow-lg mt-1"
    >
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
          whileHover={{ scale: 1.05 }}
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </motion.div>
      ))}
    </motion.div>
  );
}
