"use client";

import React from "react";
import { motion } from "framer-motion";
import { SignUpButton, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Dashboard } from "@/components/Dashboard";

export function WelcomeScreen() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="text-center p-4">Loading user data...</div>;
  }

  if (isSignedIn) {
    return <Dashboard />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen text-center"
    >
      <motion.h1
        className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Welcome to CineSync
      </motion.h1>
      <motion.p
        className="text-xl mb-12 max-w-md text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Discover your next favorite movie with AI-powered recommendations
      </motion.p>
      <div className="space-x-4">
        <SignUpButton mode="modal">
          <Button
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white border-none"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.span>
          </Button>
        </SignUpButton>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white border-none"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.span>
          </Button>
        </SignInButton>
      </div>
    </motion.div>
  );
}
