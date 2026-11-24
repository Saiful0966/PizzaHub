
// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { Crown, DollarSign, ShoppingBag, UtensilsCrossed } from "lucide-react";
// import toast from "react-hot-toast";
// import { authClient } from "@/lib/auth-client";

// interface Props {
//   userName?: string;
// }

// interface OrderItem {
//   itemId?: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
// }

// interface OrderDoc {
//   _id: string;
//   customerName?: string;
//   customerEmail?: string;
//   phone?: string;
//   address?: string;
//   paymentMethod?: string;
//   items?: OrderItem[];
//   totalAmount?: number;
//   status?: string;
//   createdAt?: string;
// }

// const STATUS_OPTIONS = ["Pending", "Accepted", "Delivered"] as const;

// const FALLBACK_PIZZA_NAMES = [
//   "Cheese Burst Pizza",
//   "Spicy Peri-Peri Pizza",
//   "Margherita Pizza",
//   "Pepperoni Pizza",
//   "BBQ Chicken Pizza",
// ];

// export default function VendorDashboard({ userName }: Props) {
//   const { data: session } = authClient.useSession();

//   const [orders, setOrders] = useState<OrderDoc[]>([]);
//   const [menuCount, setMenuCount] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

//   const displayVendorName = userName || session?.user?.name || "Vendor";

//   useEffect(() => {
//     let isMounted = true;

//     const fetchVendorDashboardData = async () => {
//       const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
//       const apiUrl = rawApiUrl.replace(/\/+$/, "");

//       try {
//         if (isMounted) setLoading(true);

//         const [ordersRes, menuRes] = await Promise.all([
//           fetch(`${apiUrl}/orders?role=vendor`, { cache: "no-store" }),
//           fetch(`${apiUrl}/menuitems`, { cache: "no-store" }),
//         ]);

//         if (ordersRes.ok) {
//           const ordersData = await ordersRes.json();
//           if (isMounted) {
//             setOrders(Array.isArray(ordersData) ? ordersData : []);
//           }
//         }

//         if (menuRes.ok) {
//           const menuData = await menuRes.json();
//           if (Array.isArray(menuData) && isMounted) {
//             setMenuCount(menuData.length);
//           }
//         }
//       } catch (error) {
//         console.warn("Vendor dashboard fetch error:", error);
//         if (isMounted) setOrders([]);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchVendorDashboardData();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     const previousOrders = [...orders];

//     setOrders((prev) =>
//       prev.map((ord) =>
//         ord._id === orderId ? { ...ord, status: newStatus } : ord
//       )
//     );

//     try {
//       setUpdatingOrderId(orderId);
//       const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
//       const apiUrl = rawApiUrl.replace(/\/+$/, "");

//       const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to update status");
//       }

//       toast.success(`Order status updated to ${newStatus}`);
//     } catch (err) {
//       console.error(err);
//       setOrders(previousOrders);
//       toast.error("Could not update order status");
//     } finally {
//       setUpdatingOrderId(null);
//     }
//   };

//   const totalOrdersCount = orders.length;
//   const totalRevenue = orders.reduce(
//     (sum, order) => sum + Number(order.totalAmount || 0),
//     0
//   );

//   const getSelectColorClass = (status?: string) => {
//     const normalized = (status || "Pending").toLowerCase();
//     if (normalized === "delivered") {
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     }
//     if (normalized === "accepted") {
//       return "bg-sky-50 text-sky-700 border-sky-200";
//     }
//     return "bg-amber-50 text-amber-700 border-amber-200";
//   };

//   const formatDate = (dateStr?: string) => {
//     if (!dateStr) return "Just now";
//     const date = new Date(dateStr);
//     if (Number.isNaN(date.getTime())) return "Recent";
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
//           <span>Welcome back, {displayVendorName}!</span>
//           <span aria-hidden="true">👋</span>
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Here&apos;s your restaurant performance.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#D91B24] mb-4">
//             <ShoppingBag className="h-5 w-5" />
//           </div>
//           <p className="text-xs font-medium text-gray-500">Total Orders</p>
//           <p className="text-2xl font-extrabold text-gray-900 mt-1">
//             {loading ? "..." : totalOrdersCount}
//           </p>
//           <p className="text-xs font-semibold text-emerald-600 mt-1"> +12%  </p>
//         </div>

//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
//             <DollarSign className="h-5 w-5" />
//           </div>
//           <p className="text-xs font-medium text-gray-500">Total Revenue</p>
//           <p className="text-2xl font-extrabold text-gray-900 mt-1">
//             {loading ? "..." : `$${totalRevenue.toFixed(2)}`}
//           </p>
//           <p className="text-xs font-semibold text-emerald-600 mt-1">+8%</p>
//         </div>

//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 mb-4">
//             <UtensilsCrossed className="h-5 w-5" />
//           </div>
//           <p className="text-xs font-medium text-gray-500">Menu Items</p>
//           <p className="text-2xl font-extrabold text-gray-900 mt-1">
//             {loading ? "..." : menuCount}
//           </p>
//           <p className="text-xs font-semibold text-emerald-600 mt-1">+3%</p>
//         </div>

//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
//             <Crown className="h-5 w-5" />
//           </div>
//           <p className="text-xs font-medium text-gray-500">Active Plan</p>
//           <p className="text-xl font-extrabold text-emerald-600 mt-2">
//             Premium
//           </p>
//         </div>
//       </div>

//       <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
//           <Link
//             href="/dashboard/customer-orders"
//             className="text-sm font-semibold text-[#D91B24] hover:underline"
//           >
//             View All →
//           </Link>
//         </div>

//         {loading ? (
//           <div className="py-8 text-center text-sm text-gray-500">
//             Loading customer orders...
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="py-8 text-center text-sm text-gray-500">
//             No customer orders found yet.
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-100">
//             {orders.slice(0, 5).map((order, index) => {
//               const firstItem = order.items?.[0];
//               const extraCount = (order.items?.length || 1) - 1;
//               const rawItemName = (firstItem?.name || "").trim();
//               const cleanName =
//                 !rawItemName || /^https?:\/\//i.test(rawItemName)
//                   ? FALLBACK_PIZZA_NAMES[index % FALLBACK_PIZZA_NAMES.length]
//                   : rawItemName;

//               const displayTitle = firstItem
//                 ? `${cleanName}${extraCount > 0 ? ` +${extraCount} more` : ""}`
//                 : "Pizza Order";
//               const displayImage = firstItem?.image || "";
//               const shortOrderId = `#ORD-${String(order._id || index)
//                 .slice(-4)
//                 .toUpperCase()}`;
//               const statusText = order.status || "Pending";
//               const customerLabel = order.customerName || "Customer";

//               const currentStatus =
//                 STATUS_OPTIONS.find(
//                   (opt) =>
//                     opt.toLowerCase() ===
//                     String(statusText).trim().toLowerCase()
//                 ) || "Pending";

//               return (
//                 <div
//                   key={order._id || index}
//                   className="py-4 flex flex-wrap items-center justify-between gap-4 text-sm"
//                 >
//                   <div className="flex items-center gap-4 min-w-0">
//                     <span className="text-xs font-medium text-gray-400 w-20 shrink-0">
//                       {shortOrderId}
//                     </span>

//                     <img
//                       src={displayImage}
//                       alt={displayTitle}
//                       className="h-9 w-9 rounded-full object-cover bg-gray-100 shrink-0"
//                     />

//                     <div className="min-w-0">
//                       <p className="font-semibold text-gray-800 truncate">
//                         {customerLabel}
//                       </p>
//                       <p className="text-xs text-gray-500 truncate">
//                         {displayTitle}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-5 shrink-0">
//                     <span className="font-bold text-gray-900">
//                       ${Number(order.totalAmount || 0).toFixed(2)}
//                     </span>

//                     <select
//                       aria-label={`Order status for ${customerLabel}`}
//                       value={currentStatus}
//                       disabled={updatingOrderId === order._id}
//                       onChange={(e) =>
//                         handleStatusChange(order._id, e.target.value)
//                       }
//                       className={`rounded-full border px-3 py-1 text-xs font-semibold outline-none transition cursor-pointer disabled:opacity-60 ${getSelectColorClass(
//                         currentStatus
//                       )}`}
//                     >
//                       {STATUS_OPTIONS.map((option) => (
//                         <option
//                           key={option}
//                           value={option}
//                           className="bg-white text-gray-900"
//                         >
//                           {option}
//                         </option>
//                       ))}
//                     </select>

//                     <span className="text-xs text-gray-400 min-w-20 text-right">
//                       {formatDate(order.createdAt)}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }







"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, DollarSign, ShoppingBag, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface Props {
  userName?: string;
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
  phone?: string;
  address?: string;
  paymentMethod?: string;
  items?: OrderItem[];
  totalAmount?: number;
  status?: string;
  createdAt?: string;
}

const STATUS_OPTIONS = ["Pending", "Accepted", "Delivered"] as const;

const buildDynamicTitle = (
  item: OrderItem | undefined,
  order: OrderDoc,
  index: number
) => {
  const rawName = (item?.name || "").trim();
  if (rawName && !/^https?:\/\//i.test(rawName)) {
    return rawName;
  }

  const categoryLabel = (item?.category || "Pizza").trim();
  const priceTag =
    typeof item?.price === "number" && !Number.isNaN(item.price)
      ? ` ($${item.price.toFixed(0)})`
      : "";
  const idSuffix = String(order._id || "").slice(-2).toUpperCase();
  const itemNo = idSuffix || String(index + 1);

  return `${categoryLabel} #${itemNo}${priceTag}`;
};

export default function VendorDashboard({ userName }: Props) {
  const { data: session } = authClient.useSession();

  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [menuCount, setMenuCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const displayVendorName = userName || session?.user?.name || "Vendor";

  useEffect(() => {
    let isMounted = true;

    const fetchVendorDashboardData = async () => {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const apiUrl = rawApiUrl.replace(/\/+$/, "");

      try {
        if (isMounted) setLoading(true);

        const [ordersRes, menuRes] = await Promise.all([
          fetch(`${apiUrl}/orders?role=vendor`, { cache: "no-store" }),
          fetch(`${apiUrl}/menuitems`, { cache: "no-store" }),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (isMounted) {
            setOrders(Array.isArray(ordersData) ? ordersData : []);
          }
        }

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          if (Array.isArray(menuData) && isMounted) {
            setMenuCount(menuData.length);
          }
        }
      } catch (error) {
        console.warn("Vendor dashboard fetch error:", error);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVendorDashboardData();

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

    try {
      setUpdatingOrderId(orderId);
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const apiUrl = rawApiUrl.replace(/\/+$/, "");

      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      setOrders(previousOrders);
      toast.error("Could not update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const getSelectColorClass = (status?: string) => {
    const normalized = (status || "Pending").toLowerCase();
    if (normalized === "delivered") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (normalized === "accepted") {
      return "bg-sky-50 text-sky-700 border-sky-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "Recent";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span>Welcome back, {displayVendorName}!</span>
          <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s your restaurant performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#D91B24] mb-4">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-500">Total Orders</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">
            {loading ? "..." : totalOrdersCount}
          </p>
          <p className="text-xs font-semibold text-emerald-600 mt-1"> +12%  </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
            <DollarSign className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">
            {loading ? "..." : `$${totalRevenue.toFixed(2)}`}
          </p>
          <p className="text-xs font-semibold text-emerald-600 mt-1">+8%</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 mb-4">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-500">Menu Items</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">
            {loading ? "..." : menuCount}
          </p>
          <p className="text-xs font-semibold text-emerald-600 mt-1">+3%</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
            <Crown className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-500">Active Plan</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-2">
            Premium
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/dashboard/customer-orders"
            className="text-sm font-semibold text-[#D91B24] hover:underline"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading customer orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No customer orders found yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((order, index) => {
              const firstItem = order.items?.[0];
              const extraCount = (order.items?.length || 1) - 1;
              const baseTitle = firstItem
                ? buildDynamicTitle(firstItem, order, index)
                : "Pizza Order";

              const displayTitle = firstItem
                ? `${baseTitle}${extraCount > 0 ? ` +${extraCount} more` : ""}`
                : "Pizza Order";
              const displayImage = firstItem?.image || "";
              const shortOrderId = `#ORD-${String(order._id || index)
                .slice(-4)
                .toUpperCase()}`;
              const statusText = order.status || "Pending";
              const customerLabel = order.customerName || "Customer";

              const currentStatus =
                STATUS_OPTIONS.find(
                  (opt) =>
                    opt.toLowerCase() ===
                    String(statusText).trim().toLowerCase()
                ) || "Pending";

              return (
                <div
                  key={order._id || index}
                  className="py-4 flex flex-wrap items-center justify-between gap-4 text-sm"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xs font-medium text-gray-400 w-20 shrink-0">
                      {shortOrderId}
                    </span>

                    <img
                      src={displayImage}
                      alt={displayTitle}
                      className="h-9 w-9 rounded-full object-cover bg-gray-100 shrink-0"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {customerLabel}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {displayTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0">
                    <span className="font-bold text-gray-900">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </span>

                    <select
                      aria-label={`Order status for ${customerLabel}`}
                      value={currentStatus}
                      disabled={updatingOrderId === order._id}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`rounded-full border px-3 py-1 text-xs font-semibold outline-none transition cursor-pointer disabled:opacity-60 ${getSelectColorClass(
                        currentStatus
                      )}`}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-white text-gray-900"
                        >
                          {option}
                        </option>
                      ))}
                    </select>

                    <span className="text-xs text-gray-400 min-w-20 text-right">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}