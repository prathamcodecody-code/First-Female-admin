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
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [range, setRange] = useState<"7d" | "30d" | undefined>();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
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
      } catch (err: any) {
        console.error("Failed to fetch users:", err);
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, search, sort, range]);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto w-full space-y-8 p-4 md:p-6">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-brandBlack tracking-tight">
              User <span className="text-brandPink">Management</span>
            </h1>
            <p className="text-brandGray text-sm mt-1">
              View, search, and manage your registered customers.
            </p>
          </div>
        </div>

        {/* ================= FILTERS & CONTENT ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Filter Section Wrapper */}
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="m-6 p-4 bg-red-50 border-l-4 border-brandRed rounded-r-lg flex items-center gap-3">
              <span className="text-brandRed">⚠️</span>
              <p className="text-brandRed font-medium text-sm">{error}</p>
            </div>
          )}

          {/* Table Section */}
          <div className="min-h-[400px]">
            <UsersTable users={users} loading={loading} />
          </div>

          {/* Pagination Footer */}
          {!loading && users.length > 0 && (
            <div className="p-6 border-t border-gray-50 flex justify-center">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
          
          {/* Empty State */}
          {!loading && users.length === 0 && !error && (
            <div className="py-20 text-center">
              <p className="text-brandGray">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
