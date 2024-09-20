import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getWatchlist,
  saveToWatchlist,
  removeFromWatchlist,
  addFriend,
  removeFriend,
  getCombinedWatchlist,
  generateUUID,
} from "@/lib/db";
import { Movie } from "@/lib/api";

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUserId = generateUUID(userId);
  const { searchParams } = new URL(req.url);
  const friendId = searchParams.get("friendId");

  if (friendId) {
    const combinedWatchlist = await getCombinedWatchlist(
      supabaseUserId,
      generateUUID(friendId)
    );
    return NextResponse.json(combinedWatchlist);
  } else {
    const watchlist = await getWatchlist(supabaseUserId);
    return NextResponse.json(watchlist);
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUserId = generateUUID(userId);
    const movie: Movie = await req.json();
    await saveToWatchlist(supabaseUserId, movie);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUserId = generateUUID(userId);
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  const friendId = searchParams.get("friendId");

  if (movieId) {
    await removeFromWatchlist(supabaseUserId, parseInt(movieId));
  } else if (friendId) {
    await removeFriend(supabaseUserId, generateUUID(friendId));
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

  const supabaseUserId = generateUUID(userId);
  const { friendId } = await req.json();
  await addFriend(supabaseUserId, generateUUID(friendId));

  return NextResponse.json({ success: true });
}
