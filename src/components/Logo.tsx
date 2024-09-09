import React, { useState } from "react";
import { motion } from "framer-motion";
import { DotMatrix } from "./DotMatrix";

interface LogoProps {
  onAboutClick: () => void;
  onTitleClick: () => void;
}

const logoDots = [
  1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0,
];

export const Logo: React.FC<LogoProps> = ({ onAboutClick, onTitleClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className="w-8 h-8 bg-primary rounded-full cursor-pointer overflow-hidden flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAboutClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <DotMatrix letter="C" isHovered={isHovered} dots={logoDots} />
      </motion.div>
      <motion.h1
        className="text-2xl font-light cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onTitleClick}
      >
        CineSync
      </motion.h1>
    </div>
  );
};
