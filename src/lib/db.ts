import { supabase } from "./supabaseClient";
import { Database } from "./database.types";
import { Movie } from "./types";

type Tables = Database["public"]["Tables"];

export async function saveToWatchlist(
  userId: string,
  movie: Omit<Tables["watchlist"]["Insert"], "user_id">
): Promise<void> {
  if (movie.id === undefined) {
    throw new Error("Movie ID is undefined");
  }

  const watchlistItem = {
    user_id: userId,
    ...movie,
    // Ensure all required fields are present and of the correct type
    id: movie.id,
    title: movie.title,
    year: movie.year,
    director: movie.director,
    rating: typeof movie.rating === "number" ? movie.rating : 0,
    overview: movie.overview,
    poster_path: movie.poster_path || null,
  };

  const { error } = await supabase
    .from("watchlist")
    .upsert(watchlistItem, { onConflict: "user_id, id" });

  if (error) {
    console.error("Error saving to watchlist:", error);
    throw error;
  }
}

export async function getWatchlist(userId: string): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }

  return (data as Movie[]) || [];
}

export async function removeFromWatchlist(
  userId: string,
  movieId: number
): Promise<void> {
  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", userId)
    .eq("id", movieId);

  if (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
}

export async function getCombinedWatchlist(userId: string): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching combined watchlist:", error);
    return [];
  }

  return (data as Movie[]) || [];
}

// Update other functions similarly, using the correct table names and types
