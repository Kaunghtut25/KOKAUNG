"use client";

import React from "react";

type SkeletonType = "card" | "detail" | "list" | "stats";

interface LoadingSkeletonProps {
  type: SkeletonType;
  count?: number;
}

const shimmerClass =
  "bg-gradient-to-r from-[#0A1628]/80 via-white/5 to-[#0A1628]/80 animate-pulse";

function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden">
      {/* Image placeholder */}
      <div className={`h-48 w-full ${shimmerClass}`} />
      <div className="p-5 space-y-3">
        {/* Title line */}
        <div className={`h-5 w-3/4 rounded-lg ${shimmerClass}`} />
        {/* Subtitle line */}
        <div className={`h-4 w-1/2 rounded-lg ${shimmerClass}`} />
        {/* Description line */}
        <div className={`h-3 w-full rounded-lg ${shimmerClass}`} />
        <div className={`h-3 w-5/6 rounded-lg ${shimmerClass}`} />
        {/* Price + button row */}
        <div className="flex justify-between items-center pt-2">
          <div className={`h-6 w-20 rounded-lg bg-[#D4AF37]/20 ${shimmerClass}`} />
          <div className={`h-9 w-24 rounded-xl ${shimmerClass}`} />
        </div>
      </div>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div className="space-y-6">
      {/* Large image */}
      <div className={`w-full h-64 sm:h-80 rounded-2xl ${shimmerClass}`} />
      {/* Title */}
      <div className={`h-8 w-2/3 rounded-lg ${shimmerClass}`} />
      {/* Meta row */}
      <div className="flex gap-4">
        <div className={`h-5 w-24 rounded-lg ${shimmerClass}`} />
        <div className={`h-5 w-32 rounded-lg ${shimmerClass}`} />
        <div className={`h-5 w-20 rounded-lg ${shimmerClass}`} />
      </div>
      {/* Description blocks */}
      <div className="space-y-3">
        <div className={`h-4 w-full rounded-lg ${shimmerClass}`} />
        <div className={`h-4 w-11/12 rounded-lg ${shimmerClass}`} />
        <div className={`h-4 w-10/12 rounded-lg ${shimmerClass}`} />
        <div className={`h-4 w-3/4 rounded-lg ${shimmerClass}`} />
      </div>
      {/* Highlights row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="glass-card p-4 flex flex-col items-center gap-2"
          >
            <div className={`h-10 w-10 rounded-full ${shimmerClass}`} />
            <div className={`h-3 w-16 rounded-lg ${shimmerClass}`} />
          </div>
        ))}
      </div>
      {/* CTA button */}
      <div className={`h-12 w-full rounded-xl ${shimmerClass}`} />
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5 text-center">
          <div
            className={`h-10 w-16 mx-auto rounded-lg mb-3 ${shimmerClass}`}
          />
          <div className={`h-4 w-20 mx-auto rounded-lg ${shimmerClass}`} />
        </div>
      ))}
    </div>
  );
}

export default function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  switch (type) {
    case "card":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    case "detail":
      return <SkeletonDetail />;
    case "list":
      return <SkeletonList />;
    case "stats":
      return <SkeletonStats />;
    default:
      return null;
  }
}
