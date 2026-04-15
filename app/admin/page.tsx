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

  // ================= DATA =================
  const { users, menu, pages, refreshAll } =
    useAdminData(getAuthHeader);

  // ================= ACTIONS =================
  const actions = useAdminActions(getAuthHeader, refreshAll);

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* ================= USERS ================= */}
      <UsersSection
        users={users}
        toggleUser={actions.toggleUser}
        deleteUser={actions.deleteUser}
      />

      {/* ================= MENU ================= */}
      <MenuSection
        menu={menu}
        createMenu={actions.createMenu}
        deleteMenu={(id: string) =>
          actions.deleteMenu(id, selectedMenuId, setSelectedMenuId)
        }
      />

      {/* ================= PAGES ================= */}
      <PagesSection
        menu={menu}
        pages={pages}
        selectedMenuId={selectedMenuId}
        setSelectedMenuId={setSelectedMenuId}
        createPage={() => actions.createPage(selectedMenuId)}
        deletePage={actions.deletePage}
      />

    </div>
  );
}