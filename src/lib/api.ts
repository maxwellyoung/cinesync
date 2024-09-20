import { supabase } from "@/lib/supabaseClient";
import { Database } from "./database.types";
import { Movie } from "./types";

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

  return (data?.map((item) => item.movies) as Movie[]) || [];
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

export async function removeFromWatchlist(
  userId: string,
  movieId: number
): Promise<void> {
  const userUUID = await getUserUUID(userId);
  const { error } = await supabase
    .from("watchlist")
    .delete()
    .match({ user_id: userUUID, movie_id: movieId });

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
