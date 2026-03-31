import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  starClassName?: string;
}

export function StarRating({ rating, maxRating = 5, className, starClassName }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-0.5", className)} data-testid="star-rating">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={cn("w-4 h-4 fill-secondary text-secondary", starClassName)} />
      ))}
      {hasHalfStar && <StarHalf className={cn("w-4 h-4 fill-secondary text-secondary", starClassName)} />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={cn("w-4 h-4 text-muted-foreground/30", starClassName)} />
      ))}
    </div>
  );
}
