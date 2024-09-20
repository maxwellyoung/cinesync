import { supabase } from "./supabaseClient";
import { Database } from "./database.types";
import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Movie as ApiMovie } from "./api";

type DbMovie = Database["public"]["Tables"]["movies"]["Row"];

export function generateUUID(userId: string): string {
  return uuidv4({ random: Buffer.from(userId) });
}

export async function saveToWatchlist(
  userId: string,
  movie: ApiMovie
): Promise<void> {
  const supabase = createClientComponentClient<Database>();
  const { error } = await supabase.from("watchlist").insert({
    user_id: userId,
    movie_id: movie.id,
  });

  if (error) {
    console.error("Error saving to watchlist:", error);
    throw error;
  }
}

export async function getWatchlist(userId: string): Promise<DbMovie[]> {
  const supabaseUserId = generateUUID(userId);
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
  friendId?: string
): Promise<DbMovie[]> {
  let query = supabase
    .from("watchlist")
    .select("*, movies(*)")
    .eq("user_id", userId);

  if (friendId) {
    query = query.or(`user_id.eq.${friendId}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching combined watchlist:", error);
    return [];
  }

  return data.map((item) => item.movies as DbMovie);
}

// ... rest of the file
