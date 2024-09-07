import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getWatchlist, saveWatchlist } from "@/lib/db";
import { Movie } from "@/lib/api";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { movie } = await req.json();
  const watchlist = getWatchlist(userId);
  watchlist.push(movie);
  saveWatchlist(userId, watchlist);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return NextResponse.json(
      { error: "Movie ID is required" },
      { status: 400 }
    );
  }

  const watchlist = getWatchlist(userId);
  const updatedWatchlist = watchlist.filter(
    (m: Movie) => m.id !== parseInt(movieId)
  );
  saveWatchlist(userId, updatedWatchlist);

  return NextResponse.json({ success: true });
}
