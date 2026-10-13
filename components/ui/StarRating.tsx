'use client';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: number;
}

export default function StarRating({ rating, maxStars = 5, interactive = false, onRate, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            onClick={() => interactive && onRate?.(i + 1)}
            disabled={!interactive}
            className={`transition-transform ${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                filled ? 'text-amber-400 fill-amber-400' :
                partial ? 'text-amber-300 fill-amber-200' :
                'text-gray-200 fill-gray-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
