import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

interface MoviePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterPath: string;
  title: string;
}

export function MoviePosterModal({
  isOpen,
  onClose,
  posterPath,
  title,
}: MoviePosterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-background p-4 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
            <Image
              src={`https://image.tmdb.org/t/p/original${posterPath}`}
              alt={`${title} poster`}
              width={300}
              height={450}
              layout="responsive"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
