import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { movie } = await req.json();

  // Here, you would typically save the movie to your database
  // For now, we'll just log it and return a success response
  console.log(`Saving movie to watchlist for user ${userId}:`, movie);

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

  // Here, you would typically remove the movie from your database
  // For now, we'll just log it and return a success response
  console.log(`Removing movie from watchlist for user ${userId}:`, movieId);

  return NextResponse.json({ success: true });
}
