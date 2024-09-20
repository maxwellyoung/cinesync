import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prompt, refinements } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that generates movie search refinement suggestions.",
        },
        {
          role: "user",
          content: `Generate 5 refinement suggestions for the movie search: "${prompt}". 
          Current refinements: ${refinements.join(", ")}.
          Provide diverse and specific suggestions that could help narrow down the movie search.
          Consider genres, time periods, themes, directors, actors, or any other relevant movie attributes.
          Return the suggestions as a JSON array of strings.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const suggestionsData = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    return NextResponse.json({
      suggestions: suggestionsData.suggestions || [],
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
