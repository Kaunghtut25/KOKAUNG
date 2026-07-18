'use client';
import { useState } from 'react';

const FAQS: Record<string, [string,string][]> = {
  hotels: [['What time is check-in/check-out?','Check-in is 2:00 PM and check-out is 12:00 PM. Early check-in or late check-out can be arranged.'],['Is breakfast included?','Most hotels include complimentary breakfast. Check the hotel details page for specifics.'],['Do you offer airport transfers?','Yes, we arrange airport transfers for all partner hotels. Select the option during booking.'],['Can I modify my hotel booking?','Yes, modifications can be made up to 48 hours before check-in date.'],['What is the cancellation policy?','Free cancellation up to 72 hours before check-in. Within 72 hours, first night charge applies.']],
  cars: [['What types of vehicles are available?','We offer sedans, SUVs, vans, and luxury vehicles from Toyota, Honda, Mercedes, and more.'],['Is fuel included in the rental price?','Yes, all car rentals include fuel for local trips. Long-distance trips may have additional charges.'],['Can I hire a driver?','Yes, all our vehicles come with professional drivers as standard.'],['What documents do I need?','A valid passport or national ID is required for booking.'],['Can I rent a car for multiple days?','Yes, we offer daily, weekly, and monthly rental options with discounted rates.']],
  visas: [['How long does visa processing take?','Processing time varies by country: 3-7 business days for most, 2-4 weeks for some.'],['What documents are required?','Passport (6+ months validity), passport photos, application form, and supporting documents vary by country.'],['Can you help with urgent visas?','Yes, we offer express processing for an additional fee. Contact us for details.'],['What is the visa success rate?','Our visa success rate is 95%+ for countries we process.'],['Do you handle business visas?','Yes, we process both tourist and business visas for 30+ countries.']],
  insurance: [['What does travel insurance cover?','Medical expenses, trip cancellation, lost baggage, flight delays, and emergency evacuation.'],['How much does travel insurance cost?','Plans start from Ks 50,000 per trip. Premium plans available for comprehensive coverage.'],['Can I buy insurance after booking?','Yes, insurance can be purchased anytime before your trip begins.'],['How do I file a claim?','Contact our 24/7 support hotline. We assist with the entire claims process.'],['Is insurance mandatory for all trips?','Not mandatory but highly recommended for international travel.']],
  cruises: [['What routes are available?','We offer Irrawaddy River cruises, Chindwin River expeditions, and Andaman Sea cruises.'],['How long are the cruises?','Cruises range from 1-day excursions to 14-day luxury voyages.'],['Are meals included?','Yes, all cruises include meals. Luxury cruises include premium dining.'],['What is the best time for cruising?','October to March offers the best weather for river cruises in Myanmar.'],['Do cruises have cabin categories?','Yes, most cruises offer Standard, Deluxe, and Suite cabins.']],
  tours: [['What is included in the tour package?','Hotel, transportation, guide, entrance fees, and most meals. See each tour for details.'],['Can I customize a tour?','Yes, we offer custom tour packages. Contact us with your preferences.'],['What languages do guides speak?','Our guides speak English, Chinese, Japanese, Thai, and French.'],['How large are tour groups?','Group sizes range from 2-15 people. Private tours are also available.'],['What is the best season for Myanmar tours?','November to February is ideal — cool and dry weather.']],
};

export default function FAQAccordion({ section }: { section: string }) {
  const [open, setOpen] = useState<number>(-1);
  const faqs = FAQS[section] || [];
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0A1628', textAlign: 'center', marginBottom: 24 }}>Frequently Asked Questions</h2>
      {faqs.map(([q, a], i) => (
        <div key={i} style={{ borderBottom: '1px solid #eee', marginBottom: 8 }}>
          <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', textAlign: 'left', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15, fontWeight: 600, color: '#0A1628' }}>
            {q}
            <span style={{ color: '#D4AF37', fontSize: 20 }}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <p style={{ padding: '0 0 14px', color: '#555', fontSize: 14, lineHeight: 1.6 }}>{a}</p>}
        </div>
      ))}
    </div>
  );
}
