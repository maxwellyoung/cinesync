import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DotMatrixProps {
  dots: number[];
  isHovered: boolean;
}

const movieIcons = [
  [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1], // Clapperboard
  [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0], // Popcorn
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1], // Film strip
];

export function DotMatrix({ dots, isHovered }: DotMatrixProps) {
  const [currentIcon, setCurrentIcon] = useState<number[]>(dots);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setCurrentIcon(
          movieIcons[Math.floor(Math.random() * movieIcons.length)]
        );
      }, 300);
      return () => clearInterval(interval);
    } else {
      setCurrentIcon(dots);
    }
  }, [isHovered, dots]);

  if (!currentIcon || currentIcon.length === 0) {
    return null; // Return null or a placeholder if currentIcon is not valid
  }

  return (
    <svg width="25" height="25" viewBox="0 0 25 25">
      {currentIcon.map((dot, index) => {
        const x = (index % 5) * 5 + 2.5;
        const y = Math.floor(index / 5) * 5 + 2.5;
        return (
          <motion.circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill="currentColor"
            initial={{ scale: dot ? 1 : 0 }}
            animate={{
              scale: isHovered ? (dot ? 1 : 0) : dot ? 1 : 0,
              opacity: isHovered ? (dot ? 1 : 0) : dot ? 0.5 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}
