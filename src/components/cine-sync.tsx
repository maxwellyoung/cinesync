"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Sparkles,
  Star,
  StarHalf,
  BookmarkPlus,
  Trash2,
  Sun,
  Moon,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Movie } from "@/lib/api";
import { SignInButton } from "@clerk/nextjs";
import { useDebouncedCallback } from "use-debounce";
import { useCompletion } from "ai/react";
import { Textarea } from "@/components/ui/textarea";

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
  <Link href={`/?view=${label.toLowerCase()}`} passHref legacyBehavior>
    <motion.a
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
    </motion.a>
  </Link>
);

interface LogoProps {
  onAboutClick: () => void;
}

const Logo: React.FC<LogoProps> = ({ onAboutClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const logoDots = [
    0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
  ];

  return (
    <div className="flex items-center space-x-4">
      <motion.div
        className="w-10 h-10 cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onAboutClick}
      >
        <div className="grid grid-cols-5 gap-0.5">
          {logoDots.map((dot, index) => (
            <motion.div
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${
                dot ? "bg-primary" : "bg-transparent"
              }`}
              initial={{ opacity: dot ? 0.5 : 0 }}
              animate={{
                opacity: isHovered ? (dot ? 1 : 0.2) : dot ? 0.5 : 0,
                scale: isHovered ? (dot ? 1.2 : 1) : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>
      <Link
        href="/"
        className="text-foreground hover:text-primary transition-colors duration-300"
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
              0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0,
              1, 0, 0,
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
              1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1,
              1, 1, 1,
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
              0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0,
              0, 0, 1,
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

export function CineSync({ initialWatchlist }: { initialWatchlist: Movie[] }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<Movie[]>(initialWatchlist);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [addedToWatchlist, setAddedToWatchlist] = useState<number | null>(null);
  const [promptIdeas, setPromptIdeas] = useState<string[]>([]);
  const [useWatchlist, setUseWatchlist] = useState<boolean>(false);

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useCompletion({
    api: "/api/generate-movie",
  });

  const searchParams = useSearchParams();
  const view = searchParams?.get("view") || "menu";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    if (term) {
      const filteredWatchlist = initialWatchlist.filter((movie) =>
        movie.title.toLowerCase().includes(term.toLowerCase())
      );
      setWatchlist(filteredWatchlist);
    } else {
      setWatchlist(initialWatchlist);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch, initialWatchlist]);

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

  const addToWatchlist = async (movieData: string) => {
    try {
      const movie = JSON.parse(movieData);
      if (
        !movie.title ||
        !movie.year ||
        !movie.director ||
        !movie.rating ||
        !movie.overview
      ) {
        throw new Error("Invalid movie data");
      }

      const newMovie: Movie = {
        id: Date.now(),
        title: movie.title,
        year: movie.year,
        director: movie.director,
        rating: movie.rating,
        overview: movie.overview,
        poster_path: null,
      };

      if (!watchlist.some((m) => m.title === newMovie.title)) {
        setWatchlist((prev) => [...prev, newMovie]);
        setAddedToWatchlist(newMovie.id);
        setTimeout(() => setAddedToWatchlist(null), 2000);

        if (user) {
          try {
            const response = await fetch("/api/watchlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newMovie),
            });
            if (!response.ok) throw new Error("Failed to save to watchlist");
          } catch (error) {
            console.error("Error saving to watchlist:", error);
            toast({
              title: "Error",
              description: "Failed to save to watchlist. Please try again.",
              variant: "destructive",
            });
          }
        }

        toast({
          title: "Added to Watchlist",
          description: `${newMovie.title} has been added to your watchlist.`,
        });
      } else {
        toast({
          title: "Already in Watchlist",
          description: `${newMovie.title} is already in your watchlist.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to add movie to watchlist. Invalid movie data.",
        variant: "destructive",
      });
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));

    if (user) {
      try {
        const response = await fetch(`/api/watchlist?movieId=${movieId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove from watchlist");
      } catch (error) {
        console.error("Error removing from watchlist:", error);
        toast({
          title: "Error",
          description: "Failed to remove from watchlist. Please try again.",
          variant: "destructive",
        });
      }
    }

    toast({
      title: "Removed from Watchlist",
      description: "The movie has been removed from your watchlist.",
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center justify-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {index < fullStars ? (
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
            ) : index === fullStars && hasHalfStar ? (
              <StarHalf className="w-6 h-6 text-yellow-400 fill-current" />
            ) : (
              <Star className="w-6 h-6 text-gray-300" />
            )}
          </motion.span>
        ))}
      </div>
    );
  };

  const handleGenerateMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const watchlistContext = useWatchlist
      ? `Consider the user's watchlist: ${watchlist
          .map((m) => m.title)
          .join(", ")}.`
      : "";
    const fullPrompt = `${watchlistContext} ${input}`.trim();
    handleInputChange({
      target: { value: fullPrompt },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    await handleSubmit(e);
  };

  const renderMovie = (movieData: string) => {
    try {
      const movie = JSON.parse(movieData);
      if (
        !movie.title ||
        !movie.year ||
        !movie.director ||
        !movie.rating ||
        !movie.overview
      ) {
        throw new Error("Invalid movie data");
      }

      return (
        <motion.div
          key={movie.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-secondary/30 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-2xl w-full mx-auto"
        >
          <motion.h3
            className="text-3xl font-semibold mb-2 relative inline-block"
            whileHover="hover"
          >
            {movie.title}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              initial={{ scaleX: 0 }}
              variants={{
                hover: {
                  scaleX: 1,
                  transition: { duration: 0.3 },
                },
              }}
            />
          </motion.h3>
          <p className="text-xl mb-4">
            {movie.year} • Directed by {movie.director}
          </p>
          <div className="flex justify-center mb-4">
            {renderStars(movie.rating)}
          </div>
          <p className="text-lg mb-6">{movie.overview}</p>
          <AnimatePresence mode="wait">
            {addedToWatchlist === movie.id ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md"
              >
                <Check className="mr-2 h-5 w-5" />
                Added to Watchlist
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  onClick={() => addToWatchlist(movieData)}
                  className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
                >
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  Add to Watchlist
                  <motion.div
                    className="ml-2 inline-block"
                    whileHover={{ rotate: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BookmarkPlus className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    } catch (error) {
      console.error("Error rendering movie:", error);
      return (
        <div className="text-center text-red-500">
          Error: Unable to display movie information.
        </div>
      );
    }
  };

  useEffect(() => {
    const ideas = [
      "A sci-fi movie with time travel",
      "A heartwarming comedy about family",
      "A thriller set in a small town",
      "An animated adventure for all ages",
      "A historical drama based on true events",
    ];
    setPromptIdeas(ideas);
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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

      {isSignedIn ? (
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
                  onClick={() => {}}
                />
              </div>
              <div className="col-span-1 row-span-1">
                <MenuButton
                  label="Watchlist"
                  icon={<DotMatrix dots={iconDots.watchlist} />}
                  onClick={() => {}}
                />
              </div>
              <div className="col-span-1 row-span-1">
                <MenuButton
                  label="Premium"
                  icon={<DotMatrix dots={iconDots.premium} />}
                  onClick={() => {}}
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
              transition={{ duration: 0.5 }}
              className="flex-grow flex flex-col justify-center items-center space-y-8"
            >
              <motion.h2
                className="text-4xl font-light mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Discover Your Next Movie
              </motion.h2>
              <motion.form
                onSubmit={handleGenerateMovie}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full max-w-md space-y-4"
              >
                <Textarea
                  placeholder="Describe your perfect movie..."
                  value={input}
                  onChange={handleInputChange}
                  className="text-xl bg-secondary/50 shadow-inner text-foreground placeholder-muted-foreground rounded-lg p-4 min-h-[60px] max-h-[200px] overflow-y-auto resize-none"
                  rows={1}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {promptIdeas.map((idea, index) => (
                    <motion.button
                      key={index}
                      onClick={() =>
                        handleInputChange({
                          target: { value: idea },
                        } as React.ChangeEvent<HTMLTextAreaElement>)
                      }
                      className="text-sm bg-secondary/30 hover:bg-secondary/50 text-secondary-foreground px-3 py-1.5 rounded-full transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {idea}
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="use-watchlist" className="text-sm">
                    Use Watchlist
                  </label>
                  <Switch
                    id="use-watchlist"
                    checked={useWatchlist}
                    onCheckedChange={setUseWatchlist}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input}
                  className="text-xl py-6 px-8 bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 w-full rounded-lg"
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Discovering...
                    </motion.div>
                  ) : (
                    <>
                      Find Movie
                      <Sparkles className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.form>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 mt-4"
                >
                  {error.message}
                </motion.p>
              )}

              {completion && renderMovie(completion)}
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
              <Input
                placeholder="Search your watchlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
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
                        {renderStars(movie.rating)}
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
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center flex-grow"
        >
          <h2 className="text-3xl font-light mb-4">Welcome to CineSync</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Sign in to discover and track your favorite movies.
          </p>
          <SignInButton mode="modal">
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </motion.div>
      )}

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
