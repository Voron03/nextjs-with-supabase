"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const supabase = createClient();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) return null;

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeader();

      if (!headers) {
        setError("No session token");
        setUsers([]);
        return;
      }

      const res = await fetch("/api/admin/users", {
        headers,
      });

      const text = await res.text();

      if (!res.ok) {
        console.error("API error:", text);
        setError(text || "Failed to load users");
        setUsers([]);
        return;
      }

      const data = JSON.parse(text);

      setUsers(data.users || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Unexpected error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id: string) => {
    try {
      const headers = await getAuthHeader();

      if (!headers) return;

      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers,
        body: JSON.stringify({ userId: id }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete error:", text);
        return;
      }

      loadUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const toggleUser = async (id: string, current: boolean) => {
    try {
      const headers = await getAuthHeader();

      if (!headers) return;

      const res = await fetch("/api/admin/toggle-user", {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: id,
          isActive: !current,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Toggle error:", text);
        return;
      }

      loadUsers();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin - Users</h1>

      {error && (
        <p className="text-red-500 mb-4 text-sm">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            {/* USER INFO */}
            <div>
              <p className="font-medium">{u.email}</p>
              <p className="text-xs text-gray-500">{u.id}</p>

              <span
                className={`text-xs px-2 py-1 rounded mt-1 inline-block ${u.is_active
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                  }`}
              >
                {u.is_active ? "Active" : "Désactivé"}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleUser(u.id, u.is_active)}
                className={`px-3 py-1 rounded text-white ${u.is_active ? "bg-gray-400" : "bg-green-400"
                  }`}
              >
                {u.is_active ? "Désactiver" : "Activer"}
              </button>


              <button
                onClick={() => deleteUser(u.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
