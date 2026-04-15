import { useEffect } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function PagesSection({
  menu,
  pages,
  selectedMenuId,
  setSelectedMenuId,
  createPage,
  deletePage,
  loading,
}: any) {
  useEffect(() => {
    if (menu.length && !selectedMenuId) {
      setSelectedMenuId(menu[0].id_menu);
    }
  }, [menu]);

  const filteredPages = pages?.filter(
    (p: any) => p.menu_id === selectedMenuId
  );

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Pages
          </h2>
          <p className="text-sm text-gray-500">
            Gestion du contenu des pages
          </p>
        </div>

        <div className="text-xs text-gray-400">
          Total: {filteredPages?.length || 0}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        <select
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
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
          disabled={!selectedMenuId}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 transition disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
        >
          + Nouvelle page
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-10 flex justify-center">
          <Loading />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !selectedMenuId ? (
        <div className="p-6 rounded-2xl border bg-gray-50 text-center text-sm text-gray-500">
          Sélectionnez un menu pour afficher les pages
        </div>
      ) : !loading && filteredPages?.length === 0 ? (
        <div className="p-6 rounded-2xl border bg-gray-50 text-center text-sm text-gray-500">
          Aucune page disponible
        </div>
      ) : !loading && (
        <div className="space-y-3">

          {filteredPages.map((p: any) => (
            <div
              key={p.id_page}
              className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white/70 backdrop-blur hover:shadow-md transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  {p.title?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {p.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    Menu ID: {p.menu_id}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2">

                <Link href={`/admin/pages/${p.id_page}`}>
                  <button className="text-xs px-3 py-1 rounded-lg bg-blue-500/90 hover:bg-blue-400 text-white transition">
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => deletePage(p.id_page)}
                  className="text-xs px-3 py-1 rounded-lg bg-red-500/90 hover:bg-red-400 text-white transition"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}