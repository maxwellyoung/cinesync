import { supabase } from "@/lib/supabaseClient";
import { Movie } from "./types";

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
    .select("*, movies(*)")
    .eq("user_id", userData.id);

  if (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }

  // Log the data structure
  console.log("Watchlist data:", JSON.stringify(data, null, 2));

  // Process the data
  return (data?.map((item: { movies: Movie }) => ({
    ...item.movies,
    posterUrl: item.movies.poster_path,
    vote_average: item.movies.vote_average ?? item.movies.rating, // Use rating as fallback
  })) || []) as Movie[];
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

export const addToWatchlist = async (
  userId: string,
  movie: Movie
): Promise<void> => {
  const userUUID = await getUserUUID(userId);

  // Check if the movie is already in the watchlist
  const { data: existingMovie, error: checkError } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", userUUID)
    .eq("movie_id", movie.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 is the code for no rows found
    console.error("Error checking watchlist:", checkError);
    throw checkError;
  }

  if (existingMovie) {
    console.log("Movie already in watchlist");
    return;
  }

  const { error } = await supabase.from("watchlist").insert({
    user_id: userUUID,
    movie_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average:
      movie.vote_average !== null ? Math.round(movie.vote_average * 10) : null, // Handle null case
    year: movie.year,
    director: movie.director,
    rating: Math.round(movie.rating * 10), // Round to nearest integer (0-100 scale)
    overview: movie.overview,
    status: "to_watch", // Add a default status
  });

  if (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
};

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

export async function getFriends(userId: string) {
  try {
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!userData) {
      throw new Error("User not found");
    }

    const { data: friendships, error } = await supabase
      .from("friendships")
      .select("friend_id")
      .eq("user_id", userData.id);

    if (error) {
      throw error;
    }

    return friendships.map((friendship) => friendship.friend_id);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  }
}

// Export the Movie type
export type { Movie };
