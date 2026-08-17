// Inline SVG flags — Windows does not render flag emoji, so every flag on
// the site is drawn as SVG. Renders identically on Windows/macOS/iOS/Android.
const starPath = (cx: number, cy: number, R: number, r: number): string => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r;
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push((cx + rad * Math.cos(ang)).toFixed(2) + " " + (cy + rad * Math.sin(ang)).toFixed(2));
  }
  return "M" + pts.join(" L") + " Z";
};

const svg = (w: number, h: number, children: React.ReactNode, cls?: string) => (
  <svg className={cls} viewBox="0 0 20 12" width={w} height={h} aria-hidden="true" focusable="false">
    {children}
  </svg>
);

export default function FlagIcon({ code, width = 20, className }: { code?: string; width?: number; className?: string }) {
  const w = width;
  const h = Math.round(width * 0.6);
  switch ((code || "").toLowerCase()) {
    case "th":
      return svg(w, h, (<><rect width="20" height="12" fill="#A51931" /><rect y="2.4" width="20" height="1.2" fill="#F4F5F8" /><rect y="3.6" width="20" height="4.8" fill="#2D2A4A" /><rect y="8.4" width="20" height="1.2" fill="#F4F5F8" /><rect y="9.6" width="20" height="2.4" fill="#A51931" /></>), className);
    case "sg":
      return svg(w, h, (<><rect width="20" height="6" fill="#EF3340" /><rect y="6" width="20" height="6" fill="#fff" /><circle cx="7.3" cy="3.3" r="2.2" fill="#fff" /><circle cx="8.2" cy="2.9" r="1.75" fill="#EF3340" /><g fill="#fff"><circle cx="11.6" cy="1.8" r="0.42" /><circle cx="13.2" cy="2.8" r="0.42" /><circle cx="12.5" cy="4.3" r="0.42" /><circle cx="14.6" cy="2" r="0.42" /><circle cx="15.1" cy="4" r="0.42" /></g></>), className);
    case "my":
      return svg(w, h, (<><rect width="20" height="12" fill="#fff" /><g fill="#CC0001"><rect y="0" width="20" height="0.86" /><rect y="1.71" width="20" height="0.86" /><rect y="3.43" width="20" height="0.86" /><rect y="5.14" width="20" height="0.86" /><rect y="6.86" width="20" height="0.86" /><rect y="8.57" width="20" height="0.86" /><rect y="10.29" width="20" height="0.86" /></g><rect width="7.6" height="5.2" fill="#010066" /><circle cx="5.2" cy="2.6" r="1.5" fill="#FFCC00" /><circle cx="5.8" cy="2.3" r="1.2" fill="#010066" /><path d={starPath(4.5, 3.5, 1.0, 0.4)} fill="#FFCC00" /></>), className);
    case "vn":
      return svg(w, h, (<><rect width="20" height="12" fill="#DA251D" /><path d={starPath(10, 6, 3.4, 1.36)} fill="#FFCD00" /></>), className);
    case "cn":
      return svg(w, h, (<><rect width="20" height="12" fill="#DE2910" /><path d={starPath(4.2, 3.4, 1.8, 0.72)} fill="#FFDE00" /><g fill="#FFDE00"><path d={starPath(7.6, 1.7, 0.6, 0.24)} /><path d={starPath(8.7, 2.8, 0.6, 0.24)} /><path d={starPath(8.3, 4.2, 0.6, 0.24)} /><path d={starPath(7.1, 4.8, 0.6, 0.24)} /></g></>), className);
    case "jp":
      return svg(w, h, (<><rect width="20" height="12" fill="#fff" /><circle cx="10" cy="6" r="3" fill="#BC002D" /></>), className);
    case "kr":
      return svg(w, h, (<><rect width="20" height="12" fill="#fff" /><circle cx="8.6" cy="4.4" r="3" fill="#CD2E3A" /><circle cx="8.6" cy="7.6" r="3" fill="#0047A0" /><circle cx="8.6" cy="4.4" r="1.4" fill="#0047A0" /><circle cx="8.6" cy="7.6" r="1.4" fill="#CD2E3A" /><g fill="#000"><rect x="1" y="1" width="2.6" height="0.45" /><rect x="1" y="1.9" width="2.6" height="0.45" /><rect x="1" y="2.8" width="1.4" height="0.45" /><rect x="16.4" y="1" width="2.6" height="0.45" /><rect x="16.4" y="1.9" width="2.6" height="0.45" /><rect x="17.6" y="2.8" width="1.4" height="0.45" /><rect x="1" y="8.75" width="2.6" height="0.45" /><rect x="1" y="9.65" width="2.6" height="0.45" /><rect x="1" y="10.55" width="1.4" height="0.45" /><rect x="16.4" y="8.75" width="2.6" height="0.45" /><rect x="16.4" y="9.65" width="2.6" height="0.45" /><rect x="17.6" y="10.55" width="1.4" height="0.45" /></g></>), className);
    case "in":
      return svg(w, h, (<><rect width="20" height="4" fill="#FF9933" /><rect y="4" width="20" height="4" fill="#fff" /><rect y="8" width="20" height="4" fill="#138808" /><circle cx="10" cy="6" r="1.4" fill="none" stroke="#000080" strokeWidth="0.6" /><circle cx="10" cy="6" r="0.35" fill="#000080" /></>), className);
    case "ae":
      return svg(w, h, (<><rect width="5" height="12" fill="#FF0000" /><rect x="5" width="15" height="4" fill="#009E49" /><rect x="5" y="4" width="15" height="4" fill="#fff" /><rect x="5" y="8" width="15" height="4" fill="#000" /></>), className);
    case "kh":
      return svg(w, h, (<><rect width="20" height="3" fill="#032EA1" /><rect y="3" width="20" height="6" fill="#E00025" /><rect y="9" width="20" height="3" fill="#032EA1" /><g fill="#fff"><rect x="7.2" y="3.4" width="1.2" height="1.4" /><rect x="9.4" y="3.2" width="1.2" height="1.6" /><rect x="11.6" y="3.4" width="1.2" height="1.4" /><rect x="6" y="4.6" width="8" height="3.6" /></g></>), className);
    case "id":
      return svg(w, h, (<><rect width="20" height="6" fill="#CE1126" /><rect y="6" width="20" height="6" fill="#fff" /></>), className);
    case "tw":
      return svg(w, h, (<><rect width="20" height="12" fill="#FE0000" /><rect width="9" height="6" fill="#000095" /><g fill="#fff"><circle cx="4.5" cy="3" r="1.5" /><rect x="4.1" y="0.6" width="0.8" height="4.8" /><rect x="2.1" y="2.6" width="4.8" height="0.8" /><rect x="2" y="1.2" width="0.8" height="3.6" transform="rotate(45 2.4 3)" /><rect x="6.2" y="1.2" width="0.8" height="3.6" transform="rotate(-45 6.6 3)" /></g></>), className);
    case "ph":
      return svg(w, h, (<><rect width="20" height="6" fill="#0038A8" /><rect y="6" width="20" height="6" fill="#CE1126" /><path d="M0 0 L8.5 6 L0 12 Z" fill="#fff" /><g fill="#FCD116"><circle cx="2.6" cy="6" r="1.4" /><rect x="2.2" y="2.8" width="0.8" height="6.4" /><rect x="0.6" y="4.9" width="4" height="0.8" /><rect x="0.9" y="3.4" width="0.8" height="5.2" transform="rotate(45 1.3 6)" /><rect x="3.6" y="3.4" width="0.8" height="5.2" transform="rotate(-45 4 6)" /><circle cx="1.4" cy="1.4" r="0.45" /><circle cx="1.4" cy="10.6" r="0.45" /><circle cx="4.8" cy="6" r="0.45" /></g></>), className);
    case "au":
      return svg(w, h, (<><rect width="20" height="12" fill="#00247D" /><g transform="scale(0.55)"><rect width="20" height="12" fill="#00247D" /><path d="M0 0 L20 12 M20 0 L0 12" stroke="#fff" strokeWidth="4" /><path d="M0 0 L20 12 M20 0 L0 12" stroke="#C8102E" strokeWidth="2" /><rect x="8.4" y="0" width="3.2" height="12" fill="#fff" /><rect x="0" y="4.8" width="20" height="2.4" fill="#fff" /><rect x="9.2" y="0" width="1.6" height="12" fill="#C8102E" /><rect x="0" y="5.6" width="20" height="0.8" fill="#C8102E" /></g><circle cx="3.6" cy="9.2" r="1.1" fill="#fff" /><g fill="#fff"><path d={starPath(13, 2.2, 0.8, 0.32)} /><path d={starPath(15.6, 4.2, 0.8, 0.32)} /><path d={starPath(13.4, 6.8, 0.8, 0.32)} /><path d={starPath(16.6, 1.2, 0.55, 0.22)} /><path d={starPath(17.8, 9.4, 0.7, 0.28)} /></g></>), className);
    case "gb":
      return svg(w, h, (<><rect width="20" height="12" fill="#012169" /><path d="M0 0 L20 12 M20 0 L0 12" stroke="#fff" strokeWidth="4" /><path d="M0 0 L20 12 M20 0 L0 12" stroke="#C8102E" strokeWidth="2" /><rect x="8.4" y="0" width="3.2" height="12" fill="#fff" /><rect x="0" y="4.8" width="20" height="2.4" fill="#fff" /><rect x="9.2" y="0" width="1.6" height="12" fill="#C8102E" /><rect x="0" y="5.6" width="20" height="0.8" fill="#C8102E" /></>), className);
    case "hk":
      return svg(w, h, (<><rect width="20" height="12" fill="#DE2910" /><g fill="#fff"><circle cx="10" cy="6" r="1.5" /><circle cx="10" cy="2.6" r="1.05" /><circle cx="13.3" cy="4.3" r="1.05" /><circle cx="12" cy="7.9" r="1.05" /><circle cx="8" cy="7.9" r="1.05" /><circle cx="6.7" cy="4.3" r="1.05" /></g></>), className);
    case "mo":
      return svg(w, h, (<><rect width="20" height="12" fill="#00785C" /><g fill="#fff"><circle cx="10" cy="6.4" r="1.7" /><circle cx="10" cy="3.2" r="1.0" /><circle cx="12.6" cy="4.8" r="1.0" /><circle cx="11.7" cy="7.6" r="1.0" /><circle cx="8.3" cy="7.6" r="1.0" /><circle cx="7.4" cy="4.8" r="1.0" /></g><path d="M5.5 9.6 Q10 11.2 14.5 9.6" stroke="#fff" strokeWidth="0.9" fill="none" /><g fill="#fff"><circle cx="4.8" cy="2.6" r="0.4" /><circle cx="6.2" cy="1.9" r="0.4" /><circle cx="13.8" cy="2.6" r="0.4" /><circle cx="15.2" cy="1.9" r="0.4" /><circle cx="17.2" cy="2.8" r="0.4" /></g></>), className);
    case "lk":
      return svg(w, h, (<><rect width="20" height="12" fill="#FFBE29" /><rect x="1.1" y="1.1" width="17.8" height="9.8" fill="#8D153A" /><rect x="9.8" y="1.1" width="4.6" height="9.8" fill="#00534E" /><rect x="14.4" y="1.1" width="4.5" height="9.8" fill="#EB7400" /><circle cx="5.4" cy="6" r="1.7" fill="#FFBE29" /></>), className);
    case "np":
      return svg(w, h, (<><path d="M3 0.8 L17.6 2.6 L17.6 8.4 L10.4 11.4 L3 9.4 Z" fill="#DC143C" stroke="#003893" strokeWidth="1.5" /><circle cx="9.4" cy="5.2" r="2.1" fill="#fff" /><circle cx="10.6" cy="4.9" r="1.65" fill="#DC143C" /><circle cx="10.2" cy="7.6" r="1.0" fill="#fff" /></>), className);
    case "mv":
      return svg(w, h, (<><rect width="20" height="12" fill="#D21034" /><rect x="4.6" y="3.2" width="10.8" height="5.6" fill="#007E3A" /><circle cx="10.8" cy="6" r="1.7" fill="#fff" /><circle cx="11.7" cy="6" r="1.35" fill="#007E3A" /></>), className);
    case "la":
      return svg(w, h, (<><rect width="20" height="3.4" fill="#CE1126" /><rect y="3.4" width="20" height="5.2" fill="#002868" /><rect y="8.6" width="20" height="3.4" fill="#CE1126" /><circle cx="10" cy="6" r="2.2" fill="#fff" /></>), className);
    case "bn":
      return svg(w, h, (<><rect width="20" height="12" fill="#F7E116" /><path d="M0 5.6 L20 2.0 L20 3.9 L0 7.5 Z" fill="#fff" /><path d="M0 6.6 L20 3.0 L20 4.7 L0 8.3 Z" fill="#000" /><circle cx="10" cy="5.9" r="2.1" fill="#CE1126" /></>), className);
    case "mm":
      return svg(w, h, (<><rect width="20" height="4" fill="#fecb00" /><rect y="4" width="20" height="4" fill="#34b233" /><rect y="8" width="20" height="4" fill="#ea2839" /><path d={starPath(10, 6, 2.5, 1.0)} fill="#fff" /></>), className);
    case "us":
      return svg(w, h, (<><rect width="20" height="12" fill="#fff" /><g fill="#b22234"><rect y="0" width="20" height="0.92" /><rect y="1.85" width="20" height="0.92" /><rect y="3.69" width="20" height="0.92" /><rect y="5.54" width="20" height="0.92" /><rect y="7.38" width="20" height="0.92" /><rect y="9.23" width="20" height="0.92" /><rect y="11.08" width="20" height="0.92" /></g><rect width="8" height="6.46" fill="#3c3b6e" /><g fill="#fff"><circle cx="1.33" cy="1.15" r="0.5" /><circle cx="4" cy="1.15" r="0.5" /><circle cx="6.67" cy="1.15" r="0.5" /><circle cx="1.33" cy="3.23" r="0.5" /><circle cx="4" cy="3.23" r="0.5" /><circle cx="6.67" cy="3.23" r="0.5" /><circle cx="1.33" cy="5.31" r="0.5" /><circle cx="4" cy="5.31" r="0.5" /><circle cx="6.67" cy="5.31" r="0.5" /></g></>), className);
    default:
      return svg(w, h, (<><rect width="20" height="12" fill="#E5E7EB" rx="1" /><circle cx="10" cy="6" r="3.6" fill="#9CA3AF" /><path d="M6.5 3 Q13.5 3 13.5 6 Q13.5 9 6.5 9" stroke="#fff" strokeWidth="0.9" fill="none" /></>), className);
  }
}
