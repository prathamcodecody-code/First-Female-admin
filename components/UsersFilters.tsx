export default function UsersFilters({
  search,
  setSearch,
  sort,
  setSort,
  range,
  setRange,
  onReset,
}: any) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        className="border rounded px-3 py-2 w-64"
        placeholder="Search name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border rounded px-3 py-2"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="new">Newest</option>
        <option value="old">Oldest</option>
      </select>

      <select
        className="border rounded px-3 py-2"
        value={range || ""}
        onChange={(e) => setRange(e.target.value || undefined)}
      >
        <option value="">All Time</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>

      <button onClick={onReset} className="text-sm text-gray-600">
        Reset
      </button>
    </div>
  );
}
