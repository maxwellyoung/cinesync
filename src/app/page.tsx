import { CineSync } from "@/components/cine-sync";
import { auth } from "@clerk/nextjs/server";
import { getWatchlist } from "@/lib/api";

export default async function Home() {
  const { userId } = auth();
  const watchlist = userId ? await getWatchlist(userId) : [];

  return <CineSync initialWatchlist={watchlist} />;
}
