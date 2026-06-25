export default function TourDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-sky-900 capitalize">
        {params.slug.replace(/-/g, ' ')}
      </h1>
      <p className="text-slate-500 mt-4">Tour detail page — coming soon</p>
    </div>
  );
}
