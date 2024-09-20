import { Movie } from "./types";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMovieSuggestion(
  prompt: string,
  previousSuggestions: string[],
  friendId: string | null,
  includeWatchlist: boolean
): Promise<Movie> {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a movie recommendation AI." },
      {
        role: "user",
        content: `Suggest a movie based on: ${prompt}. Previous suggestions: ${previousSuggestions.join(
          ", "
        )}. Friend ID: ${friendId}. Include watchlist: ${includeWatchlist}`,
      },
    ],
  });

  const suggestion = completion.choices[0].message.content;

  if (!suggestion) {
    throw new Error("No suggestion received from OpenAI");
  }

  // Parse the suggestion into a Movie object
  // This is a simplified example, you might need to adjust based on the AI's output format
  const [title, year, director, rating, overview] = suggestion.split("|");

  return {
    id: Math.floor(Math.random() * 1000000), // Generate a random ID
    title: title.trim(),
    year: parseInt(year.trim()),
    director: director.trim(),
    rating: parseFloat(rating.trim()),
    overview: overview.trim(),
    poster_path: null, // Set to null initially
    tmdb_id: null,
  };
}
