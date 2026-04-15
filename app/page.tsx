import { Suspense } from "react";
import PagesList from "./PageList";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4">CESIZen</h1>

      <p className="text-gray-500 mb-8 max-w-md">
        Exercices de respiration pour retrouver le calme et la concentration.
      </p>

      <Suspense fallback={<p>Loading...</p>}>
        <PagesList />
      </Suspense>
    </main>
  );
}
