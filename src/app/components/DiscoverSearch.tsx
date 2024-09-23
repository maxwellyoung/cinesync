"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Check, BookmarkPlus } from "lucide-react";
import { Movie } from "@/lib/types";

interface DiscoverSearchProps {
  addToWatchlist: (movie: Movie) => Promise<void>;
  isInWatchlist: (movie: Movie) => boolean; // Changed from boolean to function
}

const DiscoverSearch: React.FC<DiscoverSearchProps> = ({
  addToWatchlist,
  isInWatchlist,
}) => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const searchMovies = async () => {
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
      toast.error("Failed to search movies");
    }
  };

  const handleAddToWatchlist = async (movie: Movie) => {
    try {
      await addToWatchlist(movie);
      toast.success("Movie added to watchlist");
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add movie to watchlist"
      );
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for movies..."
      />
      <button onClick={searchMovies}>Search</button>

      {searchResults.map((movie) => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
          <p>Rating: {movie.vote_average}</p>
          <Button
            onClick={() => handleAddToWatchlist(movie)}
            variant={isInWatchlist(movie) ? "secondary" : "default"}
            disabled={isInWatchlist(movie)}
          >
            {isInWatchlist(movie) ? (
              <Check className="mr-2 h-5 w-5" />
            ) : (
              <BookmarkPlus className="mr-2 h-5 w-5" />
            )}
            {isInWatchlist(movie) ? "In Watchlist" : "Add to Watchlist"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DiscoverSearch;
