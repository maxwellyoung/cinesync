import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getCombinedWatchlist } from "@/lib/db";
import { Movie } from "@/lib/types";

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, userId, suggestedMovies } = await req.json();

  try {
    const watchlist: Movie[] = await getCombinedWatchlist(userId);

    const watchlistContext =
      watchlist.length > 0
        ? `Consider the user's watchlist: ${watchlist
            .map((m: Movie) => m.title)
            .join(", ")}.`
        : "";

    const suggestedMoviesContext =
      suggestedMovies.length > 0
        ? `Do not suggest these movies: ${suggestedMovies
            .map((m: Movie) => m.title)
            .join(", ")}.`
        : "";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable movie recommendation assistant. ${watchlistContext} ${suggestedMoviesContext} When given a prompt, always suggest a movie, even if the prompt is broad or vague. Use your knowledge of popular and critically acclaimed films to make educated guesses. Respond with a movie suggestion in the following format:

Title: [Movie Title]
Year: [4-digit year]
Director: [Director's name]
Rating: [Rating as a number between 1 and 10]
Overview: [Brief overview of the movie]

Ensure all fields are present and correctly formatted. If the prompt is very broad, choose a highly rated or popular movie that fits the category. Never respond with "I'm sorry" or "I couldn't find a suitable movie". Instead, make your best recommendation based on the given information.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in generate-movie route:", error);
    return new Response(JSON.stringify({ error: "Failed to generate movie" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
