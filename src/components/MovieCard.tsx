import { Movie } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  movie: Movie;
  onAddToWatchlist: (movie: Movie) => Promise<void>;
}

export function MovieCard({ movie, onAddToWatchlist }: MovieCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <div className="relative w-full h-[300px] mb-2">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold">{movie.title}</h3>
      <p className="text-sm text-gray-600">{movie.year.toString()}</p>
      <Button onClick={() => onAddToWatchlist(movie)} className="mt-2">
        Add to Watchlist
      </Button>
    </div>
  );
}
