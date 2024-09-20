export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  rating: number;
  overview: string;
  poster_path: string | null;
  user_id?: string;
  posterUrl?: string; // Add this for compatibility with DiscoverSearch
  tmdb_id: number | null; // Add this line
}

// Remove the WatchlistMovie interface if it's not being used
