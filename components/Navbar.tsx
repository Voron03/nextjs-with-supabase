"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { LogoutButton } from "./logout-button";

export default function Navbar() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      setRole(data?.role || null);
    };

    // 🔥 ONLY ONE SOURCE OF TRUTH
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (currentUser) {
          fetchProfile(currentUser.id);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-sm">

      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        <Link href="/" className="text-xl font-bold text-gray-900">
          CESIZen
        </Link>

        <div className="hidden md:flex gap-6 text-sm">

          <Link href="/" className="text-gray-600 hover:text-black">
            Accueil
          </Link>

          <Link href="/exercices" className="text-gray-600 hover:text-black">
            Exercices
          </Link>

          <Link href="/protected/profile" className="text-gray-600 hover:text-black">
            Profil
          </Link>

          {role === "admin" && (
            <Link href="/admin" className="text-emerald-600 font-semibold">
              Admin
            </Link>
          )}

        </div>

        <div className="flex items-center gap-3">

          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-700">
                Login
              </Link>
              <Link href="/auth/sign-up" className="bg-black text-white px-4 py-2 rounded-full">
                Sign up
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}