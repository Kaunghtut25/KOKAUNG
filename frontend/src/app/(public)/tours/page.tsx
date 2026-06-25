import { SearchBar } from '@/components/tours/SearchBar';
import { FilterPanel } from '@/components/tours/FilterPanel';

export default function ToursPage() {
  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-sky-900 mb-8">
        Luxury <span className="text-gold-400">Tours</span>
      </h1>
      <SearchBar />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>
        <div className="lg:col-span-3">
          <p className="text-slate-500">Tour listings will connect to the API in the next step.</p>
        </div>
      </div>
    </div>
  );
}
