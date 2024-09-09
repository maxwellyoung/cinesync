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
    .select("*")
    .eq("user_id", userId || "");

  if (error) {
    console.error("Error fetching watchlist:", error);
  }

  // Map the Supabase data to the Movie type
  const typedWatchlist: Movie[] = watchlist
    ? (watchlist as WatchlistItem[]).map((item) => ({
        id: item.id,
        title: item.title,
        year: item.year,
        director: item.director,
        rating: item.rating,
        overview: item.overview,
        poster_path: item.poster_path,
      }))
    : [];

  return <CineSync initialWatchlist={typedWatchlist} />;
}
