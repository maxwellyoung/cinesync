import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchMovieDetails(title: string, year: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      title
    )}&year=${year}`
  );
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const movie = data.results[0];
    return {
      tmdb_id: movie.id,
      poster_path: movie.poster_path,
      rating: movie.vote_average,
    };
  }
  return null;
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      prompt,
      previousSuggestions = [],
      friendId,
      includeWatchlist,
    } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a knowledgeable movie recommendation AI. Provide recommendations in JSON format.",
        },
        {
          role: "user",
          content: `Suggest a movie based on: "${prompt}". 
          ${
            previousSuggestions.length > 0
              ? `Exclude these previously suggested movies: ${previousSuggestions.join(
                  ", "
                )}.`
              : ""
          }
          ${
            friendId
              ? "Consider movies that both users might enjoy together."
              : ""
          }
          ${
            includeWatchlist
              ? "You can include movies from the user's watchlist."
              : "Exclude movies from the user's watchlist."
          }
          Provide a diverse range of suggestions, including lesser-known films that match the criteria.
          Format the response as JSON with fields: title, year, director, overview.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const movieData = JSON.parse(completion.choices[0].message.content || "{}");

    if (!movieData.title) {
      return NextResponse.json(
        { error: "No movie suggestion generated" },
        { status: 404 }
      );
    }

    const tmdbData = await fetchMovieDetails(movieData.title, movieData.year);

    return NextResponse.json({
      id: Math.random(), // This should be replaced with a proper ID when saving to the database
      title: movieData.title,
      year: movieData.year,
      director: movieData.director,
      overview: movieData.overview,
      rating: tmdbData?.rating || null,
      poster_path: tmdbData?.poster_path || null,
      tmdb_id: tmdbData?.tmdb_id || null,
    });
  } catch (error) {
    console.error("Error generating movie:", error);
    return NextResponse.json(
      { error: "Failed to generate movie suggestion" },
      { status: 500 }
    );
  }
}
