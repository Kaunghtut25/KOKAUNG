"use client";

import { useState } from "react";

interface A9ImageProps {
  src: string; // e.g. "/images/hero-bagan.jpg"
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
  onError?: () => void;
}

/**
 * Resilient image component: tries static /images/ path first,
 * then falls back to /api/upload?name=X for Upstash-served images.
 */
export default function A9Image({ src, alt, className, style, loading = "lazy", onError }: A9ImageProps) {
  const [failed, setFailed] = useState(false);

  // Extract filename from path
  const filename = src.split("/").pop() || "";
  const apiUrl = `/api/upload?name=${encodeURIComponent(filename)}`;

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      onError?.();
    }
  };

  return (
    <img
      src={failed ? apiUrl : src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={handleError}
    />
  );
}
