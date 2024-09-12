import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt, suggestedMovies } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a movie recommendation assistant. Suggest a movie based on the user's prompt. Respond with a JSON object containing title, year, director, rating, and overview. Ensure the suggestion is not in the list of previously suggested movies.",
        },
        {
          role: "user",
          content: `Prompt: ${prompt}\nPreviously suggested movies: ${JSON.stringify(
            suggestedMovies
          )}`,
        },
      ],
      temperature: 0.8, // Increase randomness
      max_tokens: 300, // Adjust as needed
    });

    const suggestion = completion.choices[0].message.content;

    if (!suggestion) {
      throw new Error("No suggestion generated");
    }

    // Parse the suggestion as JSON
    const movieData = JSON.parse(suggestion);

    // Ensure all required fields are present
    if (
      !movieData.title ||
      !movieData.year ||
      !movieData.director ||
      !movieData.rating ||
      !movieData.overview
    ) {
      throw new Error("Invalid movie data generated");
    }

    return NextResponse.json(movieData);
  } catch (error) {
    console.error("Error generating movie:", error);
    return NextResponse.json(
      { error: "Failed to generate movie" },
      { status: 500 }
    );
  }
}
