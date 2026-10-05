import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  title,
  subtitle,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3F4F1] via-[#EAECE7] to-[#E2E6DF] text-[#111827] p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <ShoppingBag className="w-7 h-7 text-[#0D6832] mb-2 opacity-80" />
        <p className="font-display text-sm font-semibold tracking-tight text-[#111827]">
          {title || alt}
        </p>
        {subtitle && (
          <p className="text-xs text-[#4B5563] mt-1 max-w-xs">{subtitle}</p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

