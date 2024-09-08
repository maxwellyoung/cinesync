import { createClient } from "@supabase/supabase-js";
import { Movie } from "./api";

interface UserSearchResult {
  id: string;
  username: string;
  email: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export async function saveToWatchlist(
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

export async function addFriend(
  userId: string,
  friendId: string
): Promise<void> {
  const { error } = await supabase
    .from("friends")
    .insert({ user_id: userId, friend_id: friendId });

  if (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
}

export async function getFriends(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("friends")
    .select("friend_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching friends:", error);
    return [];
  }

  return data.map((friend) => friend.friend_id);
}

export async function getCombinedWatchlist(
  userId: string,
  friendId: string
): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .or(`user_id.eq.${userId},user_id.eq.${friendId}`);

  if (error) {
    console.error("Error fetching combined watchlist:", error);
    return [];
  }

  return data || [];
}

export async function removeFriend(
  userId: string,
  friendId: string
): Promise<void> {
  const { error } = await supabase
    .from("friends")
    .delete()
    .match({ user_id: userId, friend_id: friendId });

  if (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
}

export async function searchUsers(
  searchTerm: string
): Promise<UserSearchResult[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, email")
    .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    .limit(10);

  if (error) {
    console.error("Error searching users:", error);
    throw error;
  }

  return data || [];
}

export async function sendFriendRequest(
  userId: string,
  friendId: string
): Promise<void> {
  const { error } = await supabase
    .from("friend_requests")
    .insert({ user_id: userId, friend_id: friendId });

  if (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
}

export async function inviteFriend(email: string): Promise<void> {
  // Implement your invitation logic here
  // This might involve sending an email or creating a record in a 'invitations' table
  console.log(`Invitation sent to ${email}`);
}

export async function getSearchSuggestions(
  userId: string,
  searchTerm: string
): Promise<string[]> {
  // Fetch popular movies, genres, and user's watch history
  const { data: popularMovies, error: popularError } = await supabase
    .from("movies")
    .select("title")
    .order("popularity", { ascending: false })
    .limit(5);

  const { data: genres, error: genresError } = await supabase
    .from("genres")
    .select("name")
    .ilike("name", `%${searchTerm}%`)
    .limit(3);

  const { data: watchHistory, error: watchHistoryError } = await supabase
    .from("watchlist")
    .select("title")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (popularError || genresError || watchHistoryError) {
    console.error(
      "Error fetching search suggestions:",
      popularError || genresError || watchHistoryError
    );
    return [];
  }

  const suggestions = [
    ...(popularMovies?.map((m) => m.title) || []),
    ...(genres?.map((g) => g.name) || []),
    ...(watchHistory?.map((m) => m.title) || []),
  ];

  return suggestions.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
