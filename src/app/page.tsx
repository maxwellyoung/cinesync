import { CineSync } from "@/components/cine-sync";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { Movie } from "@/lib/types";
import { Database } from "@/lib/database.types";

type WatchlistItem = Database["public"]["Tables"]["watchlist"]["Row"];

export default async function Home() {
  const { userId } = auth();
  const supabase = createServerSupabaseClient();

  const { data: watchlist, error } = await supabase
    .from("watchlist")
    .select("*, movies(*)")
    .eq("user_id", userId || "");

  if (error) {
    console.error("Error fetching watchlist:", error);
  }

  // Map the Supabase data to the Movie type
  const typedWatchlist: Movie[] = watchlist
    ? (watchlist as (WatchlistItem & { movies: Movie })[]).map((item) => ({
        id: item.movies.id,
        title: item.movies.title,
        year: item.movies.year,
        director: item.movies.director,
        rating: item.movies.rating,
        overview: item.movies.overview,
        poster_path: item.movies.poster_path,
        posterUrl: item.movies.poster_path, // Add this line
        tmdb_id: item.movies.tmdb_id,
        vote_average: item.movies.vote_average,
      }))
    : [];

  return <CineSync initialWatchlist={typedWatchlist} />;
}
