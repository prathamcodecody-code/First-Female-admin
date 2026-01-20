export default function UsersTable({
  users,
  loading,
}: {
  users: any[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-brandPink/20 border-t-brandPink rounded-full animate-spin"></div>
        <p className="text-brandGray animate-pulse font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-separate border-spacing-0">
        <thead className="bg-gray-50/50 text-left">
          <tr>
            <th className="p-4 font-bold text-brandBlack border-b border-gray-100">Name</th>
            <th className="p-4 font-bold text-brandBlack border-b border-gray-100">Email</th>
            <th className="p-4 font-bold text-brandBlack border-b border-gray-100">Phone</th>
            <th className="p-4 font-bold text-brandBlack border-b border-gray-100 text-center">Role</th>
            <th className="p-4 font-bold text-brandBlack border-b border-gray-100 text-center">Verified</th>
            <th className="p-4 font-bold text-brandBlack border-b border-gray-100">Joined</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-brandPink/[0.02] transition-colors group">
              <td className="p-4 font-semibold text-brandBlack">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brandPink/10 text-brandPink flex items-center justify-center text-xs font-bold uppercase">
                    {(u.name || u.email || "U")[0]}
                  </div>
                  {u.name || u.email?.split("@")[0] || u.phone || "User"}
                </div>
              </td>

              <td className="p-4 text-brandGray">{u.email || "—"}</td>
              <td className="p-4 text-brandGray">{u.phone || "—"}</td>
              
              <td className="p-4 text-center">
                <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
                  u.role === 'admin' 
                    ? 'bg-brandPurple/10 text-brandPurple' 
                    : 'bg-gray-100 text-brandGray'
                }`}>
                  {u.role}
                </span>
              </td>

              <td className="p-4 text-center">
                {u.isVerified ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-[10px]">
                    ✓
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-brandRed text-[10px]">
                    ✕
                  </span>
                )}
              </td>

              <td className="p-4 text-brandGray font-medium">
                {new Date(u.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
