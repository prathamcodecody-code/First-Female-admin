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
    <div className="flex flex-wrap gap-4 items-center">
      {/* Search Input */}
      <div className="relative group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brandPink transition-colors">
          🔍
        </span>
        <input
          className="border border-gray-200 rounded-xl pl-10 pr-4 py-2 w-full md:w-72 text-sm text-brandBlack focus:outline-none focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink transition-all outline-none"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-brandGray uppercase tracking-wider">Sort:</label>
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-brandBlack bg-white focus:outline-none focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink cursor-pointer transition-all"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Newest First</option>
          <option value="old">Oldest First</option>
        </select>
      </div>

      {/* Date Range Select */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-brandGray uppercase tracking-wider">Range:</label>
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-brandBlack bg-white focus:outline-none focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink cursor-pointer transition-all"
          value={range || ""}
          onChange={(e) => setRange(e.target.value || undefined)}
        >
          <option value="">All Time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="ml-auto text-sm font-bold text-brandGray hover:text-brandPink transition-colors py-2 px-4 rounded-lg hover:bg-brandPink/5 flex items-center gap-2"
      >
        <span className="text-lg">↺</span>
        Reset Filters
      </button>
    </div>
  );
}
