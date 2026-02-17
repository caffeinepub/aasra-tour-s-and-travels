import { useState } from 'react';
import { Star } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface StarRatingProps {
  label: string;
  value: number | null;
  onChange: (rating: number | null) => void;
  id: string;
  error?: string;
}

export default function StarRating({ label, value, onChange, id, error }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    // If clicking the same rating, clear it (make it optional)
    if (value === rating) {
      onChange(null);
    } else {
      onChange(rating);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, rating: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(rating);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div
        id={id}
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label={label}
        onMouseLeave={() => setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((rating) => {
          const isActive = (hoverRating !== null ? hoverRating : value) !== null && rating <= (hoverRating ?? value ?? 0);
          
          return (
            <button
              key={rating}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => setHoverRating(rating)}
              onKeyDown={(e) => handleKeyDown(e, rating)}
              className="cursor-pointer rounded p-1 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`${rating} star${rating !== 1 ? 's' : ''}`}
              aria-checked={value === rating}
              role="radio"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  isActive
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent text-muted-foreground'
                }`}
              />
            </button>
          );
        })}
        {value !== null && (
          <span className="ml-2 text-sm text-muted-foreground">
            {value} star{value !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <p className="text-xs text-muted-foreground">Optional - Click to select, click again to clear</p>
    </div>
  );
}
