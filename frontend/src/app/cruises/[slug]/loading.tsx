export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 mt-4 text-sm">Loading...</p>
      </div>
    </div>
  );
}
