import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "A9 Global Travels & Tours accessibility statement - our commitment to an inclusive, accessible website for all users.",
};

export default function AccessibilityPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <section
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #1B2A4A 100%)",
          padding: "80px 20px 60px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 40,
            color: "white",
            marginBottom: 12,
          }}
        >
          Accessibility Statement
        </h1>
        <p style={{ color: "#D4AF37", fontSize: 18 }}>A9 Global Travels & Tours</p>
      </section>

      <section style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px 60px", color: "#333", lineHeight: 1.8 }}>
        <h2 style={{ color: "#0A1628", fontSize: 22, marginBottom: 10 }}>Our Commitment</h2>
        <p>
          A9 Global Travels &amp; Tours is committed to ensuring digital accessibility for people with disabilities.
          We continually improve the user experience for everyone and apply the relevant accessibility standards
          (WCAG 2.1 Level AA) across a9travel.com.
        </p>

        <h2 style={{ color: "#0A1628", fontSize: 22, marginTop: 28, marginBottom: 10 }}>What We&apos;ve Done</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>Keyboard-navigable menus and interactive elements with visible focus states</li>
          <li>Descriptive alternative text for images and icon buttons</li>
          <li>Semantic heading structure and ARIA labels on interactive controls</li>
          <li>Color contrast meeting WCAG AA standards (4.5:1 for text)</li>
          <li>Touch targets of at least 44-48px on mobile interfaces</li>
          <li>Screen-reader compatible forms with clear labels</li>
        </ul>

        <h2 style={{ color: "#0A1628", fontSize: 22, marginTop: 28, marginBottom: 10 }}>Feedback</h2>
        <p>
          We welcome your feedback on the accessibility of our website. If you encounter any barriers, please
          contact us:
        </p>
        <p>
          Email: <a href="mailto:info@a9globaltravel.com" style={{ color: "#0A1628" }}>info@a9globaltravel.com</a>
          <br />
          Phone: <a href="tel:+959781617111" style={{ color: "#0A1628" }}>+95 9 781 617 111</a>
          <br />
          Address: Yangon, Myanmar
        </p>
        <p style={{ marginTop: 24, fontSize: 14, color: "#777" }}>
          This statement was last reviewed on August 8, 2026.
        </p>
      </section>
    </main>
  );
}
