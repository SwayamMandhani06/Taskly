import React from 'react';

interface MonospaceTagProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'urgent' | 'accent';
  className?: string;
}

export const MonospaceTag: React.FC<MonospaceTagProps> = ({
  children,
  icon,
  variant = 'default',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'urgent':
        return 'text-[var(--urgent)] font-semibold';
      case 'accent':
        return 'text-[var(--accent)] font-medium';
      default:
        return 'text-[var(--ink-soft)]';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 font-mono text-xs ${getVariantStyles()} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
