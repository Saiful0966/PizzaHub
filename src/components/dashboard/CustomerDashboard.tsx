
// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { ClipboardList, Clock, CheckCircle2, Wallet } from "lucide-react";
// import { authClient } from "@/lib/auth-client";

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
//   address?: string;
//   phone?: string;
//   paymentMethod?: string;
//   items?: OrderItem[];
//   totalAmount?: number;
//   status?: string;
//   createdAt?: string;
// }

// export default function CustomerDashboardOverview() {
//   const { data: session } = authClient.useSession();
//   const [orders, setOrders] = useState<OrderDoc[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const userName = session?.user?.name || "Customer";
//   const userEmail = session?.user?.email || "";

//   useEffect(() => {
//     const fetchCustomerOrders = async () => {
//       if (!userEmail) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//         const res = await fetch(
//           `${apiUrl}/orders?role=customer&email=${encodeURIComponent(userEmail)}`,
//           { cache: "no-store" }
//         );

//         if (!res.ok) {
//           throw new Error("Failed to fetch orders");
//         }

//         const data = await res.json();
//         setOrders(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching customer orders:", error);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomerOrders();
//   }, [userEmail]);

  
//   // Summary Card Calculations

//   const totalOrdersCount = orders.length;
//   const activeOrdersCount = orders.filter((order) => {
//     const st = (order.status || "pending").toLowerCase();
//     return st !== "delivered" && st !== "cancelled" && st !== "canceled";
//   }).length;

//   const deliveredOrdersCount = orders.filter(
//     (order) => (order.status || "").trim().toLowerCase() === "delivered"
//   ).length;

//   const totalSpentAmount = orders.reduce(
//     (sum, order) => sum + Number(order.totalAmount || 0),
//     0
//   );

//   /// Status Badge Styling

//   const getStatusBadgeClass = (status?: string) => {
//     const normalized = (status || "pending").toLowerCase();
//     if (normalized === "delivered") {
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     }
//     if (normalized === "cancelled" || normalized === "canceled") {
//       return "bg-rose-50 text-rose-700 border-rose-200";
//     }
//     if (normalized === "preparing") {
//       return "bg-blue-50 text-blue-700 border-blue-200";
//     }
//     return "bg-amber-50 text-amber-700 border-amber-200";
//   };

//  // Date Formatting 
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
//      {/* Header */}
//       <div>
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
//           <span>Welcome back, {userName}!</span>
//           <span aria-hidden="true">👋</span>
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Here&apos;s what&apos;s happening with your orders.
//         </p>
//       </div>

//       {/* 4  Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#D91B24] mb-4">
//             <ClipboardList className="h-5 w-5" />
//           </div>
//           <p className="text-xs font-medium text-gray-500">Total Orders</p>
//           <p className="text-2xl font-extrabold text-gray-900 mt-1">
//             {loading ? "..." : totalOrdersCount}
//           </p>
//         </div>

//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-4">
//             <Clock className="h-5 w-5" />
//           </div>
//           <p className="text-xs font-medium text-gray-500">Active Orders</p>
//           <p className="text-2xl font-extrabold text-gray-900 mt-1">
//             {loading ? "..." : activeOrdersCount}
//           </p>
//         </div>

//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
//             <CheckCircle2 className="h-5 w-5" />
//           </div>
//           <p className="text-xs font-medium text-gray-500">Delivered</p>
//           <p className="text-2xl font-extrabold text-gray-900 mt-1">
//             {loading ? "..." : deliveredOrdersCount}
//           </p>
//         </div>

//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
//             <Wallet className="h-5 w-5" />
//           </div>
//           <p className="text-xs font-medium text-gray-500">Total Spent</p>
//           <p className="text-2xl font-extrabold text-gray-900 mt-1">
//             {loading ? "..." : `$${totalSpentAmount.toFixed(2)}`}
//           </p>
//         </div>
//       </div>

//       {/* Recent Orders */}
//       <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
//           <Link
//             href="/dashboard/orders"
//             className="text-sm font-semibold text-[#D91B24] hover:underline"
//           >
//             View All →
//           </Link>
//         </div>

//         {loading ? (
//           <div className="py-8 text-center text-sm text-gray-500">
//             Loading your orders...
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="py-8 text-center">
//             <p className="text-sm text-gray-500 mb-3">
//               You haven&apos;t placed any orders yet.
//             </p>
//             <Link
//               href="/browse-menu"
//               className="inline-flex items-center justify-center rounded-xl bg-[#D91B24] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b8151d] transition"
//             >
//               Order Now
//             </Link>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-100">
//             {orders.slice(0, 5).map((order, index) => {
//               const firstItem = order.items?.[0];
//               const extraCount = (order.items?.length || 1) - 1;
//               const displayTitle = firstItem
//                 ? `${firstItem.name}${extraCount > 0 ? ` +${extraCount} more` : ""}`
//                 : "Pizza Order";
//               const displayImage = firstItem?.image || "/pizzahub-logo.png";
//               const shortOrderId = `#ORD-${String(order._id || index).slice(-4).toUpperCase()}`;
//               const statusText = order.status || "Pending";

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
//                     <span className="font-semibold text-gray-800 truncate">
//                       {displayTitle}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-5 shrink-0">
//                     <span className="font-bold text-gray-900">
//                       ${Number(order.totalAmount || 0).toFixed(2)}
//                     </span>

//                     <span
//                       className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(
//                         statusText
//                       )}`}
//                     >
//                       {statusText}
//                     </span>

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
import { ClipboardList, Clock, CheckCircle2, Wallet } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Props {
  userName?: string;
}

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
  address?: string;
  phone?: string;
  paymentMethod?: string;
  items?: OrderItem[];
  totalAmount?: number;
  status?: string;
  createdAt?: string;
}

export default function CustomerDashboardOverview({ userName }: Props) {
  const { data: session } = authClient.useSession();
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const displayUserName = userName || session?.user?.name || "Customer";
  const userEmail = session?.user?.email || "";

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const apiUrl = rawApiUrl.replace(/\/+$/, "");
        const res = await fetch(
          `${apiUrl}/orders?role=customer&email=${encodeURIComponent(userEmail)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching customer orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerOrders();
  }, [userEmail]);

  // Summary Card Calculations
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((order) => {
    const st = (order.status || "pending").toLowerCase();
    return st !== "delivered" && st !== "cancelled" && st !== "canceled";
  }).length;

  const deliveredOrdersCount = orders.filter(
    (order) => (order.status || "").trim().toLowerCase() === "delivered"
  ).length;

  const totalSpentAmount = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  // Status Badge Styling
  const getStatusBadgeClass = (status?: string) => {
    const normalized = (status || "pending").toLowerCase();
    if (normalized === "delivered") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (normalized === "cancelled" || normalized === "canceled") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (normalized === "preparing") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  // Date Formatting
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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span>Welcome back, {displayUserName}!</span>
          <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your orders.
        </p>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#D91B24] mb-4">
            <ClipboardList className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-500">Total Orders</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">
            {loading ? "..." : totalOrdersCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-4">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-500">Active Orders</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">
            {loading ? "..." : activeOrdersCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-500">Delivered</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">
            {loading ? "..." : deliveredOrdersCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-500">Total Spent</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">
            {loading ? "..." : `$${totalSpentAmount.toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm font-semibold text-[#D91B24] hover:underline"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500 mb-3">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/browse-menu"
              className="inline-flex items-center justify-center rounded-xl bg-[#D91B24] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b8151d] transition"
            >
              Order Now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((order, index) => {
              const firstItem = order.items?.[0];
              const extraCount = (order.items?.length || 1) - 1;
              const displayTitle = firstItem
                ? `${firstItem.name}${extraCount > 0 ? ` +${extraCount} more` : ""}`
                : "Pizza Order";
              const displayImage = firstItem?.image || "/pizzahub-logo.png";
              const shortOrderId = `#ORD-${String(order._id || index).slice(-4).toUpperCase()}`;
              const statusText = order.status || "Pending";

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
                    <span className="font-semibold text-gray-800 truncate">
                      {displayTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-5 shrink-0">
                    <span className="font-bold text-gray-900">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </span>

                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(
                        statusText
                      )}`}
                    >
                      {statusText}
                    </span>

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