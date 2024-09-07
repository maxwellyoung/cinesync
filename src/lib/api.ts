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
  const response = await fetch("/api/generate-movie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate movie");
  }

  return response.json();
}
