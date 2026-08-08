'use client';
import { useState } from 'react';
import Image from "next/image";

export default function DestImage({ src, alt, fallback, className }: {
  src: string; alt: string; fallback: string; className?: string;
}) {
  const [err, setErr] = useState(false);
  return (
    <Image alt={alt} className={className} onError={() => setErr(true)} src={err ? fallback : src} width={1600} height={900} sizes="100vw" />
  );
}
