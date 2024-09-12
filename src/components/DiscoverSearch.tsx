"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Star,
  Clapperboard,
  BookmarkPlus,
  Image as ImageIcon,
  ExternalLink,
  Check,
} from "lucide-react";
import Image from "next/image";
import { SearchSuggestions } from "@/components/SearchSuggestions";
import { Movie } from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DiscoverSearchProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  handleGenerateMovie: () => void;
  error: string | null;
  movie: Movie | null;
  addToWatchlist: (movie: Movie) => void;
  isInWatchlist: boolean;
  friends: string[];
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
  friends,
  selectedFriend,
  setSelectedFriend,
  includeWatchlist,
  setIncludeWatchlist,
}: DiscoverSearchProps) {
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

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <motion.h2
        className="text-4xl font-light text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Discover Movies
      </motion.h2>
      <SearchSection
        prompt={prompt}
        setPrompt={setPrompt}
        loading={loading}
        handleGenerateMovie={handleGenerateMovie}
        handleInputKeyPress={handleInputKeyPress}
        handleSuggestionClick={handleSuggestionClick}
        friends={friends}
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
        includeWatchlist={includeWatchlist}
        setIncludeWatchlist={setIncludeWatchlist}
      />

      {error && <ErrorMessage error={error} />}

      {movie && (
        <MovieDetails
          movie={movie}
          addToWatchlist={addToWatchlist}
          handleGenerateMovie={handleGenerateMovie}
          isInWatchlist={isInWatchlist}
        />
      )}
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="relative">
        <Input
          type="text"
          placeholder="Describe the movie you're looking for..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleInputKeyPress}
          className="text-xl bg-secondary shadow-inner text-foreground placeholder-muted-foreground pl-12 pr-4 py-6 rounded-full"
        />
        <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
      </div>
      <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-auto">
          <Label
            htmlFor="friend-select"
            className="text-sm text-muted-foreground mb-1 block"
          >
            Select a friend
          </Label>
          <select
            id="friend-select"
            value={selectedFriend || ""}
            onChange={(e) => setSelectedFriend(e.target.value || null)}
            className="w-full sm:w-auto bg-secondary text-foreground rounded-md p-2 border border-input"
          >
            <option value="">No friend selected</option>
            {friends.map((friend) => (
              <option key={friend} value={friend}>
                {friend}
              </option>
            ))}
          </select>
        </div>
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
      </div>
      <Button
        onClick={handleGenerateMovie}
        disabled={loading || !prompt}
        className="w-full text-xl py-6 px-8 bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full"
      >
        {loading ? "Discovering..." : "Generate Movie"}
        <Sparkles className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );
}

function ErrorMessage({ error }: { error: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-500 mt-4 p-6 bg-red-100 rounded-lg shadow-md"
    >
      <p className="font-semibold">{error}</p>
      <p className="mt-2 text-sm">
        Try adding more details like genre, time period, or specific themes
        you&apos;ve been interested in.
      </p>
    </motion.div>
  );
}

interface MovieDetailsProps {
  movie: Movie;
  addToWatchlist: (movie: Movie) => void;
  handleGenerateMovie: () => void;
  isInWatchlist: boolean;
}

function MovieDetails({
  movie,
  addToWatchlist,
  handleGenerateMovie,
  isInWatchlist,
}: MovieDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-secondary p-8 rounded-3xl shadow-xl space-y-6 overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/10 to-transparent" />
      <h3 className="text-4xl font-bold text-center relative z-10">
        {movie.title}
      </h3>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <MoviePoster movie={movie} />
        <MovieInfo
          movie={movie}
          addToWatchlist={addToWatchlist}
          handleGenerateMovie={handleGenerateMovie}
          isInWatchlist={isInWatchlist}
        />
      </div>
    </motion.div>
  );
}

function MoviePoster({ movie }: { movie: Movie }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="relative w-64 h-96 rounded-lg overflow-hidden shadow-lg"
    >
      {movie.poster_path ? (
        <Image
          src={movie.poster_path}
          alt={movie.title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <ImageIcon className="w-16 h-16 text-gray-400" />
        </div>
      )}
    </motion.div>
  );
}

function MovieInfo({
  movie,
  addToWatchlist,
  handleGenerateMovie,
  isInWatchlist,
}: MovieDetailsProps) {
  const letterboxdUrl = `https://letterboxd.com/search/${encodeURIComponent(
    movie.title
  )}`;
  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
    movie.title
  )}`;

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center justify-center space-x-4 text-xl">
        <Clapperboard className="h-6 w-6" />
        <span>{movie.year}</span>
        <span>•</span>
        <span>{movie.director}</span>
      </div>
      <div className="flex items-center justify-center text-2xl">
        <Star className="h-8 w-8 text-yellow-400 mr-2" />
        <span className="font-bold">
          {typeof movie.rating === "number"
            ? movie.rating.toFixed(1)
            : movie.rating}
        </span>
      </div>
      <p className="text-lg text-muted-foreground text-center">
        {movie.overview}
      </p>
      <div className="flex justify-center space-x-4 mt-2">
        <ExternalMovieLink href={letterboxdUrl} name="Letterboxd" />
        <ExternalMovieLink href={imdbUrl} name="IMDb" />
      </div>
      <div className="flex justify-center space-x-4 mt-6">
        <MovieButton
          onClick={() => addToWatchlist(movie)}
          variant={isInWatchlist ? "secondary" : "primary"}
          icon={
            isInWatchlist ? (
              <Check className="mr-2 h-5 w-5" />
            ) : (
              <BookmarkPlus className="mr-2 h-5 w-5" />
            )
          }
          disabled={isInWatchlist}
        >
          {isInWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
        </MovieButton>
        <MovieButton onClick={handleGenerateMovie} variant="secondary">
          Show Me Another
        </MovieButton>
      </div>
    </div>
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
