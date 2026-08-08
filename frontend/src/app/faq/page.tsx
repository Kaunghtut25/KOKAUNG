import { getAll } from "@/lib/persistentStore";
import FaqClient from "./faqclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

const faqJsonLd = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "How do I book a tour?", "acceptedAnswer": {"@type": "Answer", "text": "Simply browse our Tours page, select your preferred tour, click 'Book Now', fill in your details and submit. Our team will contact you within 24 hours to confirm your booking."}}, {"@type": "Question", "name": "What documents do I need for a visa application?", "acceptedAnswer": {"@type": "Answer", "text": "Required documents vary by country. Typically you need: a valid passport (6+ months), passport-size photos, flight itinerary, hotel booking confirmation, and proof of funds."}}, {"@type": "Question", "name": "Can I cancel or modify my booking?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, bookings can be modified or cancelled. Cancellation fees may apply depending on how close to the departure date. Contact us at info@a9globaltravel.com for assistance."}}, {"@type": "Question", "name": "What payment methods do you accept?", "acceptedAnswer": {"@type": "Answer", "text": "We accept bank transfers, cash payments at our office, and major credit cards. Online payment integration is coming soon."}}, {"@type": "Question", "name": "Do you offer travel insurance?", "acceptedAnswer": {"@type": "Answer", "text": "Yes! We offer 9 different insurance plans ranging from basic travel shields to comprehensive annual coverage. Visit our Insurance page to find the right plan for you."}}, {"@type": "Question", "name": "How long does visa processing take?", "acceptedAnswer": {"@type": "Answer", "text": "Processing times vary by country. Most visas take 3-5 business days, but some may take up to 2 weeks."}}, {"@type": "Question", "name": "Do you provide airport transfers?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, we offer airport transfer services with our fleet of vehicles. Book through our Cars section or add it to your tour package."}}, {"@type": "Question", "name": "Are cruise prices per person or per cabin?", "acceptedAnswer": {"@type": "Answer", "text": "Cruise prices are typically per person based on double occupancy. Single supplements may apply. Contact us for detailed pricing."}}, {"@type": "Question", "name": "Can I customize a tour package?", "acceptedAnswer": {"@type": "Answer", "text": "Absolutely! We specialize in custom itineraries. Contact us with your preferences and our travel experts will create a personalized package for you."}}]};

export default async function FaqPage() {
  const siteConfig = await fetchSiteConfig();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqClient siteConfig={siteConfig || {}} />
    </>
  );
}
