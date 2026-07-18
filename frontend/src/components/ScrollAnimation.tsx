'use client';
import { ReactNode, useRef, useState, useEffect } from 'react';

export default function ScrollAnimation({ children, animation = 'fade-up', delay = 0 }: {
  children: ReactNode; animation?: 'fade-up'|'fade-left'|'fade-right'|'zoom-in'; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const transforms: Record<string,string> = {
    'fade-up': 'translateY(30px)', 'fade-left': 'translateX(-30px)',
    'fade-right': 'translateX(30px)', 'zoom-in': 'scale(0.9)',
  };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : transforms[animation],
      transition: `all 0.6s ease-out ${delay}ms`,
    }}>
      {children}
    </div>
  );
}
