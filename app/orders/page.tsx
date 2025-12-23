"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import OrderQuickViewModal from "@/components/modals/OrderQuickViewModal";
import OrderCardSkeleton from "@/components/skeletons/OrderCardSkeleton";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];


export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<
  "today" | "yesterday" | "week" | "custom" | ""
>("");

const [fromDate, setFromDate] = useState<string>("");
const [toDate, setToDate] = useState<string>("");



  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);


  const getDateRange = () => {
  const today = new Date();
  let from = "";
  let to = today.toISOString().split("T")[0];

  if (dateFilter === "today") {
    from = to;
  }

  if (dateFilter === "yesterday") {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    from = y.toISOString().split("T")[0];
    to = from;
  }

  if (dateFilter === "week") {
    const w = new Date(today);
    w.setDate(w.getDate() - 7);
    from = w.toISOString().split("T")[0];
  }

  if (dateFilter === "custom") {
    from = fromDate;
    to = toDate;
  }

  return {
  from: from ? `${from}T00:00:00` : undefined,
  to: to ? `${to}T23:59:59` : undefined,
};
};


  const fetchOrders = async () => {
  setLoading(true);

  const { from, to } = getDateRange();

  const res = await api.get("/orders", {
    params: {
      page,
      status,
      fromDate: from || undefined,
      toDate: to || undefined,
    },
  });

  setOrders(res.data.orders || []);
  setPages(res.data.pages || 1);
  setLoading(false);
};


  useEffect(() => {
  fetchOrders();
}, [page, status, dateFilter, fromDate, toDate]);


  const statusColor = (s: string) =>
    ({
      PENDING: "bg-yellow-500",
      CONFIRMED: "bg-blue-500",
      SHIPPED: "bg-teal-500",
      DELIVERED: "bg-green-600",
      CANCELLED: "bg-red-600",
    }[s] || "bg-gray-400");

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-brandPink mb-6">Orders</h1>

{/* FILTERS */}
<div className="bg-white p-4 rounded-lg shadow mb-6">

  {/* DESKTOP: BUTTON FILTERS */}
  <div className="hidden md:flex gap-3 flex-wrap">
    {STATUS_FILTERS.map((s) => (
      <button
        key={s.value}
        onClick={() => {
  setStatus(s.value);
  setDateFilter("");
  setFromDate("");
  setToDate("");
  setPage(1);
}}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition
          ${
            status === s.value
              ? "bg-brandPink text-white"
              : "bg-brandCream/40 text-brandBlack hover:bg-brandPink/20"
          }`}
      >
        {s.label}
      </button>
    ))}
  </div>
<div className="mt-4 flex gap-3 flex-wrap items-center">
  {[
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "week" },
  ].map((d) => (
    <button
  key={d.value}
  onClick={() => {
    setDateFilter(d.value as any);
    setFromDate("");
    setToDate("");
    setPage(1);
  }}
      className={`px-3 py-2 rounded-lg text-sm font-semibold transition
        ${
          dateFilter === d.value
            ? "bg-brandPink text-white"
            : "bg-gray-100 text-gray-700 hover:bg-brandPink/20"
        }`}
    >
      {d.label}
    </button>
  ))}

  {/* CUSTOM DATE */}
  <button
    onClick={() => setDateFilter("custom")}
    className={`px-3 py-2 rounded-lg text-sm font-semibold transition
      ${
        dateFilter === "custom"
          ? "bg-brandPink text-white"
          : "bg-gray-100 text-gray-700 hover:bg-brandPink/20"
      }`}
  >
    Custom
  </button>
</div>
{dateFilter === "custom" && (
  <div className="mt-4 flex flex-wrap gap-4 items-end">
    <div>
      <label className="text-xs font-semibold text-gray-600">
        From
      </label>
      <input
        type="date"
        className="block border rounded px-3 py-2"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
    </div>

    <div>
      <label className="text-xs font-semibold text-gray-600">
        To
      </label>
      <input
        type="date"
        className="block border rounded px-3 py-2"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
    </div>

    <button
  onClick={() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchOrders(); // force refresh if already on page 1
    }
  }}
      className="px-4 py-2 bg-brandPink text-white rounded-lg"
      disabled={!fromDate || !toDate}
    >
      Apply
    </button>
  </div>
)}



  {/* MOBILE: DROPDOWN */}
  <div className="md:hidden">
    <select
      className="w-full border p-2 rounded bg-brandCream/40"
      value={status}
      onChange={(e) => {
        setStatus(e.target.value);
        setPage(1);
      }}
    >
      {STATUS_FILTERS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  </div>

</div>
<div className="md:hidden mt-4">
  <select
    className="w-full border p-2 rounded"
    value={dateFilter}
    onChange={(e) => {
      setDateFilter(e.target.value as any);
      setPage(1);
    }}
  >
    <option value="">All Dates</option>
    <option value="today">Today</option>
    <option value="yesterday">Yesterday</option>
    <option value="week">Last 7 Days</option>
    <option value="custom">Custom</option>
  </select>
</div>


      {/* ORDERS */}
      <div className="space-y-4">
        {loading ? (
  Array.from({ length: 5 }).map((_, i) => (
    <OrderCardSkeleton key={i} />
  ))
) : (
  orders.map((o) => (
          <div
            key={o.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedOrder(o)}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-brandBlack">
                Order ID: {o.id}
              </p>

              <span
                className={`px-3 py-1 rounded text-white text-xs ${statusColor(
                  o.status
                )}`}
              >
                {o.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-brandGray flex justify-between">
              <span>Total: ₹{o.totalAmount}</span>
              <span>{new Date(o.createdAt).toLocaleString()}</span>
            </div>
            {/* EDIT BUTTON */}
      <button
  className="mt-4 px-4 py-2 bg-brandPink text-white rounded-lg hover:bg-brandPinkLight"
  onClick={(e) => {
    e.stopPropagation();
    router.push(`/orders/${o.id}`);
  }}
>
  View / Edit
</button>
          </div>
        ))
      )}

        {orders.length === 0 && (
          <div className="text-center py-16">
  <p className="text-lg font-semibold text-brandBlack">
    No orders found
  </p>
  <p className="text-sm text-brandGray mt-1">
    Try changing filters or check back later.
  </p>
</div>

        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-brandPink text-white rounded disabled:bg-gray-300"
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-brandPink text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* QUICK VIEW MODAL */}
      <OrderQuickViewModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </AdminLayout>
  );
}
