import { supabase } from "@/lib/supabaseClient";
import { Database } from "./database.types";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type Movie = Database["public"]["Tables"]["movies"]["Row"];
export type WatchlistItem = Database["public"]["Tables"]["watchlist"]["Row"];

async function fetchMoviePoster(
  title: string,
  year?: number
): Promise<string | null> {
  try {
    const yearParam = year ? `&year=${year}` : "";
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        title
      )}${yearParam}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
    }
  } catch (error) {
    console.error("Error fetching movie poster:", error);
  }
  return null;
}

export async function generateMovie(
  prompt: string,
  userId: string,
  suggestedMovies: Movie[] = [],
  selectedFriend: string | null,
  includeWatchlist: boolean
): Promise<Movie | null> {
  try {
    console.log("Sending request to generate movie...");
    const response = await fetch("/api/generate-movie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        userId,
        suggestedMovies,
        selectedFriend,
        includeWatchlist,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const movieData = await response.json();
    console.log("Received movie data:", movieData);

    if (
      !movieData.title ||
      !movieData.year ||
      !movieData.director ||
      !movieData.rating ||
      !movieData.overview
    ) {
      throw new Error("Invalid movie data received");
    }

    const movie: Movie = {
      id: Math.floor(Math.random() * 1000000),
      title: movieData.title,
      year: parseInt(movieData.year, 10),
      director: movieData.director,
      rating: parseFloat(movieData.rating) || 0,
      overview: movieData.overview,
      poster_path: null,
      tmdb_id: null,
    };

    // Check if the movie is already in suggestedMovies
    const isDuplicate = suggestedMovies.some(
      (suggestedMovie) =>
        suggestedMovie.title === movie.title &&
        suggestedMovie.year === movie.year
    );

    if (isDuplicate) {
      console.log("Duplicate movie generated, retrying...");
      return generateMovie(
        prompt,
        userId,
        suggestedMovies,
        selectedFriend,
        includeWatchlist
      );
    }

    // Fetch movie poster
    movie.poster_path = await fetchMoviePoster(movie.title, movie.year);

    console.log("Generated movie:", movie);
    return movie;
  } catch (error: unknown) {
    console.error("Error in generateMovie function:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate movie: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while generating the movie");
    }
  }
}

export async function getWatchlist(userId: string): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*, movies(*)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }

  return data.map((item) => item.movies as Movie);
}

export async function addToWatchlist(
  userId: string,
  movieId: number
): Promise<void> {
  const { error } = await supabase
    .from("watchlists")
    .insert({ user_id: userId, movie_id: movieId });

  if (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
}

export async function removeFromWatchlist(
  userId: string,
  movieId: number
): Promise<void> {
  const { error } = await supabase
    .from("watchlist")
    .delete()
    .match({ user_id: userId, movie_id: movieId });

  if (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
}

export async function getFriends(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("friendships")
    .select("friend_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching friends:", error);
    return [];
  }

  return data.map((friendship) => friendship.friend_id);
}
