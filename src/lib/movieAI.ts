import { Movie } from "./types";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMovie(prompt: string): Promise<Movie> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a movie expert AI that generates movie ideas based on prompts.",
        },
        {
          role: "user",
          content: `Generate a movie idea based on this prompt: ${prompt}. Include title, year, director, overview, and rating out of 5.`,
        },
      ],
    });

    const movieIdea = completion.choices[0].message.content;
    if (!movieIdea) {
      throw new Error("No movie idea generated");
    }

    const { title, year, director, overview, rating } = JSON.parse(movieIdea);

    return {
      id: Math.floor(Math.random() * 1000000), // Generate a random ID
      title: title.trim(),
      year: parseInt(year.trim()),
      director: director.trim(),
      rating: parseFloat(rating.trim()),
      overview: overview.trim(),
      poster_path: "", // Set to empty string initially
      posterUrl: "", // Set to empty string initially
      tmdb_id: null,
      vote_average: null,
    };
  } catch (error) {
    console.error("Error generating movie:", error);
    throw new Error("Failed to generate movie");
  }
}
