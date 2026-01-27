"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useParams } from "next/navigation";
import TrackingTimeline from "@/components/TrackingTimeline";
import OrderStatusTimeline from "@/components/order/OrderStatusTimeline";
import { FiPackage, FiTruck, FiMapPin, FiCreditCard, FiClock } from "react-icons/fi";

/* ================= ENHANCED STATUS BADGE ================= */
const StatusBadge = ({ status }: { status: string }) => {
  const colors: any = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    CONFIRMED: "bg-blue-50 text-blue-600 border-blue-100",
    SHIPPED: "bg-purple-50 text-purple-600 border-purple-100",
    DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    CANCELLED: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[status]}`}>
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

  const fetchOrder = async () => {
    const res = await api.get(`/admin/orders/${orderId}`);
    setOrder(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    if (!order?.trackingId) return;
    api
      .get(`/admin/shipping/track/${orderId}`)
      .then((res) => setTracking(res.data))
      .catch(() => setTracking(null));
  }, [order?.trackingId]);

  const confirmOrder = async () => {
    try {
      setActionLoading(true);
      setError("");
      await api.put(`/orders/${orderId}/status`, { status: "CONFIRMED" });
      await fetchOrder();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to confirm order");
    } finally {
      setActionLoading(false);
    }
  };

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
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-brandPink border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Order Data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-brandBlack italic font-serif">
              Order <span className="text-brandPink">#{order.id}</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              <FiClock /> {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* SUMMARY & ADDRESS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white p-8 border border-gray-100 rounded-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
              <FiCreditCard className="text-brandPink" /> Payment & Financials
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Method</span>
                <span className="font-black uppercase tracking-tight">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Items Subtotal</span>
                <span className="font-bold">₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Shipping</span>
                <span className="font-bold">₹{order.shippingCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl pt-4 border-t border-gray-100">
                <span className="font-black uppercase tracking-tighter">Net Payable</span>
                <span className="font-black text-brandPink">₹{order.finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Address */}
          <div className="bg-white p-8 border border-gray-100 rounded-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
              <FiMapPin className="text-brandPink" /> Customer Logistics
            </h2>
            <div className="space-y-2">
              <p className="text-lg font-black uppercase tracking-tight">{order.address?.name}</p>
              <p className="text-sm font-bold text-brandPink tracking-widest">{order.address?.phone}</p>
              <div className="pt-2 text-sm text-gray-500 font-medium leading-relaxed uppercase tracking-tight">
                <p>{order.address?.addressLine1 || order.address?.street}</p>
                <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          <OrderStatusTimeline
            status={order.status}
            createdAt={order.createdAt}
            shippedAt={order.shippedAt}
            confirmedAt={order.confirmedAt}
            deliveredAt={order.deliveredAt}
          />
        </div>

        {/* ACTIONS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-8 border border-gray-100 rounded-sm space-y-6">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <FiTruck className="text-brandPink" /> Fulfillment Actions
                </h2>
                
                <div className="flex gap-4">
                    {order.status === "PENDING" && (
                        <button
                            disabled={actionLoading}
                            onClick={confirmOrder}
                            className="flex-1 bg-blue-600 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
                        >
                            Confirm Order
                        </button>
                    )}

                    {order.status === "CONFIRMED" && !order.trackingId && (
                        <button
                            disabled={actionLoading}
                            onClick={shipOrder}
                            className="flex-1 bg-brandPink text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brandBlack transition-all shadow-lg"
                        >
                            Ship with Delhivery
                        </button>
                    )}
                </div>

                {order.trackingId && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100">
                        <p className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                            Shipment Active: <span className="ml-2 font-mono text-xs">{order.trackingId}</span>
                        </p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest">
                        {error}
                    </div>
                )}
            </div>

            {/* ITEM LIST */}
            <div className="bg-white p-8 border border-gray-100 rounded-sm">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                    <FiPackage className="text-brandPink" /> Manifest Items
                </h2>
                <div className="divide-y divide-gray-50">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between py-4 first:pt-0 last:pb-0">
                            <div>
                                <p className="text-xs font-black uppercase tracking-tight">{item.product.title}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Quantity: {item.quantity} × ₹{item.price}</p>
                            </div>
                            <span className="text-sm font-black text-brandBlack">₹{(item.quantity * item.price).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* SHIPMENT TRACKING (External API Data) */}
        {tracking && (
          <div className="bg-white p-8 border border-gray-100 rounded-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brandBlack mb-8">Detailed Transit Logs</h2>
            <TrackingTimeline scans={tracking.scans} />
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
