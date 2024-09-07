import { NextResponse } from "next/server";
import fetch from "node-fetch";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = "https://api.themoviedb.org/3";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    // Search for movies based on the prompt
    const searchResponse = await fetch(
      `${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        prompt
      )}&language=en-US&page=1&include_adult=false`
    );
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      const movie = searchData.results[0];

      // Fetch additional details for the movie
      const detailsResponse = await fetch(
        `${TMDB_API_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const detailsData = await detailsResponse.json();

      return NextResponse.json({
        id: movie.id,
        title: movie.title,
        year: new Date(movie.release_date).getFullYear(),
        director:
          detailsData.credits?.crew.find(
            (person: { job: string }) => person.job === "Director"
          )?.name || "Unknown",
        rating: movie.vote_average,
        overview: movie.overview,
        poster_path: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      });
    } else {
      return NextResponse.json(
        { error: "No movies found matching the prompt" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error generating movie:", error);
    return NextResponse.json(
      { error: "Failed to generate movie" },
      { status: 500 }
    );
  }
}
