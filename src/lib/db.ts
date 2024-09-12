import { supabase } from "./supabaseClient";
import { Database } from "./database.types";
import { v4 as uuidv4 } from "uuid";

type Movie = Database["public"]["Tables"]["movies"]["Row"];

function generateUUID(userId: string): string {
  return uuidv4({ random: Buffer.from(userId) });
}

export async function saveToWatchlist(
  userId: string,
  movie: Omit<Movie, "id">
): Promise<void> {
  const uuidUserId = generateUUID(userId);

  // Check if the user exists in the users table
  const { error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("id", uuidUserId)
    .single();

  if (userError) {
    if (userError.code === "PGRST116") {
      // User doesn't exist, so we'll create them
      const { error: createUserError } = await supabase
        .from("users")
        .insert({ id: uuidUserId, username: `user_${userId.slice(0, 8)}` })
        .select();

      if (createUserError) {
        console.error("Error creating user:", createUserError);
        throw createUserError;
      }
    } else {
      console.error("Error checking user:", userError);
      throw userError;
    }
  }

  // First, insert the movie into the movies table
  const { data: movieData, error: movieError } = await supabase
    .from("movies")
    .upsert(
      {
        title: movie.title,
        year: movie.year,
        director: movie.director,
        rating: movie.rating,
        overview: movie.overview || "",
        poster_path: movie.poster_path || null,
        tmdb_id: movie.tmdb_id || null,
      },
      { onConflict: "title,year" }
    )
    .select()
    .single();

  if (movieError) {
    console.error("Error saving movie:", movieError);
    throw movieError;
  }

  // Insert the entry into the watchlist table
  const { error: watchlistError } = await supabase.from("watchlist").insert({
    user_id: userId,
    movie_id: movieData.id,
    status: "unwatched",
  });

  if (watchlistError) {
    if (watchlistError.code === "23505") {
      console.log("Movie already in watchlist");
      return;
    }
    console.error("Error saving to watchlist:", watchlistError);
    throw watchlistError;
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
