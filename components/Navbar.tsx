"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { LogoutButton } from "./logout-button";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-sm">

      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-gray-900 hover:opacity-80 transition"
        >
          CESIZen
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">

          <Link
            href="/"
            className="text-gray-600 hover:text-black transition"
          >
            Accueil
          </Link>

          <Link
            href="/exercices"
            className="text-gray-600 hover:text-black transition"
          >
            Exercices
          </Link>

          <Link
            href="/protected/profile"
            className="text-gray-600 hover:text-black transition"
          >
            Profil
          </Link>
        </div>

        {/* AUTH SECTION */}
        <div className="flex items-center gap-3">

          {user ? (
            <div className="flex items-center gap-3">
              {/* user pill */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Connecté
              </div>

              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">

              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full text-sm text-gray-700 hover:text-black transition"
              >
                Se connecter
              </Link>

              <Link
                href="/auth/sign-up"
                className="px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition transform hover:scale-105"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
