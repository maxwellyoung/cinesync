export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  rating: number | string;
  overview: string;
  poster_path: string | null;
}
