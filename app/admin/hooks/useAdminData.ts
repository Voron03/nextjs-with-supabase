import { useEffect, useState } from "react";

export function useAdminData(getAuthHeader: () => Promise<any>) {
  const [users, setUsers] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

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

  const refreshAll = async () => {
    setLoading(true);

    try {
      await Promise.all([
        loadUsers(),
        loadMenu(),
        loadPages(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return {
    users,
    menu,
    pages,
    loading,
    setUsers,
    setMenu,
    setPages,
    refreshAll,
  };
}