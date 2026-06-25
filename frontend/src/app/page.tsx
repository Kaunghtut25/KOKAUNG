import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedTours } from '@/components/home/FeaturedTours';
import { DestinationsGrid } from '@/components/home/DestinationsGrid';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedTours />
      <DestinationsGrid />
    </>
  );
}
