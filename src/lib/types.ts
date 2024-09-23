export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  year: string;
  director: string;
  rating: number;
  overview: string;
}

// Remove the WatchlistMovie interface if it's not being used
