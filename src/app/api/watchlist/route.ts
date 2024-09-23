import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getWatchlist,
  removeFromWatchlist,
  addFriend,
  removeFriend,
  getCombinedWatchlist,
  ensureUserExists,
} from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await ensureUserExists(userId);
    const supabaseUserId = userData.id;

    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get("friendId");

    if (friendId) {
      const combinedWatchlist = await getCombinedWatchlist(
        supabaseUserId,
        friendId
      );
      return NextResponse.json(combinedWatchlist);
    } else {
      const watchlist = await getWatchlist(supabaseUserId);
      return NextResponse.json(watchlist);
    }
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Clerk userId:", userId);

    const userData = await ensureUserExists(userId);
    console.log("Supabase userData:", userData);

    const supabaseUserId = userData.id;
    console.log("Supabase userId:", supabaseUserId);

    const body = await req.json();
    console.log("Received request body:", body);

    const {
      title,
      posterPath,
      voteAverage,
      year,
      director,
      rating,
      overview,
      tmdbId,
    } = body;

    // Check if the movie is already in the watchlist
    const { data: existingMovie, error: checkError } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", supabaseUserId)
      .eq("movie_id", tmdbId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is the code for no rows found
      console.error("Error checking watchlist:", checkError);
      throw checkError;
    }

    if (existingMovie) {
      console.log("Movie already in watchlist");
      return NextResponse.json({ message: "Movie already in watchlist" });
    }

    // Insert the movie into the movies table
    const { data: movieData, error: movieError } = await supabase
      .from("movies")
      .upsert(
        {
          title,
          poster_path: posterPath,
          vote_average: voteAverage, // This is now either null or an integer (0-1000)
          year,
          director,
          rating, // This is now an integer (0-1000)
          overview,
          tmdb_id: tmdbId,
        },
        { onConflict: "title" }
      )
      .select()
      .single();

    if (movieError) {
      console.error("Supabase error:", movieError);
      return NextResponse.json(
        { error: `Failed to add movie: ${movieError.message}` },
        { status: 500 }
      );
    }

    // Then, add the movie to the user's watchlist
    const { data, error } = await supabase
      .from("watchlist")
      .insert({
        user_id: supabaseUserId,
        movie_id: movieData.id,
        status: "to_watch",
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Failed to add movie to watchlist: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Movie added to watchlist", data });
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    return NextResponse.json(
      {
        error: `Failed to add movie to watchlist: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
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

  try {
    const userData = await ensureUserExists(userId);
    const supabaseUserId = userData.id;

    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");
    const friendId = searchParams.get("friendId");

    if (movieId) {
      await removeFromWatchlist(supabaseUserId, parseInt(movieId));
    } else if (friendId) {
      await removeFriend(supabaseUserId, friendId);
    } else {
      return NextResponse.json(
        { error: "Movie ID or Friend ID is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE operation:", error);
    return NextResponse.json(
      { error: "Failed to perform DELETE operation" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await ensureUserExists(userId);
    const supabaseUserId = userData.id;

    const { friendId } = await req.json();
    await addFriend(supabaseUserId, friendId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PUT operation:", error);
    return NextResponse.json(
      { error: "Failed to perform PUT operation" },
      { status: 500 }
    );
  }
}
