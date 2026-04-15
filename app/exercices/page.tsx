"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import ExerciceCard from "@/components/ExerciceCard";
import Timer from "@/components/Timer";

type Exercice = {
  id_exercice: string;
  title: string;
  inhale_seconds: number;
  hold_seconds: number;
  exhale_seconds: number;
};

export default function ExercicesPage() {
  const supabase = createClient();

  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [active, setActive] = useState<Exercice | null>(null);
  const [phase, setPhase] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  const isRunning = useRef(false);
  const activeExerciceId = useRef<string | null>(null);

  const exercisesRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<HTMLDivElement | null>(null);

  // 🔥 SCROLL TO SECTIONS
  const scrollToExercises = () => {
    exercisesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToTimer = () => {
    setTimeout(() => {
      timerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("exercice").select("*");
      setExercices(data || []);
    };

    fetchData();
  }, []);

  const runTimer = (seconds: number) =>
    new Promise<void>((resolve) => {
      if (seconds <= 0) return resolve();

      let t = seconds;
      setTimeLeft(t);

      const interval = setInterval(() => {
        if (!isRunning.current) {
          clearInterval(interval);
          return resolve();
        }

        t -= 1;
        setTimeLeft(t);

        if (t <= 0) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });

  async function startExercise(ex: Exercice) {
    if (isRunning.current) return;
    if (activeExerciceId.current === ex.id_exercice) return;

    isRunning.current = true;
    activeExerciceId.current = ex.id_exercice;

    setActive(ex);
    setShowTimer(true);

    scrollToTimer(); // 🔥 IMPORTANT FIX

    const prep = [3, 2, 1];

    for (const p of prep) {
      if (!isRunning.current) return;

      setPhase("prepare");
      setTimeLeft(p);

      await new Promise((res) => setTimeout(res, 1000));
    }

    if (!isRunning.current) return;

    setPhase("start");

    const cycle = [
      { name: "inhale", duration: ex.inhale_seconds },
      { name: "hold", duration: ex.hold_seconds },
      { name: "exhale", duration: ex.exhale_seconds },
    ];

    while (isRunning.current && activeExerciceId.current === ex.id_exercice) {
      for (const step of cycle) {
        if (!isRunning.current) return;

        setPhase(step.name);
        await runTimer(step.duration);
      }
    }
  }

  function stopExercise() {
    isRunning.current = false;
    activeExerciceId.current = null;

    setShowTimer(false);

    setTimeout(() => {
      setActive(null);
      setPhase("idle");
      setTimeLeft(0);
    }, 600);
  }

  return (
    <div className="bg-white">

      {/* 🌿 HERO */}
      <div
        className="w-full h-screen flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://i.notretemps.com/2000x1125/smart/2020/06/09/vacances-zen-pour-un-sejour-100-detente.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="relative z-10 flex flex-col items-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            Exercices de respiration
          </h1>

          <p className="mt-6 text-white/80 text-lg md:text-xl max-w-xl">
            Inspirez la paix. Expirez le stress. Retrouvez votre calme intérieur.
          </p>

          <button
            onClick={scrollToExercises}
            className="mt-10 px-8 py-3 rounded-full bg-emerald-400/90 hover:bg-emerald-300 text-black font-semibold shadow-lg transition transform hover:scale-105"
          >
            Commencer
          </button>
        </div>
      </div>

      {/* 🧘 TIMER */}
      <div
        ref={timerRef}
        className={`
          flex flex-col items-center justify-center mt-12 mb-16
          transition-all duration-700 ease-out
          ${
            showTimer
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-10 scale-95 pointer-events-none"
          }
        `}
      >
        {active && (
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl px-10 py-10 flex flex-col items-center">
            <Timer exercice={active} phase={phase} timeLeft={timeLeft} />

            <button
              onClick={stopExercise}
              className="mt-8 w-52 bg-red-500/90 hover:bg-red-400 text-white px-6 py-3 rounded-full shadow-md transition transform hover:scale-105"
            >
              Stop
            </button>
          </div>
        )}
      </div>

      <div ref={exercisesRef} className="text-center mt-10 mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Vos exercices</h2>
        <p className="text-gray-500 mt-2">
          Choisissez un exercice et commencez votre session
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-16 bg-gradient-to-b from-white to-emerald-50">
        {exercices.map((ex) => (
          <ExerciceCard
            key={ex.id_exercice}
            exercice={ex}
            onStart={() => startExercise(ex)}
          />
        ))}
      </div>
    </div>
  );
}