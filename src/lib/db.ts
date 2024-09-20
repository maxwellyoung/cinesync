import { supabase } from "./supabaseClient";
import { Database } from "./database.types";
import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Movie } from "./api";

type Movie = Database["public"]["Tables"]["movies"]["Row"];

export function generateUUID(userId: string): string {
  return uuidv4({ random: Buffer.from(userId) });
}

export async function saveToWatchlist(
  userId: string,
  movie: Omit<Movie, "id">
): Promise<void> {
  const supabase = createClientComponentClient();
  const supabaseUserId = generateUUID(userId);

  try {
    // First, ensure the user exists in the users table
    const { error: userError } = await supabase
      .from("users")
      .upsert({
        id: supabaseUserId,
        clerk_id: userId,
        username: `user_${supabaseUserId.slice(0, 8)}`, // Generate a temporary username
        email: `user_${supabaseUserId.slice(0, 8)}@example.com`, // Generate a temporary email
      })
      .select()
      .single();

    if (userError) {
      throw new Error(`Error ensuring user exists: ${userError.message}`);
    }

    // Then, insert or select the movie from the movies table
    const { data: movieData, error: movieError } = await supabase
      .from("movies")
      .upsert({
        title: movie.title,
        year: movie.year,
        director: movie.director,
        rating: movie.rating,
        overview: movie.overview || "",
        poster_path: movie.poster_path || null,
        tmdb_id: movie.tmdb_id || null,
      })
      .select()
      .single();

    if (movieError) {
      throw new Error(`Error saving movie: ${movieError.message}`);
    }

    // Finally, add the entry to the watchlist table
    const { error: watchlistError } = await supabase.from("watchlist").upsert(
      {
        user_id: supabaseUserId,
        movie_id: movieData.id,
        status: "to_watch", // Add a default status
      },
      {
        onConflict: "user_id,movie_id",
      }
    );

    if (watchlistError) {
      throw new Error(`Error saving to watchlist: ${watchlistError.message}`);
    }
  } catch (error) {
    console.error("Error in saveToWatchlist:", error);
    throw error;
  }
}

export async function getWatchlist(userId: string): Promise<Movie[]> {
  const supabaseUserId = generateUUID(userId);
  const { data, error } = await supabase
    .from("watchlist")
    .select("*, movies(*)")
    .eq("user_id", supabaseUserId);

  if (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }

  return data.map((item) => item.movies as Movie);
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
): Promise<Movie[]> {
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

  return data.map((item) => item.movies as Movie);
}

// ... rest of the file
