"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const supabase = createClient();

  // ================= STATE =================
  const [users, setUsers] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);

  const [selectedMenuId, setSelectedMenuId] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ================= AUTH =================
  const getAuthHeader = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) return null;

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // ================= LOADERS =================
  const loadUsers = async () => {
    const headers = await getAuthHeader();
    if (!headers) return;

    const res = await fetch("/api/admin/users", { headers });
    const data = await res.json();
    setUsers(data.users || []);
  };

  const loadMenu = async () => {
    const headers = await getAuthHeader();
    if (!headers) return;

    const res = await fetch("/api/admin/menu", { headers });
    const data = await res.json();
    setMenu(data.menu || []);
  };

  const loadPages = async () => {
    const headers = await getAuthHeader();
    if (!headers) return;

    const res = await fetch("/api/admin/pages", { headers });
    const data = await res.json();
    setPages(data.pages || []);
  };

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([loadUsers(), loadMenu(), loadPages()]);
      } catch (err: any) {
        setError(err.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // авто выбор первого меню
  useEffect(() => {
    if (menu.length && !selectedMenuId) {
      setSelectedMenuId(menu[0].id_menu);
    }
  }, [menu]);

  // ================= USERS =================
  const deleteUser = async (id: string) => {
    const headers = await getAuthHeader();
    if (!headers) return;

    await fetch("/api/admin/delete-user", {
      method: "POST",
      headers,
      body: JSON.stringify({ userId: id }),
    });

    loadUsers();
  };

  const toggleUser = async (id: string, current: boolean) => {
    const headers = await getAuthHeader();
    if (!headers) return;

    await fetch("/api/admin/toggle-user", {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId: id,
        isActive: !current,
      }),
    });

    loadUsers();
  };

  // ================= MENU =================
  const createMenu = async () => {
    const title = prompt("Menu title?");
    if (!title) return;

    const headers = await getAuthHeader();
    if (!headers) return;

    await fetch("/api/admin/menu", {
      method: "POST",
      headers,
      body: JSON.stringify({ title }),
    });

    loadMenu();
  };

  const deleteMenu = async (id: string) => {
    const headers = await getAuthHeader();
    if (!headers) return;

    await fetch("/api/admin/menu", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id }),
    });

    await loadMenu();

    await loadPages();

    if (selectedMenuId === id) {
      setSelectedMenuId("");
    }
  };

  // ================= PAGES =================
  const createPage = async () => {
    const title = prompt("Page title?");
    if (!title) return;

    if (!selectedMenuId) {
      alert("Select menu first");
      return;
    }

    const headers = await getAuthHeader();
    if (!headers) return;

    await fetch("/api/admin/pages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        title,
        menu_id: selectedMenuId,
        data: {},
      }),
    });

    loadPages();
  };

  const deletePage = async (id: string) => {
    const headers = await getAuthHeader();
    if (!headers) return;

    await fetch("/api/admin/pages", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id }),
    });

    loadPages();
  };

  // ================= UI =================
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* ERROR */}
      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

      {/* USERS */}
      <h1 className="text-2xl font-bold mb-3">Users</h1>

      <div className="space-y-2 mb-8">
        {users.map((u) => (
          <div key={u.id} className="border p-3 flex justify-between">
            <div>
              <p>{u.email}</p>
              <p className="text-xs text-gray-500">{u.id}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleUser(u.id, u.is_active)}
                className="px-3 py-1 bg-gray-400 text-white"
              >
                {u.is_active ? "Disable" : "Enable"}
              </button>

              <button
                onClick={() => deleteUser(u.id)}
                className="px-3 py-1 bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MENU */}
      <h1 className="text-2xl font-bold mb-3">Menu</h1>

      <button
        onClick={createMenu}
        className="bg-blue-500 text-white px-3 py-1 mb-3"
      >
        + Add Menu
      </button>

      <div className="space-y-2 mb-8">
        {menu.map((m) => (
          <div key={m.id_menu} className="border p-3 flex justify-between">
            <span>{m.title}</span>

            <button
              onClick={() => deleteMenu(m.id_menu)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* PAGES */}
      <h1 className="text-2xl font-bold mb-3">Pages</h1>

      {/* SELECT MENU */}
      <select
        className="border px-3 py-1 mb-3"
        value={selectedMenuId}
        onChange={(e) => setSelectedMenuId(e.target.value)}
      >
        <option value="">Select menu</option>
        {menu.map((m) => (
          <option key={m.id_menu} value={m.id_menu}>
            {m.title}
          </option>
        ))}
      </select>

      <button
        onClick={createPage}
        className="bg-green-500 text-white px-3 py-1 mb-3 ml-3"
      >
        + Add Page
      </button>

      <div className="space-y-2">
        {!selectedMenuId ? (
          <p className="text-gray-500 text-sm">
            Select a menu to see pages
          </p>
        ) : (
          pages
            .filter((p) => p.menu_id === selectedMenuId)
            .map((p) => (
              <div key={p.id_page} className="border p-3 flex justify-between">
                <div>
                  <p className="font-medium">{p.title}</p>

                  <p className="text-xs text-gray-400">
                    menu:{" "}
                    {menu.find((m) => m.id_menu === p.menu_id)?.title ||
                      "Unknown"}
                  </p>
                </div>

                <button
                  onClick={() => deletePage(p.id_page)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}