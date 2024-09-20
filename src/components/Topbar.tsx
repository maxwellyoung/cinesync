import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Sun, Moon, Info } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Logo } from "./Logo";
import { Separator } from "./ui/separator";
import { useTheme } from "next-themes";
import { useState } from "react";

interface TopbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  onAboutClick: () => void;
  onTitleClick: () => void;
}

export function Topbar({
  isDarkMode,
  setIsDarkMode,
  onAboutClick,
  onTitleClick,
}: TopbarProps) {
  const { user, isSignedIn } = useUser();
  const { theme } = useTheme();
  const [isGreetingHovered, setIsGreetingHovered] = useState(false);

  const bgColor = theme === "dark" ? "bg-gray-950/90" : "bg-gray-200/90";
  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  const separatorColor = theme === "dark" ? "bg-gray-600" : "bg-gray-400";

  return (
    <div className="fixed top-4 left-0 right-0 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${bgColor} backdrop-blur-md py-3 px-6 rounded-full text-sm ${textColor} flex items-center shadow-lg`}
        style={{ minWidth: "320px", maxWidth: "90vw" }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer flex items-center"
          onClick={onTitleClick}
        >
          <Logo onAboutClick={onAboutClick} onTitleClick={onTitleClick} />
        </motion.div>
        <Separator
          orientation="vertical"
          className={`h-6 mx-4 ${separatorColor}`}
        />
        <div className="flex-grow" />
        {isSignedIn && (
          <div
            className="text-sm mr-4 hidden sm:inline cursor-default"
            onMouseEnter={() => setIsGreetingHovered(true)}
            onMouseLeave={() => setIsGreetingHovered(false)}
          >
            <AnimatePresence mode="wait">
              {isGreetingHovered ? (
                <motion.span
                  key="kia-ora"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Kia ora
                </motion.span>
              ) : (
                <motion.span
                  key="hi"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Hi
                </motion.span>
              )}
            </AnimatePresence>
            {`, ${user?.firstName || user?.username}!`}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={textColor}
                  onClick={onAboutClick}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>About CineSync</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {isSignedIn ? (
                  <SignOutButton>
                    <Button variant="ghost" size="sm" className={textColor}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </SignOutButton>
                ) : (
                  <SignInButton>
                    <Button variant="ghost" size="sm" className={textColor}>
                      <LogIn className="h-4 w-4" />
                    </Button>
                  </SignInButton>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSignedIn ? "Sign out" : "Sign in"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={textColor}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
