import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getWatchlist,
  saveToWatchlist,
  removeFromWatchlist,
  addFriend,
  removeFriend,
  getCombinedWatchlist,
} from "@/lib/db";
import { Movie } from "@/lib/api";

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const friendId = searchParams.get("friendId");

  if (friendId) {
    const combinedWatchlist = await getCombinedWatchlist(userId, friendId);
    return NextResponse.json(combinedWatchlist);
  } else {
    const watchlist = await getWatchlist(userId);
    return NextResponse.json(watchlist);
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const movie: Movie = await req.json();
  await saveToWatchlist(userId, movie);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  const friendId = searchParams.get("friendId");

  if (movieId) {
    await removeFromWatchlist(userId, parseInt(movieId));
  } else if (friendId) {
    await removeFriend(userId, friendId);
  } else {
    return NextResponse.json(
      { error: "Movie ID or Friend ID is required" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { friendId } = await req.json();
  await addFriend(userId, friendId);

  return NextResponse.json({ success: true });
}
