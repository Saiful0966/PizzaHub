"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Eye,
  ListOrdered,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

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
  phone?: string;
  address?: string;
  paymentMethod?: string;
  items?: OrderItem[];
  totalAmount?: number;
  status?: string;
  createdAt?: string;
}

type FilterTab = "All Orders" | "Pending" | "Delivered";

const buildDynamicItemName = (
  item: OrderItem | undefined,
  order: OrderDoc,
  index: number
) => {
  const rawName = (item?.name || "").trim();
  if (rawName && !/^https?:\/\//i.test(rawName)) {
    return rawName;
  }

  const categoryText = (item?.category || "Pizza").trim();
  const shortId = String(order._id || "").slice(-2).toUpperCase();
  return `${categoryText} Order #${shortId || index + 1}`;
};

export default function CustomerOrdersPage() {
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "Customer";

  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("All Orders");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedOrderIds, setExpandedOrderIds] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    let isMounted = true;

    const fetchMyOrders = async () => {
      if (!userEmail) {
        if (isMounted) setLoading(false);
        return;
      }

      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const apiUrl = rawApiUrl.replace(/\/+$/, "");

      try {
        if (isMounted) setLoading(true);
        const res = await fetch(
          `${apiUrl}/orders?role=customer&email=${encodeURIComponent(userEmail)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          if (isMounted) setOrders([]);
          return;
        }

        const data = await res.json();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          setOrders(list);
          if (list.length > 0 && list[0]._id) {
            setExpandedOrderIds({ [list[0]._id]: true });
          }
        }
      } catch (err) {
        console.warn("Error fetching customer orders:", err);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMyOrders();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const toggleExpandOrder = (orderKey: string) => {
    setExpandedOrderIds((prev) => ({
      ...prev,
      [orderKey]: !prev[orderKey],
    }));
  };

  const getOrderCode = (order: OrderDoc, index: number) => {
    return `ORD-${String(order._id || index)
      .slice(-4)
      .toUpperCase()}`;
  };

 // Dynamic Tab Counts
  const tabCounts = useMemo(() => {
    const pendingCount = orders.filter((order) => {
      const normalizedStatus = (order.status || "Pending")
        .trim()
        .toLowerCase();
      return (
        normalizedStatus !== "delivered" &&
        normalizedStatus !== "cancelled" &&
        normalizedStatus !== "canceled"
      );
    }).length;

    const deliveredCount = orders.filter(
      (order) => (order.status || "").trim().toLowerCase() === "delivered"
    ).length;

    return {
      "All Orders": orders.length,
      Pending: pendingCount,
      Delivered: deliveredCount,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order, index) => {
      const normalizedStatus = (order.status || "Pending")
        .trim()
        .toLowerCase();

      if (activeTab === "Pending") {
        if (
          normalizedStatus === "delivered" ||
          normalizedStatus === "cancelled" ||
          normalizedStatus === "canceled"
        ) {
          return false;
        }
      } else if (activeTab === "Delivered") {
        if (normalizedStatus !== "delivered") return false;
      }

      const trimmedQuery = searchQuery.trim().toLowerCase();
      if (!trimmedQuery) return true;

      const orderCode = getOrderCode(order, index).toLowerCase();
      const rawId = String(order._id || "").toLowerCase();
      return orderCode.includes(trimmedQuery) || rawId.includes(trimmedQuery);
    });
  }, [orders, activeTab, searchQuery]);

  const formatDateTime = (dateStr?: string) => {
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

  const renderStatusBadge = (status?: string) => {
    const normalized = (status || "Pending").trim().toLowerCase();

    if (normalized === "delivered") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Delivered</span>
        </span>
      );
    }

    if (normalized === "accepted") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/80 px-3.5 py-1 text-xs font-semibold text-sky-700">
          <Check className="h-3.5 w-3.5" />
          <span>Accepted</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 px-3.5 py-1 text-xs font-semibold text-amber-700">
        <Clock className="h-3.5 w-3.5" />
        <span>Pending</span>
      </span>
    );
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
        <span className="text-[#D91B24] font-semibold">My Orders</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-[#D91B24] border border-rose-100 shrink-0">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track your pizza orders and check all details.
          </p>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                    ? "bg-[#D91B24] text-white border-[#D91B24] shadow-2xs"
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

        <div className="relative w-full lg:w-64">
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID..."
            className="w-full rounded-full border border-gray-200 bg-white pl-9 pr-4 py-2 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#D91B24] transition"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-500">
          Loading your orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center space-y-3">
          <p className="text-sm text-gray-500">
            No orders found matching your filter.
          </p>
          <Link
            href="/browse-menu"
            className="inline-flex items-center justify-center rounded-xl bg-[#D91B24] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b8151d] transition"
          >
            Order Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const serialNumber = index + 1;
            const orderKey = order._id || `order-${index}`;
            const isExpanded = !!expandedOrderIds[orderKey];
            const items = order.items || [];
            const firstItem = items[0];
            const extraCount = items.length - 1;
            const baseName = firstItem
              ? buildDynamicItemName(firstItem, order, index)
              : "Pizza Order";
            const itemTitle = `${baseName}${
              extraCount > 0 ? ` +${extraCount} more` : ""
            }`;
            const qty = firstItem?.quantity || 1;
            const unitPrice = Number(
              firstItem?.price ?? order.totalAmount ?? 0
            );
            const totalAmount = Number(
              order.totalAmount ?? unitPrice * qty
            );
            const bannerImage = firstItem?.image || "/pizzahub-logo.png";
            const thumbImage = firstItem?.image || "/pizzahub-logo.png";
            const orderCode = getOrderCode(order, index);

            return (
              <div
                key={orderKey}
                className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-2xs space-y-5"
              >
                {/* Top Summary Row */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {/* Side Serial Number  */}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-xs font-extrabold text-[#D91B24] border border-rose-100 shrink-0">
                      {serialNumber}
                    </span>

                    <img
                      src={bannerImage}
                      alt={itemTitle}
                      className="h-20 w-full sm:w-28 rounded-xl object-cover border border-gray-100 bg-gray-100 shrink-0"
                    />

                    <div className="min-w-0 pr-2">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                        Order #{orderCode}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{formatDateTime(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className="hidden sm:block h-10 w-px bg-gray-100 shrink-0" />

                    <div className="flex items-center justify-between sm:justify-start gap-4 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={thumbImage}
                          alt={itemTitle}
                          className="h-7 w-7 rounded-full object-cover border border-gray-100 shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                          {itemTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-xs sm:text-sm">
                        <span className="text-gray-500">× {qty}</span>
                        <span className="font-semibold text-gray-800">
                          ${unitPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="hidden xl:block h-10 w-px bg-gray-100 shrink-0" />

                    <div className="shrink-0">
                      <p className="text-xs text-gray-500">Total Amount:</p>
                      <p className="text-sm sm:text-base font-extrabold text-[#D91B24]">
                        ${totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Right Status View Details  Expand Arrow */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="flex flex-col items-end gap-2">
                      {renderStatusBadge(order.status)}
                      <button
                        type="button"
                        onClick={() => toggleExpandOrder(orderKey)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#D91B24] px-3.5 py-1.5 text-xs font-semibold text-[#D91B24] hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label={
                        isExpanded
                          ? "Collapse order details"
                          : "Expand order details"
                      }
                      onClick={() => toggleExpandOrder(orderKey)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-[#D91B24] hover:bg-rose-100 transition cursor-pointer shrink-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Section Customer Information & Cart  */}
                {isExpanded && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                    {/* Customer Information */}
                    <div className="rounded-2xl border border-rose-100/80 bg-[#FFF9F8] p-4 sm:p-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <User className="h-4 w-4 text-[#D91B24]" />
                        <span>Customer Information</span>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                        <div className="flex items-center gap-2.5">
                          <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="w-32 text-gray-500 shrink-0">
                            Name
                          </span>
                          <span className="text-gray-400">:</span>
                          <span className="font-medium text-gray-900 truncate">
                            {order.customerName || userName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="w-32 text-gray-500 shrink-0">
                            Email
                          </span>
                          <span className="text-gray-400">:</span>
                          <span className="font-medium text-gray-900 truncate">
                            {order.customerEmail || userEmail || "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="w-32 text-gray-500 shrink-0">
                            Address
                          </span>
                          <span className="text-gray-400">:</span>
                          <span className="font-medium text-gray-900">
                            {order.address || "Not provided"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="w-32 text-gray-500 shrink-0">
                            Number
                          </span>
                          <span className="text-gray-400">:</span>
                          <span className="font-medium text-gray-900">
                            {order.phone || "Not provided"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <CreditCard className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="w-32 text-gray-500 shrink-0">
                            Payment Method
                          </span>
                          <span className="text-gray-400">:</span>
                          <span className="font-semibold text-gray-900">
                            {order.paymentMethod || "Cash on Delivery"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="rounded-2xl border border-rose-100/80 bg-[#FFF9F8] p-4 sm:p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <ShoppingCart className="h-4 w-4 text-[#D91B24]" />
                          <span>Cart Summary</span>
                        </div>

                        <div className="divide-y divide-rose-100/70">
                          {(items.length > 0
                            ? items
                            : [
                                {
                                  name: itemTitle,
                                  price: unitPrice,
                                  quantity: qty,
                                  image: thumbImage,
                                },
                              ]
                          ).map((item, idx) => {
                            const lineName = buildDynamicItemName(
                              item,
                              order,
                              idx
                            );
                            const lineQty = item.quantity || 1;
                            const linePrice = Number(item.price || 0);
                            const lineTotal = linePrice * lineQty;

                            return (
                              <div
                                key={idx}
                                className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={item.image || thumbImage}
                                    alt={lineName}
                                    className="h-8 w-8 rounded-full object-cover border border-gray-100 shrink-0"
                                  />
                                  <span className="font-medium text-gray-800 truncate">
                                    {lineName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-6 shrink-0">
                                  <span className="text-gray-500">
                                    × {lineQty}
                                  </span>
                                  <span className="font-semibold text-gray-900">
                                    ${lineTotal.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="border-t border-rose-200/70 pt-3 space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span className="font-semibold text-gray-800">
                            ${totalAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="text-base font-extrabold text-[#D91B24]">
                            ${totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}