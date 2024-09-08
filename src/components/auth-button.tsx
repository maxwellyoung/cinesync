import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function AuthButton() {
  const { isSignedIn } = useUser();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {isSignedIn ? (
            <SignOutButton>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </SignOutButton>
          ) : (
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon">
                <LogIn className="h-5 w-5" />
              </Button>
            </SignInButton>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSignedIn ? "Sign out" : "Sign in"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
