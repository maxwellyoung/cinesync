import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Star, Trash2 } from "lucide-react";
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
      className="flex-grow flex flex-col items-center space-y-8 p-4"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {watchlist.map((movie) => (
            <WatchlistItem
              key={movie.id}
              movie={movie}
              onRemove={() => handleRemoveFromWatchlist(movie.id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function EmptyWatchlist({ onDiscoverClick }: { onDiscoverClick: () => void }) {
  return (
    <div className="text-center">
      <p className="text-xl mb-4">Your watchlist is empty.</p>
      <Button onClick={onDiscoverClick}>Discover Movies</Button>
    </div>
  );
}

function WatchlistItem({
  movie,
  onRemove,
}: {
  movie: Movie;
  onRemove: () => void;
}) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{movie.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="aspect-w-2 aspect-h-3 mb-4">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`${movie.title} poster`}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="flex items-center mb-2">
          <Star className="w-5 h-5 text-yellow-400 mr-1" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {movie.overview}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={onRemove} className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}
