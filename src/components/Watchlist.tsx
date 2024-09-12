import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Movie } from "@/lib/api";

interface WatchlistProps {
  watchlist: Movie[];
  handleRemoveFromWatchlist: (movieId: number) => Promise<void>;
  onDiscoverClick: () => void; // Add this new prop
}

export function Watchlist({
  watchlist,
  handleRemoveFromWatchlist,
  onDiscoverClick, // Add this new prop
}: WatchlistProps) {
  return (
    <motion.div
      key="watchlist"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-grow flex flex-col items-center space-y-8 w-full max-w-4xl mx-auto"
    >
      <motion.h2
        className="text-4xl font-light mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your Watchlist
      </motion.h2>
      {watchlist.length === 0 ? (
        <motion.p
          className="text-xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your watchlist is empty.{" "}
          <span
            className="text-primary hover:underline cursor-pointer"
            onClick={onDiscoverClick}
          >
            Discover some movies!
          </span>
        </motion.p>
      ) : (
        <motion.div
          className="w-full space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {watchlist.map((movie, index) => (
            <WatchlistItem
              key={movie.id}
              movie={movie}
              index={index}
              handleRemoveFromWatchlist={handleRemoveFromWatchlist}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

interface WatchlistItemProps {
  movie: Movie;
  index: number;
  handleRemoveFromWatchlist: (movieId: number) => Promise<void>;
}

function WatchlistItem({
  movie,
  index,
  handleRemoveFromWatchlist,
}: WatchlistItemProps) {
  return (
    <motion.div
      className="bg-secondary p-6 rounded-lg flex justify-between items-center shadow-md hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
    >
      <div>
        <h3 className="font-medium text-xl text-secondary-foreground">
          {movie.title}
        </h3>
        <p className="text-lg text-muted-foreground">{movie.year}</p>
      </div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => movie.id && handleRemoveFromWatchlist(movie.id)}
          className="text-secondary-foreground hover:text-primary transition-colors duration-300"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
