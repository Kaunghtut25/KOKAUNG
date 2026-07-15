/** Inline SVG image generator — bypasses CDN block in Myanmar */
const COLORS = {
  tours_gold:    { sky: "#1a1a2e", sun: "#D4AF37", land: "#16213e", accent: "#e94560" },
  tours_temple:  { sky: "#ffaa44", sun: "#ddaa33", land: "#2d1810", accent: "#cc6633" },
  hotels_lux:    { sky: "#0f2027", sun: "#203a43", land: "#2c5364", accent: "#D4AF37" },
  hotels_resort: { sky: "#2193b0", sun: "#6dd5ed", land: "#f5af19", accent: "#ffffff" },
  cars_lux:      { sky: "#232526", sun: "#414345", land: "#232526", accent: "#D4AF37" },
  visa_blue:     { sky: "#2980b9", sun: "#6dd5fa", land: "#ffffff", accent: "#2c3e50" },
  insurance_grn: { sky: "#11998e", sun: "#38ef7d", land: "#ffffff", accent: "#2c3e50" },
  sky_lounge:    { sky: "#000428", sun: "#004e92", land: "#000428", accent: "#D4AF37" },
  blog_red:      { sky: "#0a1628", sun: "#D4AF37", land: "#16213e", accent: "#e94560" },
  default:       { sky: "#0a1628", sun: "#D4AF37", land: "#1a2744", accent: "#f5a623" },
};

type ColorKey = keyof typeof COLORS;

function hillPath(seed: number, width: number, height: number, baseY: number): string {
  let d = `M0,${baseY} `;
  const points = 6;
  const step = width / points;
  for (let i = 0; i <= points; i++) {
    const x = i * step;
    const yOff = Math.sin(i * 1.5 + seed) * 20 + Math.sin(i * 2.7 + seed * 2) * 15;
    d += `L${x},${baseY - 30 + yOff} `;
  }
  d += `L${width},${height} L0,${height} Z`;
  return d;
}

function sunCircle(cx: number, cy: number, r: number): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#sunGrad)" opacity="0.9"/>`;
}

export function generateTourSVG(title: string): string {
  return generateSVG(title, "tours_temple");
}

export function generateHotelSVG(title: string): string {
  return generateSVG(title, "hotels_lux");
}

export function generateCarSVG(title: string): string {
  return generateSVG(title, "cars_lux");
}

export function generateVisaSVG(title: string): string {
  return generateSVG(title, "visa_blue");
}

export function generateInsuranceSVG(title: string): string {
  return generateSVG(title, "insurance_grn");
}

export function generateSkyLoungeSVG(title: string): string {
  return generateSVG(title, "sky_lounge");
}

function generateSVG(title: string, colorKey: ColorKey): string {
  const c = COLORS[colorKey];
  const W = 800, H = 500;
  const seed = title.length + (title.charCodeAt(0) || 0);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c.sky}"/>
      <stop offset="100%" stop-color="${c.sun}"/>
    </linearGradient>
    <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c.sun}"/>
      <stop offset="100%" stop-color="${c.accent}"/>
    </linearGradient>
    <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c.land}"/>
      <stop offset="100%" stop-color="${c.accent}"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Sky -->
  <rect width="${W}" height="${H}" fill="url(#skyGrad)"/>
  <!-- Sun -->
  ${sunCircle(W * 0.75, H * 0.35, 40 + (seed % 20))}
  ${sunCircle(W * 0.72, H * 0.33, 50 + (seed % 15))}
  <!-- Hills -->
  <path d="${hillPath(seed, W, H, H * 0.55)}" fill="url(#landGrad)" opacity="0.6"/>
  <path d="${hillPath(seed + 3, W, H, H * 0.65)}" fill="url(#landGrad)" opacity="0.4"/>
  <path d="${hillPath(seed + 7, W, H, H * 0.72)}" fill="url(#landGrad)" opacity="0.8"/>
  <!-- Bottom bar -->
  <rect x="0" y="${H * 0.72}" width="${W}" height="${H * 0.28}" fill="url(#landGrad)"/>
  <!-- Title text -->
  <text x="${W/2}" y="${H * 0.88}" text-anchor="middle" 
    font-family="Georgia, serif" font-size="22" font-weight="bold" 
    fill="${c.sun}" filter="url(#glow)" opacity="0.8">
    ${title.length > 30 ? title.substring(0, 28) + '..' : title}
  </text>
  <!-- A9 Logo mark -->
  <text x="${W/2}" y="${H * 0.15}" text-anchor="middle"
    font-family="Georgia, serif" font-size="14" font-weight="bold"
    fill="${c.accent}" opacity="0.5">
    A9 GLOBAL
  </text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
