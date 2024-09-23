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
          content: `Generate a movie idea based on this prompt: ${prompt}. Include title, year, director, overview, and rating out of 10.`,
        },
      ],
    });

    const movieIdea = completion.choices[0].message.content;
    if (!movieIdea) {
      throw new Error("No movie idea generated");
    }

    const movieDetails = JSON.parse(movieIdea);

    return {
      id: Math.floor(Math.random() * 1000000), // Generate a random ID
      tmdb_id: null, // Set to null as this is a generated movie
      title: movieDetails.title,
      year: movieDetails.year,
      director: movieDetails.director,
      overview: movieDetails.overview,
      rating: movieDetails.rating / 2, // Convert 10-point scale to 5-point scale
      poster_path: "", // Leave empty as we don't generate posters
      posterUrl: "", // Leave empty as we don't generate posters
      vote_average: null, // Set to null as this is a generated movie
    };
  } catch (error) {
    console.error("Error generating movie:", error);
    throw new Error("Failed to generate movie");
  }
}
