"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ImageStatus = "loading" | "loaded" | "error";

interface A9ImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
  /** Height of the container (px). Defaults to full height via CSS. */
  containerClassName?: string;
  /** External error callback (preserved for backward-compat) */
  onError?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Shimmer placeholder (pure CSS – no extra deps)                     */
/* ------------------------------------------------------------------ */

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`a9img-shimmer ${className ?? ""}`}>
      <style>{`
        .a9img-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            #0A1628 30%,
            #12243f 50%,
            #0A1628 70%
          );
          background-size: 200% 100%;
          animation: a9img-shimmer-move 1.8s ease-in-out infinite;
        }
        @keyframes a9img-shimmer-move {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Error placeholder – premium navy + gold landscape icon            */
/* ------------------------------------------------------------------ */

function ErrorPlaceholder({ onRetry, label }: { onRetry: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onRetry}
      className="a9img-error-placeholder"
      aria-label={label ?? "Retry loading image"}
    >
      <style>{`
        .a9img-error-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          border: none;
          padding: 20px;
          overflow: hidden;
          /* Background */
          background:
            radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, rgba(212,175,55,0.04) 0%, transparent 50%),
            #0A1628;
          /* Subtle repeating diamond pattern */
          background-image:
            linear-gradient(45deg, rgba(212,175,55,0.03) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(212,175,55,0.03) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(212,175,55,0.03) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(212,175,55,0.03) 75%),
            radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, rgba(212,175,55,0.04) 0%, transparent 50%);
          background-color: #0A1628;
          background-size: 20px 20px, 20px 20px, 20px 20px, 20px 20px, 100% 100%, 100% 100%;
          transition: opacity 0.4s ease, transform 0.3s ease;
        }
        .a9img-error-placeholder:hover {
          opacity: 0.92;
        }
        .a9img-error-placeholder:hover .a9img-retry-text {
          opacity: 1;
        }
        .a9img-error-placeholder svg {
          opacity: 0.5;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .a9img-error-placeholder:hover svg {
          opacity: 0.75;
          transform: scale(1.08);
        }
        .a9img-retry-text {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
      `}</style>

      {/* Landscape / mountain icon in gold */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="a9img-icon"
      >
        {/* Sun */}
        <circle cx="34" cy="14" r="4" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
        {/* Mountains */}
        <path
          d="M4 36L18 16L26 26L32 18L44 36"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Horizon line */}
        <line x1="4" y1="36" x2="44" y2="36" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.04em",
          color: "#D4AF37",
          opacity: 0.55,
        }}
      >
        Image unavailable
      </span>

      <span
        className="a9img-retry-text"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "11px",
          fontWeight: 400,
          letterSpacing: "0.03em",
          color: "rgba(212,175,55,0.4)",
        }}
      >
        Tap to retry
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  A9Image – main component                                          */
/* ------------------------------------------------------------------ */

/**
 * Resilient premium image component for A9 Global Travel.
 *
 * Fallback chain:
 *   1. Original `src` URL
 *   2. `/api/upload?name=<filename>` (Upstash bucket)
 *   3. Elegant error placeholder (click to retry)
 *
 * States: loading → loaded | error
 */
export default function A9Image({
  src,
  alt,
  className,
  style,
  loading = "lazy",
  containerClassName,
  onError,
}: A9ImageProps) {
  /* ---- state ---- */
  const [status, setStatus] = useState<ImageStatus>("loading");
  const [step, setStep] = useState<0 | 1 | 2>(0); // which src in the chain
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const unmountedRef = useRef(false);

  // Track unmount so we don't setState after
  useEffect(() => () => { unmountedRef.current = true; }, []);

  /* ---- build fallback chain ---- */
  const filename = src.split("/").pop() || "";
  const apiUrl = `/api/upload?name=${encodeURIComponent(filename)}`;

  const chain: Record<0 | 1 | 2, string> = {
    0: src,
    1: apiUrl,
    2: "", // triggers error placeholder
  };

  const currentSrc = chain[step];

  /* ---- handlers ---- */
  const handleLoad = useCallback(() => {
    if (!unmountedRef.current) setStatus("loaded");
  }, []);

  const handleError = useCallback(() => {
    if (unmountedRef.current) return;

    if (step === 0) {
      // Try API fallback
      setStep(1);
      setStatus("loading");
    } else if (step === 1) {
      // Both failed → show error placeholder
      setStep(2);
      setStatus("error");
      onError?.();
    } else {
      // Already on error placeholder – nothing to do
    }
  }, [step, onError]);

  const handleRetry = useCallback(() => {
    if (unmountedRef.current) return;
    setStep(0);
    setStatus("loading");
    setRetryCount((c) => c + 1);
  }, []);

  /* ---- Reset when src changes ---- */
  useEffect(() => {
    setStep(0);
    setStatus("loading");
  }, [src]);

  /* ---- Render ---- */
  const showImg = status !== "error" && currentSrc !== "";
  const showError = status === "error";

  return (
    <div
      className={`a9img-root ${containerClassName ?? ""}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Key forces React to create a new <img> when step changes */}
      {showImg && (
        <img
          key={`${currentSrc}-${retryCount}`}
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={className}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: status === "loaded" ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      )}

      {/* Shimmer while loading */}
      {status === "loading" && <Shimmer />}

      {/* Error placeholder */}
      {showError && <ErrorPlaceholder onRetry={handleRetry} label={`Retry loading: ${alt}`} />}
    </div>
  );
}
