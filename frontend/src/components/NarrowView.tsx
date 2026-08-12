"use client";

import { useEffect } from "react";

/**
 * Pinch-zoom (visual viewport) resilience for the admin panel.
 *
 * Browser pinch / touchpad zoom (Safari, Chrome, Edge, Firefox on laptops)
 * scales the page WITHOUT shrinking the layout viewport, so Tailwind
 * breakpoints never fire and desktop-width content gets clipped with no
 * scrollbar to reach it. This component tracks window.visualViewport and:
 *   - sets <html data-narrow="1"> when the visible width can't fit the
 *     layout content (256px sidebar + breathing room), or when it is
 *     <= 900px outright
 *   - publishes --vvw (visible viewport width in px) as a CSS var so
 *     globals.css can size the admin content column to the visible width
 * globals.css then reflows admin grids/rows/tables to fit.
 */
export default function NarrowView() {
  useEffect(() => {
    const apply = () => {
      const vv = window.visualViewport;
      const vw = vv ? vv.width : window.innerWidth;
      const iw = window.innerWidth;
      const vh = vv ? vv.height : window.innerHeight;
      document.documentElement.style.setProperty("--vvw", String(Math.round(vw)));
      document.documentElement.style.setProperty("--vvh", String(Math.round(vh)));
      // Narrow when the visible viewport can't fit the layout content
      // (fixed 256px sidebar + breathing room), or it's <= 900px outright.
      const narrow = vw <= iw - 256 || vw <= 900;
      if (narrow) {
        document.documentElement.setAttribute("data-narrow", "1");
      } else {
        document.documentElement.removeAttribute("data-narrow");
      }
    };
    apply();
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", apply);
      vv.addEventListener("scroll", apply);
    }
    window.addEventListener("resize", apply);
    return () => {
      if (vv) {
        vv.removeEventListener("resize", apply);
        vv.removeEventListener("scroll", apply);
      }
      window.removeEventListener("resize", apply);
    };
  }, []);
  return null;
}