export default function UsersTable({
  users,
  loading,
}: {
  users: any[];
  loading: boolean;
}) {
  if (loading) {
    return <div className="py-10 text-center">Loading users...</div>;
  }

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Role</th>
            <th className="p-3">Verified</th>
            <th className="p-3">Joined</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.name || "—"}</td>
              <td className="p-3">{u.email || "—"}</td>
              <td className="p-3">{u.phone || "—"}</td>
              <td className="p-3">
                <span className="px-2 py-1 text-xs rounded bg-gray-100">
                  {u.role}
                </span>
              </td>
              <td className="p-3">
                {u.isVerified ? "✅" : "❌"}
              </td>
              <td className="p-3">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
