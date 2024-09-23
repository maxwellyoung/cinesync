"use client";

import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Sparkles,
  Star,
  Clapperboard,
  BookmarkPlus,
  ExternalLink,
  Check,
  Loader2,
} from "lucide-react";
import { SearchSuggestions } from "./SearchSuggestions";
import { Movie } from "@/lib/types";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";
import { MoviePosterModal } from "./MoviePosterModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";

interface DiscoverSearchProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  handleGenerateMovie: () => void;
  error: string | null;
  movie: Movie | null;
  addToWatchlist: (movie: Movie) => void;
  isInWatchlist: (movie: Movie) => boolean;
  friends?: string[];
  selectedFriend: string | null;
  setSelectedFriend: (friend: string | null) => void;
  includeWatchlist: boolean;
  setIncludeWatchlist: (include: boolean) => void;
}

export function DiscoverSearch({
  prompt,
  setPrompt,
  loading,
  handleGenerateMovie,
  error,
  movie,
  addToWatchlist,
  isInWatchlist,
  friends = [],
  selectedFriend,
  setSelectedFriend,
  includeWatchlist,
  setIncludeWatchlist,
}: DiscoverSearchProps) {
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleGenerateMovie();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    handleGenerateMovie();
  };

  const handleGenerateMovieWithErrorLogging = async () => {
    try {
      await handleGenerateMovie();
    } catch (error) {
      console.error("Detailed error in handleGenerateMovie:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4">
      <motion.h2
        className="text-4xl font-light text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Discover Your Next Favorite Movie
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <SearchSection
            prompt={prompt}
            setPrompt={setPrompt}
            loading={loading}
            handleGenerateMovie={handleGenerateMovieWithErrorLogging}
            handleInputKeyPress={handleInputKeyPress}
            handleSuggestionClick={handleSuggestionClick}
            friends={friends}
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
            includeWatchlist={includeWatchlist}
            setIncludeWatchlist={setIncludeWatchlist}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {error && <ErrorMessage error={error} />}

          {loading && !movie && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </motion.div>
          )}

          {movie && (
            <MovieCard
              movie={movie}
              addToWatchlist={addToWatchlist}
              handleGenerateMovie={handleGenerateMovie}
              isInWatchlist={isInWatchlist}
              setIsPosterModalOpen={setIsPosterModalOpen}
            />
          )}
        </div>
      </div>

      <MoviePosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        posterPath={movie?.poster_path || ""}
        title={movie?.title || ""}
      />
    </div>
  );
}

function SearchSection({
  prompt,
  setPrompt,
  loading,
  handleGenerateMovie,
  handleInputKeyPress,
  handleSuggestionClick,
  friends,
  selectedFriend,
  setSelectedFriend,
  includeWatchlist,
  setIncludeWatchlist,
}: {
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  handleGenerateMovie: () => void;
  handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSuggestionClick: (suggestion: string) => void;
  friends: string[];
  selectedFriend: string | null;
  setSelectedFriend: (friend: string | null) => void;
  includeWatchlist: boolean;
  setIncludeWatchlist: (include: boolean) => void;
}) {
  return (
    <>
      <Input
        type="text"
        placeholder="Enter a movie prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyPress={handleInputKeyPress}
        className="w-full"
      />
      <Button
        onClick={handleGenerateMovie}
        disabled={loading}
        className="w-full flex items-center justify-center"
      >
        {loading ? (
          <>
            Generating
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.2, delayChildren: 0.2 }}
              className="ml-2 flex"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: ["0%", "-50%", "0%"],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="mx-0.5"
                >
                  .
                </motion.span>
              ))}
            </motion.span>
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" /> Generate Movie
          </>
        )}
      </Button>
      {friends.length > 0 && (
        <Select
          value={selectedFriend || undefined}
          onValueChange={(value) =>
            setSelectedFriend(value === "none" ? null : value)
          }
        >
          <SelectTrigger className="w-full bg-background text-foreground">
            <SelectValue placeholder="Select a friend" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            <SelectItem value="none">No friend selected</SelectItem>
            {friends.map((friend) => (
              <SelectItem key={friend} value={friend}>
                {friend}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="include-watchlist"
          checked={includeWatchlist}
          onCheckedChange={setIncludeWatchlist}
        />
        <Label
          htmlFor="include-watchlist"
          className="text-sm cursor-pointer select-none"
        >
          Include Watchlist
        </Label>
      </div>

      <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
    </>
  );
}

function ErrorMessage({ error }: { error: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-500 p-6 bg-red-100 rounded-xl shadow-md"
    >
      <p className="font-semibold">{error}</p>
      <p className="mt-2 text-sm">
        Try adding more specific details or exploring different themes.
      </p>
    </motion.div>
  );
}

interface MovieDetailsProps {
  movie: Movie;
  addToWatchlist: (movie: Movie) => void;
  handleGenerateMovie: () => void;
  isInWatchlist: (movie: Movie) => boolean;
}

function MovieCard({
  movie,
  addToWatchlist,
  handleGenerateMovie,
  isInWatchlist,
  setIsPosterModalOpen,
}: MovieDetailsProps & { setIsPosterModalOpen: (isOpen: boolean) => void }) {
  const letterboxdUrl = `https://letterboxd.com/search/${encodeURIComponent(
    movie.title
  )}`;
  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
    movie.title
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div
          className="w-full md:w-1/3 cursor-pointer"
          onClick={() => setIsPosterModalOpen(true)}
        >
          {movie.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              width={200}
              height={300}
              layout="responsive"
            />
          )}
        </div>
        <div className="w-full md:w-2/3 p-6 space-y-4">
          <h3 className="text-3xl font-semibold">{movie.title}</h3>
          <div className="flex items-center space-x-4 text-lg">
            <Clapperboard className="h-5 w-5" />
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.director}</span>
          </div>
          <div className="flex items-center text-2xl">
            <Star className="h-6 w-6 text-yellow-400 mr-2" />
            <span className="font-bold">
              {typeof movie.rating === "number"
                ? movie.rating.toFixed(1)
                : movie.rating}
            </span>
          </div>
          <p className="text-base text-muted-foreground">{movie.overview}</p>
          <div className="flex space-x-4">
            <ExternalMovieLink href={letterboxdUrl} name="Letterboxd" />
            <ExternalMovieLink href={imdbUrl} name="IMDb" />
          </div>
          <div className="flex space-x-4 mt-4">
            <MovieButton
              onClick={() => addToWatchlist(movie)}
              variant={isInWatchlist(movie) ? "secondary" : "primary"}
              icon={
                isInWatchlist(movie) ? (
                  <Check className="mr-2 h-5 w-5" />
                ) : (
                  <BookmarkPlus className="mr-2 h-5 w-5" />
                )
              }
              disabled={isInWatchlist(movie)}
            >
              {isInWatchlist(movie) ? "In Watchlist" : "Add to Watchlist"}
            </MovieButton>
            <MovieButton onClick={handleGenerateMovie} variant="secondary">
              Show Me Another
            </MovieButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ExternalMovieLink({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      {name}
      <ExternalLink className="ml-1 h-3 w-3" />
    </a>
  );
}

function MovieButton({
  onClick,
  variant,
  icon,
  children,
  disabled = false,
}: {
  onClick: () => void;
  variant: "primary" | "secondary";
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <Button
        variant="ghost"
        className={`text-lg py-2 px-4 ${
          variant === "primary"
            ? "text-primary hover:text-primary-foreground hover:bg-primary"
            : "text-secondary-foreground hover:bg-secondary"
        } transition-colors duration-300`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
        {children}
      </Button>
    </motion.div>
  );
}
