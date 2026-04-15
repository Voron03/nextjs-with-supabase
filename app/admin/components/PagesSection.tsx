import { useEffect } from "react";

export default function PagesSection({
  menu,
  pages,
  selectedMenuId,
  setSelectedMenuId,
  createPage,
  deletePage,
}: any) {
  useEffect(() => {
    if (menu.length && !selectedMenuId) {
      setSelectedMenuId(menu[0].id_menu);
    }
  }, [menu]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-3">Pages</h1>

      <select
        className="border px-3 py-1 mb-3"
        value={selectedMenuId}
        onChange={(e) => setSelectedMenuId(e.target.value)}
      >
        <option value="">Select menu</option>
        {menu.map((m: any) => (
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
            .filter((p: any) => p.menu_id === selectedMenuId)
            .map((p: any) => (
              <div key={p.id_page} className="border p-3 flex justify-between">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-gray-400">
                    menu_id: {p.menu_id}
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
    </>
  );
}
