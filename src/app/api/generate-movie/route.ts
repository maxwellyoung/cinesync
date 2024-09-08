import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getCombinedWatchlist } from "@/lib/db";
import { Movie } from "@/lib/api";

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, userId, friendId } = await req.json();

  let watchlist: Movie[] = [];
  if (userId && friendId) {
    watchlist = await getCombinedWatchlist(userId, friendId);
  }

  const watchlistContext =
    watchlist.length > 0
      ? `Consider the combined watchlist: ${watchlist
          .map((m) => m.title)
          .join(", ")}.`
      : "";

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a movie recommendation system. ${watchlistContext} Respond with a movie suggestion in the following JSON format:
        {
          "title": "Movie Title",
          "year": 2023,
          "director": "Director Name",
          "rating": 8.5,
          "overview": "Brief movie overview"
        }
        If you cannot provide a movie recommendation, respond with: {"error": "Unable to generate movie recommendation"}`,
      },
      { role: "user", content: prompt },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onCompletion: (completion) => {
      try {
        const movieData = JSON.parse(completion);
        if (
          !movieData.title ||
          !movieData.year ||
          !movieData.director ||
          !movieData.rating ||
          !movieData.overview
        ) {
          console.error("Invalid movie data:", movieData);
        }
      } catch (error) {
        console.error("Error parsing movie data:", error);
      }
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
