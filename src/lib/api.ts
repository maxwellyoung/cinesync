import OpenAI from "openai";

console.log("Environment variables:", {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Set" : "Not set",
  NODE_ENV: process.env.NODE_ENV,
});

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

console.log("OpenAI client initialized:", !!openai);

export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  rating: number;
  overview: string;
  poster_path: string | null;
}

export async function generateMovie(prompt: string): Promise<Movie> {
  if (!openai) {
    console.error("OpenAI client not initialized");
    throw new Error("OpenAI API key is not configured");
  }

  try {
    console.log("Sending request to OpenAI with prompt:", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that suggests movies based on user prompts. Respond with a movie suggestion in the following format: Title|Year|Director|Rating|Overview",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("Received response from OpenAI:", completion);

    const movieSuggestion = completion.choices[0]?.message?.content;
    if (!movieSuggestion) {
      console.error("OpenAI response did not contain a movie suggestion");
      throw new Error("OpenAI response did not contain a movie suggestion");
    }

    console.log("Raw OpenAI response:", movieSuggestion);

    const parts = movieSuggestion.split("|");
    if (parts.length !== 5) {
      console.error(`Invalid movie suggestion format: ${movieSuggestion}`);
      throw new Error(`Invalid movie suggestion format: ${movieSuggestion}`);
    }

    const [title, yearStr, director, ratingStr, overview] = parts;

    const year = parseInt(yearStr.trim(), 10);
    if (isNaN(year)) {
      console.error(`Invalid year: ${yearStr}`);
      throw new Error(`Invalid year: ${yearStr}`);
    }

    const rating = parseFloat(ratingStr.trim());
    if (isNaN(rating)) {
      console.error(`Invalid rating: ${ratingStr}`);
      throw new Error(`Invalid rating: ${ratingStr}`);
    }

    const movie: Movie = {
      id: Math.floor(Math.random() * 1000000),
      title: title.trim(),
      year,
      director: director.trim(),
      rating,
      overview: overview.trim(),
      poster_path: null,
    };

    console.log("Generated movie:", movie);
    return movie;
  } catch (error: unknown) {
    console.error("Error in generateMovie function:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate movie: ${error.message}`);
    } else {
      throw new Error("Failed to generate movie: Unknown error");
    }
  }
}

export async function getWatchlist(userId: string): Promise<Movie[]> {
  console.log(`Fetching watchlist for user: ${userId}`);
  // Implement this function to fetch the user's watchlist from your database
  // For now, we'll return a mock watchlist
  return [
    {
      id: 1,
      title: "Inception",
      year: 2010,
      director: "Christopher Nolan",
      rating: 8.8,
      overview:
        "A thief who enters the dreams of others to steal secrets from their subconscious.",
      poster_path:
        "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    },
    // Add more mock movies as needed
  ];
}
