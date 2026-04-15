type Exercice = {
    id_exercice: string
    title: string
    inhale_seconds: number
    hold_seconds: number
    exhale_seconds: number
}

type Props = {
    exercice: Exercice
    onStart: (ex: Exercice) => void
}

export default function ExerciceCard({ exercice, onStart }: Props) {
    return (
        <div className="p-6 rounded-2xl border border-zinc-300">
            <h2 className="text-xl font-semibold">{exercice.title}</h2>

            <div className="mt-4 text-sm text-gray-600">
                <p>Inhale: {exercice.inhale_seconds}s</p>
                <p>Hold: {exercice.hold_seconds}s</p>
                <p>Exhale: {exercice.exhale_seconds}s</p>
            </div>

            <button
                onClick={() => onStart(exercice)}
                className="mt-4 w-full bg-green-400 hover:bg-green-500 text-white py-2 rounded-lg"
            >
                Start
            </button>
        </div>
    )
}
