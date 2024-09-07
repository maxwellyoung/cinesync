import { supabase } from "./supabase";
import { Movie } from "./api";

export async function getWatchlist(userId: string): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }

  return data || [];
}

export async function saveWatchlist(
  userId: string,
  movie: Movie
): Promise<void> {
  const { error } = await supabase
    .from("watchlist")
    .upsert({ user_id: userId, ...movie });

  if (error) {
    console.error("Error saving to watchlist:", error);
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
    .eq("user_id", userId)
    .eq("id", movieId);

  if (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
}
