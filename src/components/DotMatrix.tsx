import React from "react";
import { motion } from "framer-motion";

interface DotMatrixProps {
  letter: "D" | "W" | "F" | "C";
  isHovered: boolean;
  dots?: number[]; // Add this line
}

const dotPatterns = {
  D: [
    1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0,
  ],
  W: [
    1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1,
  ],
  F: [
    1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,
  ],
  C: [
    1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1,
  ],
};

export function DotMatrix({ letter, isHovered, dots }: DotMatrixProps) {
  const dotPattern = dots || dotPatterns[letter];

  return (
    <svg width="50" height="50" viewBox="0 0 50 50">
      {dotPattern.map((dot, index) => {
        const x = (index % 5) * 10 + 5;
        const y = Math.floor(index / 5) * 10 + 5;
        return (
          <motion.circle
            key={index}
            cx={x}
            cy={y}
            r="4"
            fill="currentColor"
            initial={{ scale: 1 }}
            animate={{
              scale: isHovered ? (dot ? 1 : 0) : 1,
              opacity: isHovered ? (dot ? 1 : 0.3) : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}
