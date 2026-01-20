"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import UsersTable from "@/components/common/UsersTable";
import UsersFilters from "@/components/UsersFilters";
import Pagination from "@/components/common/Pagination";
import AdminLayout from "@/components/AdminLayout";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [range, setRange] = useState<"7d" | "30d" | undefined>();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: {
          page,
          limit,
          search: search || undefined,
          sort,
          range,
        },
      });

      setUsers(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, sort, range]);

  return (
    <AdminLayout>
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      <UsersFilters
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        range={range}
        setRange={setRange}
        onReset={() => {
          setSearch("");
          setSort("new");
          setRange(undefined);
          setPage(1);
        }}
      />

      <UsersTable users={users} loading={loading} />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
    </AdminLayout>
  );
}

