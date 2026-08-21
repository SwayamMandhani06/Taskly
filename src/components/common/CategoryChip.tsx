import React from 'react';
import { getCategoryColor } from '../../utils/categoryColors';

interface CategoryChipProps {
  category?: string;
  size?: 'sm' | 'md';
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ category, size = 'sm' }) => {
  if (!category || !category.trim()) return null;

  const color = getCategoryColor(category);

  return (
    <span
      style={{
        backgroundColor: color.bg,
        color: color.text,
        borderColor: color.border,
      }}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-mono text-xs ${
        size === 'sm' ? 'text-[11px]' : 'text-xs px-2.5 py-1'
      }`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color.dot }}
      />
      <span>{category}</span>
    </span>
  );
};
