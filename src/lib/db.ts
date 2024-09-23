import { supabase } from "./supabaseClient";
import { Database } from "./database.types";
import { v4 as uuidv4 } from "uuid";

type DbMovie = Database["public"]["Tables"]["movies"]["Row"];

export function generateUUID(): string {
  return uuidv4();
}

export async function ensureUserExists(clerkUserId: string) {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        clerk_id: clerkUserId,
        username: `user_${clerkUserId.substr(0, 8)}`,
        email: `user_${clerkUserId.substr(0, 8)}@example.com`,
      },
      { onConflict: "clerk_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error ensuring user exists:", error);
    throw error;
  }

  return data;
}

export async function getWatchlist(userId: string): Promise<DbMovie[]> {
  const userData = await ensureUserExists(userId);
  const supabaseUserId = userData.id;

  const { data, error } = await supabase
    .from("watchlist")
    .select("*, movies(*)")
    .eq("user_id", supabaseUserId);

  if (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }

  return data.map((item) => item.movies as DbMovie);
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

export async function addFriend(
  userId: string,
  friendId: string
): Promise<void> {
  const { error } = await supabase
    .from("friendships")
    .insert({ user_id: userId, friend_id: friendId });

  if (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
}

export async function removeFriend(
  userId: string,
  friendId: string
): Promise<void> {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .match({ user_id: userId, friend_id: friendId });

  if (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
}

export async function getCombinedWatchlist(
  userId: string,
  friendId: string
): Promise<DbMovie[]> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*, movies(*)")
    .or(`user_id.eq.${userId},user_id.eq.${friendId}`);

  if (error) {
    console.error("Error fetching combined watchlist:", error);
    return [];
  }

  return data.map((item) => item.movies as DbMovie);
}

// ... rest of the file remains unchanged
