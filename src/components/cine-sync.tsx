"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Star,
  Clapperboard,
  BookmarkPlus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateMovie, Movie } from "@/lib/api";
import Image from "next/image";
import { DotMatrix } from "@/components/DotMatrix";
import { supabase } from "@/lib/supabaseClient";
import { FriendManager } from "@/components/FriendManager";
import { useUser } from "@clerk/nextjs";
import { Topbar } from "@/components/Topbar";
import { getWatchlist, saveToWatchlist, removeFromWatchlist } from "@/lib/db";

interface MenuCardProps {
  label: string;
  onClick: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const iconDots = {
    D: [
      1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0,
    ],
    W: [
      1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1,
    ],
    F: [
      1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,
    ],
  };

  return (
    <motion.div
      className={`bg-secondary rounded-lg p-4 w-full h-full flex flex-col items-start justify-between overflow-hidden relative shadow-inner cursor-pointer ${
        label === "Discover" ? "aspect-[2/1]" : "aspect-square"
      }`}
      whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,255,255,0.2)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.span
        className="text-2xl font-light z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {label}
      </motion.span>
      <motion.div
        className="self-end z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <DotMatrix
          letter={label[0] as "D" | "W" | "F"}
          isHovered={isHovered}
          dots={iconDots[label[0] as keyof typeof iconDots]}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-primary opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => (
  <div className="bg-background text-foreground p-4 sm:p-8 rounded-lg max-w-4xl w-full m-4 relative shadow-lg overflow-y-auto max-h-[90vh]">
    <motion.button
      onClick={onClose}
      className="absolute top-2 right-2 sm:top-4 sm:right-4 text-muted-foreground hover:text-foreground transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Close modal"
    >
      <X size={24} />
    </motion.button>

    <motion.h2
      className="text-3xl sm:text-4xl font-light mb-6 sm:mb-8 text-primary"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      About CineSync
    </motion.h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <motion.div
        className="bg-secondary p-4 sm:p-6 rounded-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-secondary-foreground">
          Discover
        </h3>
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4">
          <DotMatrix
            letter="D"
            isHovered={false}
            dots={[
              1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1,
              1, 1, 0,
            ]}
          />
        </div>
        <p className="text-sm sm:text-base text-secondary-foreground">
          Find your next favorite movie with our AI-powered recommendation
          engine.
        </p>
      </motion.div>

      <motion.div
        className="bg-secondary p-4 sm:p-6 rounded-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-secondary-foreground">
          Watchlist
        </h3>
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4">
          <DotMatrix
            letter="W"
            isHovered={false}
            dots={[
              1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0,
              0, 0, 1,
            ]}
          />
        </div>
        <p className="text-sm sm:text-base text-secondary-foreground">
          Keep track of movies you want to watch and never miss a great film.
        </p>
      </motion.div>

      <motion.div
        className="bg-secondary p-4 sm:p-6 rounded-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-secondary-foreground">
          Friends
        </h3>
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4">
          <DotMatrix
            letter="F"
            isHovered={false}
            dots={[
              1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0,
              0, 0, 0,
            ]}
          />
        </div>
        <p className="text-sm sm:text-base text-secondary-foreground">
          Share movie recommendations with friends and discover together.
        </p>
      </motion.div>

      <motion.div
        className="bg-secondary p-4 sm:p-6 rounded-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-secondary-foreground">
          How It Works
        </h3>
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4">
          <DotMatrix
            letter="C"
            isHovered={false}
            dots={[
              0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
              1, 1, 0,
            ]}
          />
        </div>
        <p className="text-sm sm:text-base text-secondary-foreground">
          CineSync uses advanced AI algorithms to analyze your preferences and
          viewing history, providing tailored movie recommendations just for
          you.
        </p>
      </motion.div>
    </div>

    <motion.p
      className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      CineSync is your personal movie discovery assistant. Using advanced AI, it
      helps you find the perfect movie based on your preferences and mood.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
    >
      <p className="text-xs sm:text-sm text-muted-foreground">
        Powered by AI. Designed with ❤️ by{" "}
        <a
          href="https://ninetynine.digital"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors duration-300"
        >
          Ninetynine Digital
        </a>
      </p>
      <Button
        onClick={onClose}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Close
      </Button>
    </motion.div>
  </div>
);

interface CineSyncProps {
  initialWatchlist: Movie[];
}

export function CineSync({ initialWatchlist }: CineSyncProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [view, setView] = useState<
    "menu" | "discover" | "watchlist" | "friends"
  >("menu");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [watchlist, setWatchlist] = useState<Movie[]>(initialWatchlist);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const { user } = useUser();
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchPromptSuggestions();
  }, []);

  useEffect(() => {
    if (user) {
      getWatchlist(user.id).then(setWatchlist);
    }
  }, [user]);

  const fetchPromptSuggestions = async () => {
    const { data, error } = await supabase
      .from("prompt_suggestions")
      .select("suggestion");

    if (error) {
      console.error("Error fetching prompt suggestions:", error);
      return;
    }

    if (data && Array.isArray(data)) {
      setPromptSuggestions(data.map((item) => item.suggestion));
    }
  };

  const handleTitleClick = () => {
    setView("menu");
  };

  const handleAboutClick = () => {
    setIsModalOpen(true);
  };

  const handleGenerateMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting to generate movie...");
      const generatedMovie = await generateMovie(
        searchQuery,
        user?.id || "",
        suggestedMovies
      );
      if (generatedMovie) {
        setMovie(generatedMovie);
        setSuggestedMovies([...suggestedMovies, generatedMovie]);
      } else {
        setError(
          "I couldn't find a suitable movie based on that description. Could you please provide more details or try a different prompt?"
        );
      }
    } catch (err) {
      console.error("Error in handleGenerateMovie:", err);
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}. Please try again.`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movie: Movie) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add movies to your watchlist",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveToWatchlist(user.id, movie);
      setWatchlist([...watchlist, movie]);
      toast({
        title: "Success",
        description: "Movie added to watchlist",
      });
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to add movie to watchlist",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWatchlist = async (movieId: number) => {
    if (!user) {
      toast({
        title: "Error",
        description:
          "You must be logged in to remove movies from your watchlist",
        variant: "destructive",
      });
      return;
    }

    try {
      await removeFromWatchlist(user.id, movieId);
      setWatchlist(watchlist.filter((m) => m.id !== movieId));
      toast({
        title: "Success",
        description: "Movie removed from watchlist",
      });
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove movie from watchlist",
        variant: "destructive",
      });
    }
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleGenerateMovie();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="p-4">
        <Topbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onAboutClick={handleAboutClick}
          onTitleClick={handleTitleClick}
        />

        <AnimatePresence mode="wait">
          {view === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
            >
              <div className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-2">
                <MenuCard
                  label="Discover"
                  onClick={() => setView("discover")}
                />
              </div>
              <div className="col-span-1">
                <MenuCard
                  label="Watchlist"
                  onClick={() => setView("watchlist")}
                />
              </div>
              <div className="col-span-1">
                <MenuCard label="Friends" onClick={() => setView("friends")} />
              </div>
            </motion.div>
          )}

          {view === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col justify-center items-center space-y-8"
            >
              <motion.h2
                className="text-4xl font-light mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Discover Your Next Movie
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-md relative"
              >
                <Input
                  placeholder="Describe your perfect movie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  className="text-xl bg-secondary shadow-inner text-foreground placeholder-muted-foreground"
                />
                <AnimatePresence>
                  {promptSuggestions.length > 0 && searchQuery === "" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full bg-secondary rounded-md shadow-lg mt-1"
                    >
                      {promptSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setSearchQuery(suggestion)}
                        >
                          {suggestion}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleGenerateMovie}
                  disabled={loading || !searchQuery}
                  className="text-xl py-6 px-8 bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {loading ? "Discovering..." : "Find Movie"}
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 mt-4 p-4 bg-red-100 rounded-md"
                >
                  <p>{error}</p>
                  <p className="mt-2 text-sm">
                    Try adding more details like genre, time period, or specific
                    themes you&apos;re interested in.
                  </p>
                </motion.div>
              )}

              {movie && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-4 max-w-2xl"
                >
                  <h3 className="text-3xl font-light">{movie.title}</h3>
                  {movie.poster_path && (
                    <Image
                      src={movie.poster_path}
                      alt={movie.title}
                      width={300}
                      height={450}
                      className="mx-auto rounded-lg shadow-lg"
                    />
                  )}
                  <div className="flex items-center justify-center space-x-4 text-xl">
                    <Clapperboard className="h-6 w-6" />
                    <span>{movie.year}</span>
                    <span>{movie.director}</span>
                  </div>
                  <div className="flex items-center justify-center text-xl">
                    <Star className="h-6 w-5 text-yellow-400 mr-2" />
                    <span className="text-2xl">
                      {typeof movie.rating === "number"
                        ? movie.rating.toFixed(1)
                        : movie.rating}
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {movie.overview}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="text-xl py-4 px-6 bg-secondary text-secondary-foreground shadow-inner"
                        onClick={() => addToWatchlist(movie)}
                      >
                        <BookmarkPlus className="mr-2 h-5 w-5" />
                        Add to Watchlist
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="text-xl py-4 px-6 bg-secondary text-secondary-foreground shadow-inner"
                        onClick={handleGenerateMovie}
                      >
                        Show Me Another
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {view === "watchlist" && (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col items-center space-y-8"
            >
              <motion.h2
                className="text-4xl font-light mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your Watchlist
              </motion.h2>
              {watchlist.length === 0 ? (
                <motion.p
                  className="text-xl text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your watchlist is empty. Discover some movies!
                </motion.p>
              ) : (
                <motion.div
                  className="w-full max-w-4xl space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {watchlist.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      className="bg-secondary p-6 rounded-lg flex justify-between items-center shadow-md hover:shadow-lg transition-shadow duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      <div>
                        <h3 className="font-medium text-xl text-secondary-foreground">
                          {movie.title}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                          {movie.year}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromWatchlist(movie.id)}
                          className="text-secondary-foreground hover:text-primary transition-colors duration-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {view === "friends" && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col justify-center items-center space-y-8"
            >
              <motion.h2
                className="text-4xl font-light mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Friends
              </motion.h2>
              <motion.p
                className="text-center max-w-md text-xl text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Manage your friends and share movie recommendations.
              </motion.p>
              <FriendManager />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <AboutModal onClose={() => setIsModalOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
