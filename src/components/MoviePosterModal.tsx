import { Dialog, DialogContent } from "./ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden max-w-3xl w-full">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/w780${posterPath}`}
            alt={`${title} poster`}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
