import React from "react";
import { motion } from "framer-motion";

export const GeneratingMovieAnimation: React.FC = () => {
  const dotCount = 5;
  const dotSize = 6;

  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: dotCount }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-primary rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
          }}
          animate={{
            y: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};
