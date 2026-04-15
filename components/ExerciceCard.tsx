type Exercice = {
  id_exercice: string;
  title: string;
  inhale_seconds: number;
  hold_seconds: number;
  exhale_seconds: number;
};

type Props = {
  exercice: Exercice;
  onStart: (ex: Exercice) => void;
};

export default function ExerciceCard({ exercice, onStart }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">

      {/* soft glow background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-emerald-100/40 via-white to-blue-100/40" />

      <div className="relative p-6 flex flex-col h-full">

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 group-hover:text-black transition">
          {exercice.title}
        </h2>

        {/* subtitle */}
        <p className="text-sm text-gray-400 mt-1">
          Séance de respiration guidée
        </p>

        {/* timings */}
        <div className="mt-6 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Inspiration</span>
            <span className="font-medium">{exercice.inhale_seconds}s</span>
          </div>

          <div className="flex justify-between">
            <span>Rétention</span>
            <span className="font-medium">{exercice.hold_seconds}s</span>
          </div>

          <div className="flex justify-between">
            <span>Expiration</span>
            <span className="font-medium">{exercice.exhale_seconds}s</span>
          </div>
        </div>

        {/* divider */}
        <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* button */}
        <button
          onClick={() => onStart(exercice)}
          className="mt-auto w-full rounded-full bg-emerald-400/90 hover:bg-emerald-300 text-black font-semibold py-3 shadow-md transition transform hover:scale-[1.03] active:scale-95"
        >
          Commencer
        </button>
      </div>
    </div>
  );
}
