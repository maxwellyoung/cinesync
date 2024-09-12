"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { DotMatrix } from "@/components/DotMatrix";
import { useState } from "react";

const welcomeDots = [
  1,
  1,
  1,
  1,
  0,
  1,
  0,
  0,
  0,
  1,
  1,
  0,
  0,
  0,
  1,
  1,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  0, // C
  0,
  1,
  1,
  1,
  0,
  1,
  0,
  0,
  0,
  1,
  0,
  1,
  1,
  1,
  0,
  1,
  0,
  0,
  0,
  1,
  0,
  1,
  1,
  1,
  0, // S
];

export default function SignUpPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          className="w-24 h-12 mx-auto mb-4"
          whileHover={{ scale: 1.1 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <DotMatrix isHovered={isHovered} dots={welcomeDots} />
        </motion.div>
        <h1 className="text-4xl font-light mb-2">Welcome to CineSync</h1>
        <p className="text-muted-foreground">
          Discover your next favorite movie with AI-powered recommendations
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <SignUp
          appearance={{
            elements: {
              rootBox: "bg-background shadow-lg rounded-lg p-8",
              card: "bg-background",
              headerTitle: "text-2xl font-light text-foreground mb-4",
              headerSubtitle: "text-muted-foreground mb-6",
              formButtonPrimary:
                "bg-primary text-primary-foreground hover:bg-primary/90",
              formFieldLabel: "text-foreground",
              formFieldInput:
                "bg-secondary text-foreground border-input focus:border-primary",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      </motion.div>
    </div>
  );
}
