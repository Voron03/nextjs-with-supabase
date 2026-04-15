'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import ExerciceCard from '@/components/ExerciceCard'
import Timer from '@/components/Timer'

type Exercice = {
    id_exercice: string
    title: string
    inhale_seconds: number
    hold_seconds: number
    exhale_seconds: number
}

export default function ExercicesPage() {
    const supabase = createClient()

    const [exercices, setExercices] = useState<Exercice[]>([])
    const [active, setActive] = useState<Exercice | null>(null)
    const [phase, setPhase] = useState('idle')
    const [timeLeft, setTimeLeft] = useState(0)

    const [showTimer, setShowTimer] = useState(false)

    const isRunning = useRef(false)
    const activeExerciceId = useRef<string | null>(null)
    const exercisesRef = useRef<HTMLDivElement | null>(null)

    const scrollToExercises = () => {
        exercisesRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }


    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('exercice').select('*')
            setExercices(data || [])
        }

        fetchData()
    }, [])

    const runTimer = (seconds: number) =>
        new Promise<void>((resolve) => {
            if (seconds <= 0) return resolve()

            let t = seconds
            setTimeLeft(t)

            const interval = setInterval(() => {
                if (!isRunning.current) {
                    clearInterval(interval)
                    return resolve()
                }

                t -= 1
                setTimeLeft(t)

                if (t <= 0) {
                    clearInterval(interval)
                    resolve()
                }
            }, 1000)
        })

    async function startExercise(ex: Exercice) {
        if (isRunning.current) return
        if (activeExerciceId.current === ex.id_exercice) return

        isRunning.current = true
        activeExerciceId.current = ex.id_exercice

        setActive(ex)
        setShowTimer(true)

        const prep = [3, 2, 1]

        for (const p of prep) {
            if (!isRunning.current) return

            setPhase('prepare')
            setTimeLeft(p)

            await new Promise((res) => setTimeout(res, 1000))
        }

        if (!isRunning.current) return

        setPhase('start')

        const cycle = [
            { name: 'inhale', duration: ex.inhale_seconds },
            { name: 'hold', duration: ex.hold_seconds },
            { name: 'exhale', duration: ex.exhale_seconds }
        ]

        while (isRunning.current && activeExerciceId.current === ex.id_exercice) {
            for (const step of cycle) {
                if (!isRunning.current) return

                setPhase(step.name)
                await runTimer(step.duration)
            }
        }
    }

    function stopExercise() {
        isRunning.current = false
        activeExerciceId.current = null

        setShowTimer(false)

        setTimeout(() => {
            setActive(null)
            setPhase('idle')
            setTimeLeft(0)
        }, 700)
    }

    return (
        <div className="">
            <div
                className="w-full h-screen flex flex-col items-center justify-center text-center relative"
                style={{
                    backgroundImage: "url('https://i.notretemps.com/2000x1125/smart/2020/06/09/vacances-zen-pour-un-sejour-100-detente.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Exercices de respiration
                    </h1>

                    <p className="text-white/80 text-lg max-w-md mb-8">
                        Inspirez la paix, expirez le stress.
                    </p>

                    <button
                        onClick={scrollToExercises}
                        className="bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-3 rounded-full shadow-md transition"
                    >
                        Commencer
                    </button>

                </div>
            </div>


            <div
                className={`
                    flex flex-col items-center justify-center mt-6
                    transition-all duration-700 ease-out
                    ${showTimer
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
                    }
                `}
            >
                {active && (
                    <>
                        <Timer
                            exercice={active}
                            phase={phase}
                            timeLeft={timeLeft}
                        />

                        <button
                            onClick={stopExercise}
                            className="mt-10 mb-10 w-48 bg-red-500 hover:bg-red-600 transition text-white px-8 py-3 rounded-lg shadow-md"
                        >
                            Stop
                        </button>
                    </>
                )}
            </div>

            <div ref={exercisesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-10 pr-10 pb-10">
                {exercices.map((ex) => (
                    <ExerciceCard
                        key={ex.id_exercice}
                        exercice={ex}
                        onStart={() => startExercise(ex)}
                    />
                ))}
            </div>
        </div>
    )
}
