export default function UsersSection({
  users,
  toggleUser,
  deleteUser,
}: any) {
  return (
    <div>

      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Utilisateurs
          </h2>
          <p className="text-sm text-gray-500">
            Gestion des comptes et permissions
          </p>
        </div>

        <div className="text-xs text-gray-400">
          Total: {users?.length || 0}
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {users.map((u: any) => (
          <div
            key={u.id}
            className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white/70 backdrop-blur hover:shadow-md transition"
          >

            {/* LEFT */}
            <div className="flex items-center gap-3">

              {/* avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-semibold">
                {u.email?.charAt(0).toUpperCase()}
              </div>

              {/* info */}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {u.email}
                </p>

                <p className="text-xs text-gray-400">
                  ID: {u.id}
                </p>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2">

              {/* STATUS */}
              <span
                className={`
                  text-xs px-3 py-1 rounded-full font-medium
                  ${
                    u.is_active
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-500"
                  }
                `}
              >
                {u.is_active ? "Active" : "Disabled"}
              </span>

              {/* TOGGLE */}
              <button
                onClick={() => toggleUser(u.id, u.is_active)}
                className={`
                  text-xs px-3 py-1 rounded-lg transition font-medium
                  ${
                    u.is_active
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : "bg-emerald-500 hover:bg-emerald-400 text-white"
                  }
                `}
              >
                {u.is_active ? "Disable" : "Enable"}
              </button>

              {/* DELETE */}
              <button
                onClick={() => deleteUser(u.id)}
                className="text-xs px-3 py-1 rounded-lg bg-red-500/90 hover:bg-red-400 text-white transition"
              >
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}