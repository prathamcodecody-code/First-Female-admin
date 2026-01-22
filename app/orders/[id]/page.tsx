"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useParams } from "next/navigation";
import TrackingTimeline from "@/components/TrackingTimeline";

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }: { status: string }) => {
  const colors: any = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const orderId = String(id);

  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH ORDER ================= */
  const fetchOrder = async () => {
    const res = await api.get(`/admin/orders/${orderId}`);
    setOrder(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  /* ================= FETCH TRACKING ================= */
  useEffect(() => {
    if (!order?.trackingId) return;

    api
      .get(`/admin/shipping/track/${orderId}`)
      .then((res) => setTracking(res.data))
      .catch(() => setTracking(null));
  }, [order?.trackingId]);

  /* ================= CONFIRM ORDER ================= */
  const confirmOrder = async () => {
    try {
      setActionLoading(true);
      setError("");
      await api.put(`/admin/orders/${orderId}/confirm`);
      await fetchOrder();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to confirm order");
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= SHIP ORDER ================= */
  const shipOrder = async () => {
    try {
      setActionLoading(true);
      setError("");
      await api.post(`/admin/shipping/delhivery/${orderId}`);
      await fetchOrder();
    } catch (err: any) {
      setError(err.response?.data?.message || "Delhivery shipment failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="py-20 text-center">Loading order…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brandPink">
            Order #{order.id}
          </h1>
          <StatusBadge status={order.status} />
        </div>

        {/* SUMMARY + ADDRESS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow space-y-1">
            <h2 className="font-semibold mb-2">Order Summary</h2>

            <p>Items Total: ₹{order.totalAmount}</p>
            <p>Shipping: ₹{order.shippingCharge}</p>
            <p className="font-semibold">
              Payable: ₹{order.finalAmount}
            </p>

            <p className="text-sm text-gray-500">
              Weight: {order.totalWeight} kg
            </p>

            <p className="text-sm">
              Placed: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow space-y-1">
            <h2 className="font-semibold mb-2">Customer Address</h2>
            <p>{order.address?.name}</p>
            <p>{order.address?.phone}</p>
            <p>{order.address?.addressLine1 || order.address?.street}</p>
            <p>
              {order.address?.city}, {order.address?.state}
            </p>
            <p>{order.address?.pincode}</p>
          </div>
        </div>

        {/* SHIPPING ACTIONS */}
        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <h2 className="font-semibold">Shipping</h2>

          {order.status === "PENDING" && (
            <button
              disabled={actionLoading}
              onClick={confirmOrder}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Confirm Order
            </button>
          )}

          {order.status === "CONFIRMED" && !order.trackingId && (
            <button
              disabled={actionLoading}
              onClick={shipOrder}
              className="px-6 py-2 bg-brandPink text-white rounded-lg"
            >
              Ship with Delhivery
            </button>
          )}

          {order.trackingId && (
            <p className="text-green-600 text-sm">
              Shipment created. Waybill: <b>{order.trackingId}</b>
            </p>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* TRACKING */}
        {tracking && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Shipment Tracking</h2>
            <TrackingTimeline scans={tracking.scans} />
          </div>
        )}

        {/* ITEMS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Items</h2>
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between py-2">
              <span>
                {item.product.title} × {item.quantity}
              </span>
              <span>₹{item.quantity * item.price}</span>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
