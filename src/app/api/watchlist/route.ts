import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getWatchlist, saveWatchlist, removeFromWatchlist } from "@/lib/db";
import { Movie } from "@/lib/api";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const watchlist = await getWatchlist(userId);
  return NextResponse.json(watchlist);
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const movie: Movie = await req.json();
  await saveWatchlist(userId, movie);

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

  await removeFromWatchlist(userId, parseInt(movieId));

  return NextResponse.json({ success: true });
}
