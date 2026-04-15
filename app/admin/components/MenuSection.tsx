export default function MenuSection({ menu, createMenu, deleteMenu }: any) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">Menu</h1>

      <button
        onClick={createMenu}
        className="bg-blue-500 text-white px-3 py-1 mb-3"
      >
        + Add Menu
      </button>

      <div className="space-y-2 mb-8">
        {menu.map((m: any) => (
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
    </>
  );
}
