type Exercice = {
    title: string
    inhale_seconds: number
    hold_seconds: number
    exhale_seconds: number
}

type Props = {
    exercice: Exercice
    phase: string
    timeLeft: number
}

export default function Timer({ exercice, phase, timeLeft }: Props) {
    const getTotal = () => {
        if (phase === 'inhale') return exercice.inhale_seconds
        if (phase === 'hold') return exercice.hold_seconds
        if (phase === 'exhale') return exercice.exhale_seconds
        return 1
    }

    const total = getTotal()

    const progress = total === 0 ? 1 : (total - timeLeft) / total

    const minScale = 1
    const maxScale = 1.3

    const getScale = () => {
        if (phase === 'inhale') {
            return minScale + (maxScale - minScale) * progress
        }

        if (phase === 'exhale') {
            return maxScale - (maxScale - minScale) * progress
        }

        if (phase === 'hold') {
            return maxScale
        }

        return minScale
    }

    const getColor = () => {
        if (phase === 'inhale') return 'bg-blue-400'
        if (phase === 'hold') return 'bg-purple-400'
        if (phase === 'exhale') return 'bg-green-400'
        return 'bg-gray-400'
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-6">{exercice.title}</h2>

            <div className="relative flex items-center justify-center">
                <div
                    className={`w-40 h-40 rounded-full ${getColor()}`}
                    style={{
                        transform: `scale(${getScale()})`,
                        transition: 'transform 1s linear'
                    }}
                />

                <div className="absolute text-center text-white">
                    <p className="text-2xl font-semibold capitalize">
                        {phase}
                    </p>
                    <p className="text-4xl font-bold">{timeLeft}</p>
                </div>
            </div>
        </div>
    )
}
