import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { LogIn, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/components/Logo";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-background py-2 px-4 text-sm text-foreground flex justify-between items-center"
    >
      <Logo onAboutClick={onAboutClick} onTitleClick={onTitleClick} />
      <div className="flex items-center space-x-4">
        {isSignedIn && (
          <span className="text-sm">
            Hi, {user?.firstName || user?.username}!
          </span>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isSignedIn ? (
                <SignOutButton>
                  <Button variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </SignOutButton>
              ) : (
                <SignInButton>
                  <Button variant="ghost" size="sm">
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
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="rounded-full bg-secondary text-secondary-foreground"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}
