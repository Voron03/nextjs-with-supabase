export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">

      {/* Spinner */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>

      {/* Text */}
      <p className="mt-4 text-gray-500 text-sm animate-pulse">
        Chargement en cours...
      </p>
    </div>
  );
}
