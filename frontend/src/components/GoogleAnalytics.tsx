'use client';
import Script from 'next/script';

// Real GA4 Measurement ID goes in the NEXT_PUBLIC_GA_ID env var (Vercel → Settings → Environment Variables).
// Until a real ID is configured, analytics stays disabled and renders nothing.
const GA_ID = (process.env.NEXT_PUBLIC_GA_ID || '').trim();
const GA_ACTIVE = /^G-[A-Z0-9]{6,}$/i.test(GA_ID) && !/^G-X+$/i.test(GA_ID);

export default function GoogleAnalytics() {
  if (!GA_ACTIVE) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
