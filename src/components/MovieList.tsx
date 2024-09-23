import { Suspense } from "react";
import { MovieSkeleton } from "./MovieSkeleton";
import { MovieCard } from "./MovieCard";
import { Movie } from "@/lib/types";

interface MovieListProps {
  movies: Movie[];
  onAddToWatchlist: (movie: Movie) => Promise<void>;
}

export function MovieList({ movies, onAddToWatchlist }: MovieListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <Suspense key={movie.id} fallback={<MovieSkeleton />}>
          <MovieCard movie={movie} onAddToWatchlist={onAddToWatchlist} />
        </Suspense>
      ))}
    </div>
  );
}
