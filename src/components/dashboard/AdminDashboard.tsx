"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Crown,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  Users,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface Props {
  userName?: string;
}

interface UserDoc {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface OrderItem {
  itemId?: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderDoc {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  items?: OrderItem[];
  totalAmount?: number;
  status?: string;
  createdAt?: string;
}

const STATUS_OPTIONS = ["Pending", "Accepted", "Delivered"] as const;

const getCleanApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  return raw.replace(/\/+$/, "");
};

const buildDynamicPizzaLabel = (
  item: OrderItem | undefined,
  order: OrderDoc,
  index: number
) => {
  const rawName = (item?.name || "").trim();
  if (rawName && !/^https?:\/\//i.test(rawName)) {
    return rawName;
  }

  const category = (item?.category || "Pizza").trim();
  const priceTag =
    typeof item?.price === "number" && !Number.isNaN(item.price)
      ? ` ($${item.price.toFixed(0)})`
      : "";
  const idPart = String(order._id || index + 1)
    .slice(-2)
    .toUpperCase();

  return `${category} #${idPart}${priceTag}`;
};

export default function AdminDashboard({ userName }: Props) {
  const { data: session } = authClient.useSession();

  const [users, setUsers] = useState<UserDoc[]>([]);
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const adminDisplayName = userName || session?.user?.name || "Admin";

  useEffect(() => {
    let isMounted = true;

    const fetchAdminOverview = async () => {
      const apiUrl = getCleanApiUrl();
      if (!apiUrl) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);

        const [usersRes, ordersRes] = await Promise.all([
          fetch(`${apiUrl}/users`, { cache: "no-store" }),
          fetch(`${apiUrl}/orders?role=admin`, { cache: "no-store" }),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (isMounted) {
            setUsers(Array.isArray(usersData) ? usersData : []);
          }
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (isMounted) {
            setOrders(Array.isArray(ordersData) ? ordersData : []);
          }
        }
      } catch (err) {
        console.warn("Admin dashboard fetch warning:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdminOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalUsersCount = users.length;
  const totalVendorsCount = useMemo(
    () =>
      users.filter((u) => String(u.role || "").trim().toLowerCase() === "vendor")
        .length,
    [users]
  );

  const totalOrdersCount = orders.length;
  const totalRevenue = useMemo(
    () =>
      orders.reduce((sum, ord) => sum + Number(ord.totalAmount || 0), 0),
    [orders]
  );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    const apiUrl = getCleanApiUrl();
    if (!apiUrl) return;

    try {
      setUpdatingOrderId(orderId);
      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

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

  const getStatusStyle = (status?: string) => {
    const normalized = (status || "Pending").trim().toLowerCase();
    if (normalized === "delivered") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (normalized === "accepted") {
      return "bg-emerald-50/70 text-emerald-600 border-emerald-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const formatShortDate = (dateStr?: string) => {
    if (!dateStr) return "Apr 20, 2025";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "Recent";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-7">
      {/* Top Badge + Welcome */}
      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#D91B24] border border-rose-100">
          <Crown className="h-3.5 w-3.5 fill-[#D91B24]" />
          <span>Admin Dashboard</span>
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <span>Welcome back, {adminDisplayName}!</span>
          <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-sm text-gray-500">
          Here&apos;s an overview of your PizzaHub platform.
        </p>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Users */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-100/90 bg-gradient-to-br from-[#FFF5F5] to-[#FFEAEA] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">Total Users</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : totalUsersCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +12%
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-[#D91B24] shadow-2xs">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <Users className="h-20 w-20 text-rose-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>

        {/* Total Orders */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-100/90 bg-gradient-to-br from-[#FFF9F2] to-[#FFF1E0] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                Total Orders
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : totalOrdersCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +8%
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-amber-600 shadow-2xs">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>
          <ShoppingCart className="h-20 w-20 text-amber-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>

        {/* Total Revenue */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-gradient-to-br from-[#F3FCF7] to-[#E3F7EC] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                Total Revenue
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : `$${totalRevenue.toFixed(2)}`}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +15%
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-emerald-600 shadow-2xs">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <DollarSign className="h-20 w-20 text-emerald-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>

        {/* Total Vendors */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100/90 bg-gradient-to-br from-[#F8F5FF] to-[#EFE9FF] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                Total Vendors
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : totalVendorsCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +5%
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-purple-600 shadow-2xs">
              <Store className="h-6 w-6" />
            </div>
          </div>
          <Store className="h-20 w-20 text-purple-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>
      </div>

      {/* Middle Section: Recent Orders Table + Promo Banner */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Recent Orders Table */}
        <div className="xl:col-span-8 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#D91B24]" />
                <h2 className="text-lg font-extrabold text-gray-900">
                  Recent Orders
                </h2>
              </div>

              <Link
                href="/dashboard/customer-orders"
                className="text-xs sm:text-sm font-bold text-[#D91B24] hover:underline inline-flex items-center gap-1"
              >
                <span>View All Orders</span>
                <span>→</span>
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm text-gray-500">
                Loading recent orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">
                No recent orders available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-bold text-gray-500">
                      <th className="py-2.5 pr-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Pizza</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 pl-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                    {orders.slice(0, 4).map((order, idx) => {
                      const firstItem = order.items?.[0];
                      const extraCount = (order.items?.length || 1) - 1;
                      const basePizza = buildDynamicPizzaLabel(
                        firstItem,
                        order,
                        idx
                      );
                      const pizzaLabel = `${basePizza}${
                        extraCount > 0 ? ` +${extraCount}` : ""
                      }`;
                      const orderCode = `#ORD-${String(order._id || idx)
                        .slice(-4)
                        .toUpperCase()}`;
                      const currentStatus =
                        STATUS_OPTIONS.find(
                          (st) =>
                            st.toLowerCase() ===
                            String(order.status || "Pending")
                              .trim()
                              .toLowerCase()
                        ) || "Pending";

                      return (
                        <tr
                          key={order._id || idx}
                          className="hover:bg-gray-50/60 transition"
                        >
                          <td className="py-3 pr-3 font-semibold text-sky-600 whitespace-nowrap">
                            {orderCode}
                          </td>
                          <td className="py-3 px-3 font-medium text-gray-800 whitespace-nowrap">
                            {order.customerName || "Customer"}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <img
                                src={firstItem?.image || "/pizzahub-logo.png"}
                                alt={pizzaLabel}
                                className="h-6 w-6 rounded-full object-cover border border-gray-100 bg-gray-100 shrink-0"
                              />
                              <span className="font-medium text-gray-800 truncate max-w-[150px]">
                                {pizzaLabel}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold text-gray-900 whitespace-nowrap">
                            ${Number(order.totalAmount || 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <select
                              aria-label={`Change status for ${orderCode}`}
                              value={currentStatus}
                              disabled={updatingOrderId === order._id}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold outline-none cursor-pointer disabled:opacity-60 ${getStatusStyle(
                                currentStatus
                              )}`}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option
                                  key={opt}
                                  value={opt}
                                  className="bg-white text-gray-900"
                                >
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 pl-3 text-right text-xs text-gray-500 whitespace-nowrap">
                            {formatShortDate(order.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Promo Card with /pizzahub-banner.png */}
        <div className="xl:col-span-4 relative overflow-hidden rounded-2xl bg-[#7A090E] p-6 text-white shadow-sm flex flex-col justify-between min-h-[260px]">
          <img
            src="/pizzahub-banner.png"
            alt="Delicious Pizza Better Together"
            className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#8E0C12]/90 via-[#8E0C12]/65 to-transparent pointer-events-none"
          />

          <div className="relative z-10 max-w-[75%] space-y-2.5">
            <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
              Delicious Pizza
              <br />
              Better Together!
            </h3>
            <p className="text-xs sm:text-sm text-rose-100/95 leading-relaxed">
              Manage your orders, users and grow your business with Pizzahub.
            </p>
          </div>

          <div className="relative z-10 pt-5">
            <Link
              href="/dashboard/customer-orders"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#B41118] hover:bg-rose-50 transition shadow-xs"
            >
              <span>View Reports</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Link
            href="/dashboard/customer-orders"
            className="group rounded-2xl border border-rose-100 bg-[#FFF8F8] p-4 flex items-center justify-between gap-3 hover:border-rose-200 hover:shadow-2xs transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100/80 text-[#D91B24] shrink-0">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  Manage Orders
                </p>
                <p className="text-xs text-gray-500 truncate">
                  View &amp; update orders
                </p>
              </div>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D91B24] text-white group-hover:translate-x-0.5 transition shrink-0">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="group rounded-2xl border border-amber-100 bg-[#FFFBF4] p-4 flex items-center justify-between gap-3 hover:border-amber-200 hover:shadow-2xs transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/80 text-amber-600 shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  Manage Users
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Manage customer accounts
                </p>
              </div>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white group-hover:translate-x-0.5 transition shrink-0">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="group rounded-2xl border border-emerald-100 bg-[#F5FCF8] p-4 flex items-center justify-between gap-3 hover:border-emerald-200 hover:shadow-2xs transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-600 shrink-0">
                <Store className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  Manage Vendor
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Manage vendors
                </p>
              </div>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white group-hover:translate-x-0.5 transition shrink-0">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/browse-menu"
            className="group rounded-2xl border border-purple-100 bg-[#FAF7FF] p-4 flex items-center justify-between gap-3 hover:border-purple-200 hover:shadow-2xs transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100/80 text-purple-600 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  Vendor Menu Approval
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Approve vendor menus
                </p>
              </div>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white group-hover:translate-x-0.5 transition shrink-0">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}