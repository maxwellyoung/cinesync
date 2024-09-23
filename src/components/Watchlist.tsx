import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Star, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { Movie } from "@/lib/api";

interface WatchlistProps {
  watchlist: Movie[];
  handleRemoveFromWatchlist: (movieId: number) => void;
  onDiscoverClick: () => void;
}

export function Watchlist({
  watchlist,
  handleRemoveFromWatchlist,
  onDiscoverClick,
}: WatchlistProps) {
  return (
    <motion.div
      key="watchlist"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-grow flex flex-col items-center space-y-8 p-4 max-w-4xl mx-auto"
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
        <EmptyWatchlist onDiscoverClick={onDiscoverClick} />
      ) : (
        <motion.div
          className="w-full space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {watchlist.map((movie) => (
            <WatchlistItem
              key={movie.id}
              movie={movie}
              onRemove={() => handleRemoveFromWatchlist(movie.id)}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function EmptyWatchlist({ onDiscoverClick }: { onDiscoverClick: () => void }) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-xl mb-4">Your watchlist is empty.</p>
      <Button onClick={onDiscoverClick}>Discover Movies</Button>
    </motion.div>
  );
}

function WatchlistItem({
  movie,
  onRemove,
}: {
  movie: Movie;
  onRemove: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center p-4">
            <div className="w-16 h-24 relative mr-4 flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={`${movie.title} poster`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{movie.title}</h3>
              <p className="text-sm text-muted-foreground">
                {movie.year} • {movie.director}
              </p>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm">{movie.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex flex-col items-center ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <p className="text-sm text-muted-foreground">
                  {movie.overview}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
