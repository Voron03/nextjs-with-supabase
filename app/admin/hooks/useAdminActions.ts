export function useAdminActions(getAuthHeader: any, refreshAll: any) {

  // ================= USERS =================
  const deleteUser = async (id: string) => {
    const headers = await getAuthHeader();

    await fetch("/api/admin/delete-user", {
      method: "POST",
      headers,
      body: JSON.stringify({ userId: id }),
    });

    refreshAll();
  };

  const toggleUser = async (id: string, current: boolean) => {
    const headers = await getAuthHeader();

    await fetch("/api/admin/toggle-user", {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId: id,
        isActive: !current,
      }),
    });

    refreshAll();
  };

  // ================= MENU =================
  const createMenu = async () => {
    const title = prompt("Menu title?");
    if (!title) return;

    const headers = await getAuthHeader();

    await fetch("/api/admin/menu", {
      method: "POST",
      headers,
      body: JSON.stringify({ title }),
    });

    refreshAll();
  };

  const deleteMenu = async (id: string, selectedMenuId: string, setSelectedMenuId: any) => {
    const headers = await getAuthHeader();

    await fetch("/api/admin/menu", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id }),
    });

    refreshAll();

    if (selectedMenuId === id) {
      setSelectedMenuId("");
    }
  };

  // ================= PAGES =================
  const createPage = async (selectedMenuId: string) => {
    const title = prompt("Page title?");
    if (!title || !selectedMenuId) return;

    const headers = await getAuthHeader();

    await fetch("/api/admin/pages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        title,
        menu_id: selectedMenuId,
        data: {},
      }),
    });

    refreshAll();
  };

  const deletePage = async (id: string) => {
    const headers = await getAuthHeader();

    await fetch("/api/admin/pages", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id }),
    });

    refreshAll();
  };

  return {
    deleteUser,
    toggleUser,
    createMenu,
    deleteMenu,
    createPage,
    deletePage,
  };
}
