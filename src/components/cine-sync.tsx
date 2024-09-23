"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { DotMatrix } from "../components/DotMatrix";
import { FriendManager } from "../components/FriendManager";
import { useUser, SignUpButton } from "@clerk/nextjs";
import { Topbar } from "../components/Topbar";
import { getWatchlist, removeFromWatchlist, getFriends } from "../lib/api";
import { DiscoverSearch } from "../components/DiscoverSearch";
import { Watchlist } from "./Watchlist";
import { useTheme } from "next-themes";
import { Movie } from "../lib/types";

interface MenuCardProps {
  label: string;
  onClick: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const iconDots = {
    Discover: [
      1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0,
    ],
    Watchlist: [
      1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1,
    ],
    Friends: [
      1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,
    ],
  };

  return (
    <motion.div
      className="bg-secondary rounded-lg p-6 w-full h-full flex flex-col items-start justify-between overflow-hidden relative shadow-inner cursor-pointer"
      whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,255,255,0.2)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.span
        className="text-3xl font-light z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {label}
      </motion.span>
      <motion.div
        className="self-end z-10 transform scale-150"
        initial={{ scale: 0 }}
        animate={{ scale: 1.5 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <DotMatrix
          isHovered={isHovered}
          dots={iconDots[label as keyof typeof iconDots]}
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
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(theme === "dark");
  const [view, setView] = useState<
    "menu" | "discover" | "watchlist" | "friends"
  >("menu");
  const [watchlist, setWatchlist] = useState<Movie[]>(initialWatchlist);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user, isLoaded } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [friends, setFriends] = useState<string[]>([]);
  const [generatedMovie, setGeneratedMovie] = useState<Movie | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && user) {
      getWatchlist(user.id).then(setWatchlist);
      getFriends(user.id).then(setFriends);
    }
  }, [user, isMounted]);

  useEffect(() => {
    setTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode, setTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleTitleClick = () => {
    setView("menu");
  };

  const handleAboutClick = () => {
    setIsModalOpen(true);
  };

  const addToWatchlist = async (movie: Movie) => {
    try {
      console.log("Adding movie to watchlist:", movie);

      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: movie.title,
          posterPath: movie.poster_path,
          voteAverage: Math.round(movie.vote_average * 100), // Convert to integer (0-1000)
          year: movie.year,
          director: movie.director,
          rating: Math.round(movie.rating * 100), // Convert to integer (0-1000)
          overview: movie.overview,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to watchlist");
      }

      setWatchlist((prev) => [...prev, movie]);
      toast({
        title: "Added to Watchlist",
        description: `${movie.title} has been added to your watchlist.`,
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add movie to watchlist. Please try again.",
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

  const isInWatchlist = (movie: Movie) => {
    return watchlist.some((m) => m.id === movie.id);
  };

  const handleGenerateMovie = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "", // Add a prompt if needed
          previousSuggestions: [], // Add previous suggestions if you're tracking them
          friendId: null, // Add friend ID if implementing friend recommendations
          includeWatchlist: false, // Set this based on user preference
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate movie");
      }

      const movie = await response.json();
      setGeneratedMovie(movie);
    } catch (error) {
      console.error("Error generating movie:", error);
      toast({
        title: "Error",
        description: "Failed to generate movie. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-4xl font-bold mb-8">Welcome to CineSync</h1>
        <SignUpButton mode="modal">
          <Button size="lg">Sign Up</Button>
        </SignUpButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Topbar
        isDarkMode={isDarkMode}
        setIsDarkMode={toggleDarkMode}
        onAboutClick={handleAboutClick}
        onTitleClick={handleTitleClick}
      />
      <div className="flex-grow flex flex-col mt-20 sm:mt-24 pb-8">
        <AnimatePresence mode="wait">
          {view === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex items-center justify-center p-4"
            >
              <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
                <div className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2 h-full">
                  <MenuCard
                    label="Discover"
                    onClick={() => setView("discover")}
                  />
                </div>
                <div className="col-span-1 h-full">
                  <MenuCard
                    label="Watchlist"
                    onClick={() => setView("watchlist")}
                  />
                </div>
                <div className="col-span-1 h-full">
                  <MenuCard
                    label="Friends"
                    onClick={() => setView("friends")}
                  />
                </div>
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
              className="flex-grow flex flex-col justify-start items-center space-y-8 p-4"
            >
              <DiscoverSearch
                prompt=""
                setPrompt={() => {}}
                loading={isGenerating}
                handleGenerateMovie={handleGenerateMovie}
                error={null}
                movie={generatedMovie}
                addToWatchlist={addToWatchlist}
                isInWatchlist={isInWatchlist}
                friends={friends}
                selectedFriend={null}
                setSelectedFriend={() => {}}
                includeWatchlist={false}
                setIncludeWatchlist={() => {}}
              />
            </motion.div>
          )}

          {view === "watchlist" && (
            <Watchlist
              watchlist={watchlist}
              handleRemoveFromWatchlist={handleRemoveFromWatchlist}
              onDiscoverClick={() => setView("discover")}
            />
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
