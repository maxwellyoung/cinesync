import { supabase } from "@/lib/supabaseClient";
import { Movie } from "./types";

// Define a type for the data we receive from Supabase
type WatchlistItem = {
  movies: Movie[];
};

// Remove these unused constants
// const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
// const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Remove or comment out the unused function
// async function fetchMoviePoster(
//   title: string,
//   year?: number
// ): Promise<string | null> {
//   ...
// }

export async function getWatchlist(userId: string): Promise<Movie[]> {
  // First, get the UUID for the user
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
    throw userError;
  }

  if (!userData) {
    console.error("User not found");
    return [];
  }

  // Now use the UUID to fetch the watchlist
  const { data, error } = await supabase
    .from("watchlist")
    .select("movies(*)")
    .eq("user_id", userData.id);

  if (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }

  // Log the data structure
  console.log("Watchlist data:", JSON.stringify(data, null, 2));

  // Process the data
  return (data?.flatMap((item: WatchlistItem) =>
    item.movies.map((movie) => ({
      ...movie,
      posterUrl: movie.poster_path,
    }))
  ) || []) as Movie[];
}

async function getUserUUID(clerkUserId: string): Promise<string> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkUserId)
    .single();

  if (error) {
    console.error("Error fetching user UUID:", error);
    throw error;
  }

  if (!data) {
    console.error("User not found");
    throw new Error("User not found");
  }

  return data.id;
}

export async function addToWatchlist(
  userId: string,
  movieId: number
): Promise<void> {
  const userUUID = await getUserUUID(userId);
  const { error } = await supabase
    .from("watchlist")
    .insert({ user_id: userUUID, movie_id: movieId });

  if (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
}

export const removeFromWatchlist = async (
  userId: string,
  movieId: number
): Promise<void> => {
  const userUUID = await getUserUUID(userId);
  const { error } = await supabase
    .from("watchlist")
    .delete()
    .match({ user_id: userUUID, movie_id: movieId });

  if (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
};

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

// Export the Movie type
export type { Movie };
