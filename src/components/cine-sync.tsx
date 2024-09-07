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
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { generateMovie, Movie } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

interface DotMatrixProps {
  dots: number[];
  size?: number;
}

const DotMatrix: React.FC<DotMatrixProps> = ({ dots, size = 5 }) => (
  <div
    className={`grid gap-0.5`}
    style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
  >
    {dots.map((dot, index) => (
      <motion.div
        key={index}
        className={`w-1 h-1 rounded-full ${
          dot ? "bg-current" : "bg-transparent"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: dot ? 0.5 : 0 }}
        transition={{ duration: 0.5, delay: index * 0.02 }}
      />
    ))}
  </div>
);

interface MenuButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, icon, onClick }) => (
  <motion.button
    className="bg-secondary rounded-lg p-6 w-full h-full flex flex-col items-start justify-between overflow-hidden relative shadow-inner"
    whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,255,255,0.2)" }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    onClick={onClick}
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
      {icon}
    </motion.div>
    <motion.div
      className="absolute inset-0 bg-primary opacity-0"
      whileHover={{ opacity: 0.1 }}
      transition={{ duration: 0.2 }}
    />
  </motion.button>
);

interface LogoProps {
  onAboutClick: () => void;
}

const Logo: React.FC<LogoProps> = ({ onAboutClick }) => {
  return (
    <div className="flex items-center space-x-4">
      <motion.div
        className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAboutClick}
      />
      <Link
        href="/"
        className="text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors duration-300"
      >
        <motion.h1
          className="text-4xl font-light cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          CineSync
        </motion.h1>
      </Link>
    </div>
  );
};

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => (
  <div className="bg-background text-foreground p-8 rounded-lg max-w-4xl w-full m-4 relative shadow-lg">
    <motion.button
      onClick={onClose}
      className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Close modal"
    >
      <Trash2 size={24} />
    </motion.button>

    <motion.h2
      className="text-4xl font-light mb-8 text-primary"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      About CineSync
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <motion.div
        className="bg-secondary p-6 rounded-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-light mb-4 text-secondary-foreground">
          Discover
        </h3>
        <div className="w-16 h-16 mb-4">
          <DotMatrix
            dots={[
              0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0,
              1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
              1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1,
              1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ]}
            size={10}
          />
        </div>
        <p className="text-secondary-foreground">
          Find your next favorite movie with our AI-powered recommendation
          engine.
        </p>
      </motion.div>

      <motion.div
        className="bg-secondary p-6 rounded-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-light mb-4 text-secondary-foreground">
          Watchlist
        </h3>
        <div className="w-16 h-16 mb-4">
          <DotMatrix
            dots={[
              1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
              1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0,
              1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0,
              0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
              0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ]}
            size={10}
          />
        </div>
        <p className="text-secondary-foreground">
          Keep track of movies you want to watch and never miss a great film.
        </p>
      </motion.div>

      <motion.div
        className="bg-secondary p-6 rounded-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-light mb-4 text-secondary-foreground">
          Premium
        </h3>
        <div className="w-16 h-16 mb-4">
          <DotMatrix
            dots={[
              0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1,
              0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1,
              0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1,
              1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1,
              1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
            ]}
            size={10}
          />
        </div>
        <p className="text-secondary-foreground">
          Unlock exclusive features and get personalized recommendations with
          our Premium plan.
        </p>
      </motion.div>

      <motion.div
        className="bg-secondary p-6 rounded-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-2xl font-light mb-4 text-secondary-foreground">
          How It Works
        </h3>
        <p className="text-secondary-foreground">
          CineSync uses advanced AI algorithms to analyze your preferences and
          viewing history, providing tailored movie recommendations just for
          you.
        </p>
      </motion.div>
    </div>

    <motion.p
      className="text-lg text-muted-foreground mb-8"
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
      className="flex justify-between items-center"
    >
      <p className="text-sm text-muted-foreground">
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

export function CineSync() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [view, setView] = useState<
    "menu" | "discover" | "watchlist" | "premium"
  >("menu");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>("watchlist", []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const iconDots = {
    discover: [
      0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0,
    ],
    watchlist: [
      1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
    ],
    premium: [
      0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1,
    ],
  };

  const handleGenerateMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedMovie = await generateMovie(prompt);
      setMovie(generatedMovie);
    } catch (err) {
      setError("Failed to generate movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = (movie: Movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
      toast({
        title: "Added to Watchlist",
        description: `${movie.title} has been added to your watchlist.`,
      });
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(watchlist.filter((m) => m.id !== movieId));
    toast({
      title: "Removed from Watchlist",
      description: "The movie has been removed from your watchlist.",
    });
  };

  const handleRateMovie = (movie: Movie, rating: number) => {
    // Here you would typically send this rating to your backend
    console.log(`Rated ${movie.title} with ${rating} stars`);
    setRating(rating);
    toast({
      title: "Movie Rated",
      description: `You rated ${movie.title} ${rating} stars.`,
    });
  };

  const renderStars = (movie: Movie) => {
    return (
      <div className="flex items-center justify-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              (rating || movie.rating) >= star
                ? "text-yellow-400"
                : "text-gray-400"
            }`}
            onClick={() => handleRateMovie(movie, star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8 flex flex-col bg-background text-foreground">
      <motion.header
        className="flex justify-between items-center mb-12"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo onAboutClick={() => setIsModalOpen(true)} />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full shadow-inner bg-secondary text-secondary-foreground"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </motion.div>
      </motion.header>

      <AnimatePresence mode="wait">
        {view === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow grid gri d-cols-2 gap-6"
          >
            <div className="col-span-1 row-span-2">
              <MenuButton
                label="Discover"
                icon={<DotMatrix dots={iconDots.discover} />}
                onClick={() => setView("discover")}
              />
            </div>
            <div className="col-span-1 row-span-1">
              <MenuButton
                label="Watchlist"
                icon={<DotMatrix dots={iconDots.watchlist} />}
                onClick={() => setView("watchlist")}
              />
            </div>
            <div className="col-span-1 row-span-1">
              <MenuButton
                label="Premium"
                icon={<DotMatrix dots={iconDots.premium} />}
                onClick={() => setView("premium")}
              />
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
              className="w-full max-w-md"
            >
              <Input
                placeholder="Describe your perfect movie..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="text-xl bg-secondary shadow-inner text-foreground placeholder-muted-foreground"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={handleGenerateMovie}
                disabled={loading || !prompt}
                className="text-xl py-6 px-8 bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {loading ? "Discovering..." : "Find Movie"}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 mt-4"
              >
                {error}
              </motion.p>
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
                  <span className="text-2xl">{movie.rating.toFixed(1)}</span>
                </div>
                <p className="text-lg text-muted-foreground">
                  {movie.overview}
                </p>
                {renderStars(movie)}
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
                    <div className="flex items-center space-x-2">
                      {renderStars(movie)}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWatchlist(movie.id)}
                          className="text-secondary-foreground hover:text-primary transition-colors duration-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {view === "premium" && (
          <motion.div
            key="premium"
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
              Upgrade to Premium
            </motion.h2>
            <motion.p
              className="text-center max-w-md text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Get personalized recommendations, ad-free experience, and
              exclusive content with our Premium plan.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="text-xl py-6 px-8 bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-300">
                Upgrade Now
              </Button>
            </motion.div>
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
  );
}
