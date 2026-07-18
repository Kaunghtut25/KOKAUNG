'use client';
import { useState } from 'react';

export default function DestImage({ src, alt, fallback, className }: {
  src: string; alt: string; fallback: string; className?: string;
}) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setErr(true)}
    />
  );
}
