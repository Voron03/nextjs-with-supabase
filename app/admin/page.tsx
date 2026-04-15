"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { useAdminData } from "./hooks/useAdminData";
import { useAdminActions } from "./hooks/useAdminActions";

import UsersSection from "./components/UsersSection";
import MenuSection from "./components/MenuSection";
import PagesSection from "./components/PagesSection";

export default function AdminPage() {
  const supabase = createClient();

  const [selectedMenuId, setSelectedMenuId] = useState<string>("");

  /* 🔐 AUTH HEADER */
  const getAuthHeader = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) return null;

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  /* 📦 DATA */
  const { users, menu, pages, refreshAll } =
    useAdminData(getAuthHeader);

  /* ⚙️ ACTIONS */
  const actions = useAdminActions(getAuthHeader, refreshAll);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Tableau de bord d'administration
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System online
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6 space-y-10">

        {/* USERS */}
        <section className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-md rounded-3xl p-6 hover:shadow-xl transition">
          <UsersSection
            users={users}
            toggleUser={actions.toggleUser}
            deleteUser={actions.deleteUser}
          />
        </section>

        {/* MENU */}
        <section className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-md rounded-3xl p-6 hover:shadow-xl transition">
          <MenuSection
            menu={menu}
            createMenu={actions.createMenu}
            deleteMenu={(id: string) =>
              actions.deleteMenu(id, selectedMenuId, setSelectedMenuId)
            }
          />
        </section>

        {/* PAGES */}
        <section className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-md rounded-3xl p-6 hover:shadow-xl transition">
          <PagesSection
            menu={menu}
            pages={pages}
            selectedMenuId={selectedMenuId}
            setSelectedMenuId={setSelectedMenuId}
            createPage={() => actions.createPage(selectedMenuId)}
            deletePage={actions.deletePage}
          />
        </section>

      </div>
    </div>
  );
}