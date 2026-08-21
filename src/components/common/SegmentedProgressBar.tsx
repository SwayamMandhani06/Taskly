import React from 'react';

interface SegmentedProgressBarProps {
  total: number;
  completed: number;
}

export const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({ total, completed }) => {
  if (total <= 0) return null;

  // Render max 16 segments for visual cleanliness
  const segmentsCount = Math.min(total, 20);

  return (
    <div className="flex gap-1.5 w-full items-center my-3" aria-label={`Progress: ${completed} of ${total} completed`}>
      {Array.from({ length: segmentsCount }).map((_, index) => {
        const threshold = ((index + 1) / segmentsCount) * total;
        const isFilled = completed >= threshold;

        return (
          <div
            key={index}
            className={`h-2 flex-1 rounded-sm transition-all duration-200 ${
              isFilled ? 'bg-[var(--accent)] shadow-sm' : 'bg-[var(--border)]'
            }`}
          />
        );
      })}
    </div>
  );
};
