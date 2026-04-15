import { useEffect } from "react";
import Link from "next/link";

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
              <div key={p.id_page} className="border p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-gray-400">
                    menu_id: {p.menu_id}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/pages/${p.id_page}`}>
                    <button className="px-2 py-1 bg-blue-500 text-white rounded">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => deletePage(p.id_page)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
}
