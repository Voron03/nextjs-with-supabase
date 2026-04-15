"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      setUser(authData.user);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setBirthday(data.birthday || "");
        setIsActive(data.is_active ?? true);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        birthday,
        is_active: isActive,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      alert("Erreur lors de l'enregistrement");
    } else {
      alert("Profil mis à jour ✅");
    }
  };

  /* 🫧 LOADING STATE (UX upgrade) */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 text-sm animate-pulse">
            Chargement du profil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-emerald-50 to-white px-6">

      {/* CARD */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Mon profil
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Gérez vos informations personnelles
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-5 p-3 rounded-xl bg-gray-50 border text-sm text-gray-600">
          📧 {user?.email}
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4">

          <input
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />

          {/* BUTTON */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="mt-2 w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}