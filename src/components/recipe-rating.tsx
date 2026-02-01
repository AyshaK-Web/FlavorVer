"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type RecipeRatingProps = {
  rating: number;
  totalStars?: number;
};

export function RecipeRating({ rating, totalStars = 5 }: RecipeRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleMouseOver = (rate: number) => {
    setHoverRating(rate);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (rate: number) => {
    setCurrentRating(rate);
    // Here you would typically save the rating to a database
    console.log(`New rating: ${rate}`);
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {Array.from({ length: totalStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoverRating || currentRating);
        return (
          <Star
            key={i}
            className={cn(
              "h-6 w-6 cursor-pointer transition-colors",
              isFilled ? "text-yellow-400" : "text-muted-foreground/50"
            )}
            fill={isFilled ? "currentColor" : "none"}
            onMouseOver={() => handleMouseOver(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
}
