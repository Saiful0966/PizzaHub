
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  ListOrdered,
  ShoppingBag,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  itemId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderDoc {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  items?: OrderItem[];
  totalAmount?: number;
  status?: string;
  createdAt?: string;
}

type FilterTab = "All Orders" | "Pending" | "Delivered";

const STATUS_OPTIONS = ["Pending", "Accepted", "Delivered"] as const;

const FALLBACK_PIZZA_NAMES = [
  "Pepperoni Pizza",
  "Veggie Delight",
  "Margherita Pizza",
  "Cheese Burst Pizza",
  "Spicy Peri-Peri Pizza",
];

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("All Orders");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDoc | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const apiUrl = rawApiUrl.replace(/\/+$/, "");

      try {
        if (isMounted) setLoading(true);
        const res = await fetch(`${apiUrl}/orders?role=vendor`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (isMounted) setOrders([]);
          return;
        }

        const data = await res.json();
        if (isMounted) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn("Error fetching customer orders:", err);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const previousOrders = [...orders];

    setOrders((prev) =>
      prev.map((ord) =>
        ord._id === orderId ? { ...ord, status: newStatus } : ord
      )
    );

    if (selectedOrder?._id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      setUpdatingOrderId(orderId);
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const apiUrl = rawApiUrl.replace(/\/+$/, "");

      let res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        res = await fetch(`${apiUrl}/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      }

      if (!res.ok) {
        setOrders(previousOrders);
        toast.error("Could not update order status");
        return;
      }

      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.warn("Status update warning:", err);
      setOrders(previousOrders);
      toast.error("Could not update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const tabCounts = useMemo(() => {
    const pending = orders.filter(
      (o) => (o.status || "Pending").trim().toLowerCase() === "pending"
    ).length;
    const delivered = orders.filter(
      (o) => (o.status || "").trim().toLowerCase() === "delivered"
    ).length;

    return {
      "All Orders": orders.length,
      Pending: pending,
      Delivered: delivered,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "All Orders") return orders;
    return orders.filter(
      (o) =>
        (o.status || "Pending").trim().toLowerCase() ===
        activeTab.toLowerCase()
    );
  }, [orders, activeTab]);

  const getItemTitle = (item?: OrderItem, index = 0) => {
    const rawName = (item?.name || "").trim();
    if (!rawName || /^https?:\/\//i.test(rawName)) {
      return FALLBACK_PIZZA_NAMES[index % FALLBACK_PIZZA_NAMES.length];
    }
    return rawName;
  };

  const formatOrderDateTime = (dateStr?: string) => {
    if (!dateStr) return "Apr 20, 2025 • 2:30 PM";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "Recent Order";
    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${datePart} • ${timePart}`;
  };

  const getStatusBadgeStyle = (status?: string) => {
    const normalized = (status || "Pending").trim().toLowerCase();
    if (normalized === "delivered") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    if (normalized === "accepted") {
      return "bg-sky-100 text-sky-700 border-sky-200";
    }
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const renderStatusIcon = (status?: string) => {
    const normalized = (status || "Pending").trim().toLowerCase();
    if (normalized === "delivered") {
      return <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />;
    }
    return <Clock className="h-3.5 w-3.5 shrink-0" />;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-medium text-gray-500"
      >
        <Link href="/dashboard" className="hover:text-gray-800 transition">
          Home
        </Link>
        <span>&gt;</span>
        <span className="text-[#D91B24] font-semibold">Orders</span>
      </nav>

      {/* Header Page  */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-[#D91B24] border border-rose-100 shrink-0">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track customer pizza orders and stay updated with the latest status.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        {(
          [
            {
              key: "All Orders",
              label: "All Orders",
              icon: <ListOrdered className="h-4 w-4" />,
            },
            {
              key: "Pending",
              label: "Pending",
              icon: <Clock className="h-4 w-4" />,
            },
            {
              key: "Delivered",
              label: "Delivered",
              icon: <CheckCircle2 className="h-4 w-4" />,
            },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                isActive
                  ? "bg-[#D91B24] text-white border-[#D91B24] shadow-xs"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`ml-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {loading ? "..." : tabCounts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-500">
          Loading customer orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-sm font-medium text-gray-600">
            No {activeTab === "All Orders" ? "" : activeTab.toLowerCase()}{" "}
            orders found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const serialNumber = index + 1;
            const items = order.items || [];
            const firstItem = items[0];
            const firstTitle = getItemTitle(firstItem, index);
            const extraCount = items.length - 1;
            const itemDisplayName = `${firstTitle}${
              extraCount > 0 ? ` +${extraCount} more` : ""
            }`;
            const quantityCount = firstItem?.quantity || 1;
            const unitPrice = Number(
              firstItem?.price ?? order.totalAmount ?? 0
            );
            const totalPrice = Number(
              order.totalAmount ?? unitPrice * quantityCount
            );
            const pizzaBannerImage = firstItem?.image || "/pizzahub-logo.png";
            const thumbImage = firstItem?.image || "/pizzahub-logo.png";

            const orderNumber = `Order #ORD-${String(order._id || index)
              .slice(-4)
              .toUpperCase()}`;

            const currentStatus =
              STATUS_OPTIONS.find(
                (opt) =>
                  opt.toLowerCase() ===
                  String(order.status || "Pending").trim().toLowerCase()
              ) || "Pending";

            return (
              <div
                key={order._id || index}
                className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                 {/* Serial Number */}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-xs font-extrabold text-[#D91B24] border border-rose-100 shrink-0">
                    {serialNumber}
                  </span>

                  <img
                    src={pizzaBannerImage}
                    alt={itemDisplayName}
                    className="h-24 w-full sm:w-32 rounded-xl object-cover border border-gray-100 bg-gray-100 shrink-0"
                  />

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                        {orderNumber}
                      </h2>
                      {order.customerName && (
                        <span className="text-xs font-medium text-gray-500">
                          • {order.customerName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span>{formatOrderDateTime(order.createdAt)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-100 max-w-md">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={thumbImage}
                          alt={itemDisplayName}
                          className="h-6 w-6 rounded-full object-cover border border-gray-100 shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                          {itemDisplayName}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-xs sm:text-sm">
                        <span className="text-gray-500">× {quantityCount}</span>
                        <span className="font-semibold text-gray-800">
                          ${unitPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm pt-0.5">
                      <span className="text-gray-600 font-medium">
                        Total Amount:{" "}
                      </span>
                      <span className="font-extrabold text-[#D91B24]">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeStyle(
                        currentStatus
                      )}`}
                    >
                      {renderStatusIcon(currentStatus)}
                      <span>{currentStatus}</span>
                    </span>

                    <select
                      aria-label={`Update status for ${orderNumber}`}
                      value={currentStatus}
                      disabled={updatingOrderId === order._id}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 outline-none hover:bg-gray-100 transition cursor-pointer disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#D91B24] px-4 py-2 text-xs font-semibold text-[#D91B24] hover:bg-rose-50 transition cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">
                Order #ORD-
                {String(selectedOrder._id || "").slice(-4).toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Customer:</span>{" "}
                {selectedOrder.customerName || "Customer"}
              </p>
              {selectedOrder.customerEmail && (
                <p>
                  <span className="font-semibold text-gray-900">Email:</span>{" "}
                  {selectedOrder.customerEmail}
                </p>
              )}
              {selectedOrder.phone && (
                <p>
                  <span className="font-semibold text-gray-900">Phone:</span>{" "}
                  {selectedOrder.phone}
                </p>
              )}
              {selectedOrder.address && (
                <p>
                  <span className="font-semibold text-gray-900">Address:</span>{" "}
                  {selectedOrder.address}
                </p>
              )}
              {selectedOrder.paymentMethod && (
                <p>
                  <span className="font-semibold text-gray-900">Payment:</span>{" "}
                  {selectedOrder.paymentMethod}
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Ordered Items
              </p>
              {(selectedOrder.items || []).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs sm:text-sm py-1"
                >
                  <span className="font-medium text-gray-800">
                    {getItemTitle(item, idx)} × {item.quantity || 1}
                  </span>
                  <span className="font-semibold text-gray-900">
                    $
                    {(
                      Number(item.price || 0) * Number(item.quantity || 1)
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-sm font-bold text-gray-900">
                Total Amount
              </span>
              <span className="text-base font-extrabold text-[#D91B24]">
                ${Number(selectedOrder.totalAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}