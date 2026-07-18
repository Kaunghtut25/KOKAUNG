'use client';
import { ReactNode } from 'react';

export default function GradientCard({ children, href }: { children: ReactNode; href?: string }) {
  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', transition: 'all 0.3s', cursor: href ? 'pointer' : 'default' }}
      onMouseEnter={(e)=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 28px rgba(0,0,0,0.12)';}}
      onMouseLeave={(e)=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
      {children}
      {href && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.8), transparent 60%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 16 }}
          onMouseEnter={(e)=>{e.currentTarget.style.opacity='1';}}
          onMouseLeave={(e)=>{e.currentTarget.style.opacity='0';}}>
          <span style={{ color: '#D4AF37', fontWeight: 600, fontSize: 14 }}>View Details →</span>
        </div>
      )}
    </div>
  );
}
