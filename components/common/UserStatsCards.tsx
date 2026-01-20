export default function UserStatsCards({ users }: { users: any }) {
  return (
    <>
      <StatCard
        title="Total Users"
        value={users.total}
        color="text-brandPink"
      />
      <StatCard
        title="New Today"
        value={users.today}
        color="text-brandPurple"
      />
      <StatCard
        title="Last 7 Days"
        value={users.last7Days}
        color="text-brandRed"
      />
    </>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm flex flex-col justify-center min-h-[110px]">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}