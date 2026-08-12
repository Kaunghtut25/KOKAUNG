/* FIX 2026-08-12: shared tour itinerary generator (extracted from tours/[slug]/page.tsx)
   Used by both the tour detail page and the admin tours editor so the admin sees
   the same itinerary the public site would display, and can edit/save it to DB. */

export interface GeneratedDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
}

export function parseDays(durationStr: string | number): number {
  const match = String(durationStr ?? '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function generateItinerary(days: number, destination: string, t?: (key: string, params?: Record<string, string | number>) => string): GeneratedDay[] {
  if (days <= 0) return [];

  const middleTemplates: { title: string; description: string; meals: string[] }[] = [
    {
      title: t ? t("tour.itinerary.explorationTitle") : 'Exploration',
      description: t ? t("tour.itinerary.explorationDesc", { destination }) : `Discover the highlights of ${destination} with a guided tour of the most iconic landmarks and attractions. Immerse yourself in the rich history and vibrant atmosphere of this incredible destination.`,
      meals: ['Breakfast', 'Lunch'],
    },
    {
      title: t ? t("tour.itinerary.culturalTitle") : 'Cultural Experience',
      description: t ? t("tour.itinerary.culturalDesc", { destination }) : `Dive deep into the local culture with visits to traditional markets, artisan workshops, and historic sites. Interact with local communities and learn about their way of life in ${destination}.`,
      meals: ['Breakfast'],
    },
    {
      title: t ? t("tour.itinerary.leisureTitle") : 'Leisure & Relaxation',
      description: t ? t("tour.itinerary.leisureDesc", { destination }) : `Enjoy a free day at your own pace. Explore the surroundings, relax at the hotel, or opt for optional excursions. This is your day to create your own adventure in ${destination}.`,
      meals: ['Breakfast'],
    },
    {
      title: t ? t("tour.itinerary.natureTitle") : 'Nature & Adventure',
      description: t ? t("tour.itinerary.natureDesc", { destination }) : `Venture into the natural wonders surrounding ${destination}. Experience breathtaking landscapes, scenic trails, and outdoor activities that showcase the region's natural beauty.`,
      meals: ['Breakfast', 'Lunch'],
    },
    {
      title: t ? t("tour.itinerary.hiddenTitle") : 'Hidden Gems',
      description: t ? t("tour.itinerary.hiddenDesc", { destination }) : `Go off the beaten path to discover ${destination}'s hidden treasures. Visit lesser-known spots, secret viewpoints, and local favorites that most tourists miss.`,
      meals: ['Breakfast'],
    },
    {
      title: t ? t("tour.itinerary.gastroTitle") : 'Gastronomic Journey',
      description: t ? t("tour.itinerary.gastroDesc", { destination }) : `Embark on a culinary adventure through ${destination}. Visit local food markets, participate in a cooking class, and savor authentic dishes at handpicked restaurants.`,
      meals: ['Breakfast', 'Lunch', 'Dinner'],
    },
  ];

  const itinerary: GeneratedDay[] = [];

  for (let d = 1; d <= days; d++) {
    let dayPlan: { title: string; description: string; meals: string[] };

    if (d === 1) {
      dayPlan = {
        title: t ? t("tour.itinerary.arrivalTitle") : 'Arrival',
        description: t ? t("tour.itinerary.arrivalDesc", { destination }) : `Welcome to ${destination}! Upon arrival, you will be greeted by our representative and transferred to your hotel. Take the rest of the day to relax and settle in. In the evening, enjoy a welcome dinner featuring local cuisine.`,
        meals: ['Dinner'],
      };
    } else if (d === days) {
      dayPlan = {
        title: t ? t("tour.itinerary.departureTitle") : 'Departure',
        description: t ? t("tour.itinerary.departureDesc", { destination }) : `After breakfast, check out from the hotel. Our representative will transfer you to the airport for your onward journey. Take home unforgettable memories of ${destination}!`,
        meals: ['Breakfast'],
      };
    } else {
      const templateIndex = (d - 2) % middleTemplates.length;
      dayPlan = middleTemplates[templateIndex];
    }

    itinerary.push({ day: d, ...dayPlan });
  }

  return itinerary;
}
