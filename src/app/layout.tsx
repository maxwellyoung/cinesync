import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CineSync - AI-Powered Movie Recommendations",
  description:
    "Discover your next favorite movie with CineSync's AI-powered recommendation engine.",
  keywords: ["movies", "recommendations", "AI", "watchlist", "cinema"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <body>{children}</body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
