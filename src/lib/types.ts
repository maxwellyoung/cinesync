export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  posterUrl: string; // Add this line
  vote_average: number | null; // Change this line
  year: number; // Change this to number
  director: string;
  rating: number;
  overview: string;
  tmdb_id: number | null;
}

// Remove the WatchlistMovie interface if it's not being used
