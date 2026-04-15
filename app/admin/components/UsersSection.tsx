export default function UsersSection({ users, toggleUser, deleteUser }: any) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">Users</h1>

      <div className="space-y-2 mb-8">
        {users.map((u: any) => (
          <div key={u.id} className="border p-3 flex justify-between">
            <div>
              <p>{u.email}</p>
              <p className="text-xs text-gray-500">{u.id}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleUser(u.id, u.is_active)}
                className="px-3 py-1 bg-gray-400 text-white"
              >
                {u.is_active ? "Disable" : "Enable"}
              </button>

              <button
                onClick={() => deleteUser(u.id)}
                className="px-3 py-1 bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
