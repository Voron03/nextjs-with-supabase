import Loading from "@/components/Loading";

export default function MenuSection({
  menu,
  createMenu,
  deleteMenu,
  loading,
}: any) {
  return (
    <div>

      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Menu
          </h2>
          <p className="text-sm text-gray-500">
            Organisation des sections du site
          </p>
        </div>

        <div className="text-xs text-gray-400">
          Total: {menu?.length || 0}
        </div>
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={createMenu}
        className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition transform hover:scale-[1.02] active:scale-95"
      >
        + Nouveau menu
      </button>

      {/* LOADING */}
      {loading && (
        <div className="py-10 flex justify-center">
          <Loading />
        </div>
      )}

      {/* LIST */}
      {!loading && (
        <div className="space-y-3">

          {menu.map((m: any) => (
            <div
              key={m.id_menu}
              className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white/70 backdrop-blur hover:shadow-md transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-white font-bold">
                  {m.title?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {m.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    ID: {m.id_menu}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <button
                onClick={() => deleteMenu(m.id_menu)}
                className="text-xs px-3 py-1 rounded-lg bg-red-500/90 hover:bg-red-400 text-white transition opacity-80 group-hover:opacity-100"
              >
                Delete
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
