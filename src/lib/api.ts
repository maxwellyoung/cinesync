import { supabase } from "@/lib/supabaseClient";

export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  rating: number | string; // Change this to allow string ratings
  overview: string;
  poster_path: string | null;
}

export async function generateMovie(
  prompt: string,
  userId: string,
  suggestedMovies: Movie[] = []
): Promise<Movie | null> {
  try {
    const response = await fetch("/api/generate-movie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, userId, suggestedMovies }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate movie");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let movieSuggestion = "";

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      movieSuggestion += decoder.decode(value);
    }

    console.log("Raw OpenAI response:", movieSuggestion);

    // Parse the movie suggestion
    const title = movieSuggestion.match(/Title: (.+)/)?.[1];
    const year = movieSuggestion.match(/Year: (\d{4})/)?.[1];
    const director = movieSuggestion.match(/Director: (.+)/)?.[1];
    const rating = movieSuggestion.match(/Rating: (.+)/)?.[1];
    const overview = movieSuggestion.match(/Overview: (.+)/s)?.[1];

    if (!title || !year || !director || !rating || !overview) {
      console.error("Invalid movie suggestion format:", movieSuggestion);
      throw new Error("Failed to parse movie suggestion");
    }

    const movie: Movie = {
      id: Math.floor(Math.random() * 1000000),
      title: title.trim(),
      year: parseInt(year.trim(), 10),
      director: director.trim(),
      rating: isNaN(parseFloat(rating)) ? rating.trim() : parseFloat(rating),
      overview: overview.trim(),
      poster_path: null,
    };

    console.log("Generated movie:", movie);
    return movie;
  } catch (error: unknown) {
    console.error("Error in generateMovie function:", error);
    throw error;
  }
}

export async function getWatchlist(userId: string): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }

  return (data as Movie[]) || [];
}
