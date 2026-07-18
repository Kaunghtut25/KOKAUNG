'use client';
import { ReactNode } from 'react';

export default function ParallaxSection({ image, children, height = 300, overlay = 'rgba(10,22,40,0.6)' }: {
  image: string; children: ReactNode; height?: number; overlay?: string;
}) {
  return (
    <div style={{
      position: 'relative',
      height,
      overflow: 'hidden',
      backgroundImage: `url(${image})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: overlay }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}
