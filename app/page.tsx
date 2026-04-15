import { Suspense } from "react";
import PagesList from "./PageList";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-white via-sky-50 to-white">

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 animate-fadeInUp">
        CESIZen
      </h1>

      {/* Slogan */}
      <p className="mt-6 text-xl text-gray-600 max-w-2xl animate-fadeInUp delay-200">
        Respirez. Concentrez-vous. Progressez.
      </p>

      {/* Subtitle */}
      <p className="mt-3 text-sm text-gray-400 max-w-md animate-fadeInUp delay-300">
        Des exercices de respiration pour retrouver le calme intérieur et améliorer votre focus.
      </p>

      {/* Button */}
      <Link
        href="/exercices"
        className="mt-10 px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition transform hover:scale-105"
      >
        Commencer
      </Link>

      {/* Content */}
      <div className="mt-12 w-full p-5">
        <Suspense fallback={<p className="text-gray-400">Chargement...</p>}>
          <PagesList />
        </Suspense>
      </div>
    </main>
  );
}
