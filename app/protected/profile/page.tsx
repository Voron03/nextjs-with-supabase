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

  // 📥 LOAD PROFILE
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) return;

      setUser(authData.user);

      const { data, error } = await supabase
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

  // 💾 SAVE PROFILE
  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        birthday: birthday,
        is_active: isActive,
      })
      .eq("id", user.id);

    if (error) {
      alert("Erreur lors de l'enregistrement");
    } else {
      alert("Profil mis à jour ✅");
    }

    setSaving(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      <p className="text-sm text-gray-500 mb-4">
        Email: {user?.email}
      </p>

      <div className="flex flex-col gap-3">

        <input
          className="border p-2 rounded"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active user
        </label>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-black text-white p-2 rounded hover:opacity-80"
        >
          {saving ? "En cours..." : "Enregistrer le profil"}
        </button>
      </div>
    </div>
  );
}
