// import React from 'react';

// const page = () => {
//     return (
//         <div>
//             <h1> admin dashboard  Page </h1>
//         </div>
//     );
// };

// export default page;

// 'use client';

// import React from 'react';
// import { authClient } from '@/lib/auth-client';

// export default function DashboardPage() {
//   // কারেন্ট ইউজারের সেশন আনা হচ্ছে
//   const { data: session } = authClient.useSession();
//   const user = session?.user as { name?: string; role?: string } | undefined;

//   // সেশন লোড না হওয়া পর্যন্ত লোডিং দেখাবে
//   if (!user) {
//     return (
//       <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
//         <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
//         <div className="h-3 w-64 bg-gray-100 rounded" />
//       </div>
//     );
//   }

//   // ইউজারের রোল বের করা হচ্ছে (যেমন: 'admin', 'vendor', 'customer')
//   const role = (user.role || 'customer').toLowerCase();

//   // ১. Admin হলে Admin Dashboard দেখাবে
//   if (role === 'admin') {
//     return (
//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
//         <p className="text-xs text-gray-500 mt-1">
//           Welcome, {user.name || 'Admin'} — Manage users, menu approvals, and transactions.
//         </p>
//       </div>
//     );
//   }

//   // ২. Vendor হলে Vendor Dashboard দেখাবে
//   if (role === 'vendor') {
//     return (
//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         <h1 className="text-lg font-bold text-gray-900">Vendor Dashboard</h1>
//         <p className="text-xs text-gray-500 mt-1">
//           Welcome, {user.name || 'Vendor'} — Manage menu items, customer orders, and subscription.
//         </p>
//       </div>
//     );
//   }

//   // ৩. Customer হলে Customer Dashboard দেখাবে
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <h1 className="text-lg font-bold text-gray-900">Customer Dashboard</h1>
//       <p className="text-xs text-gray-500 mt-1">
//         Welcome, {user.name || 'Customer'} — Browse pizzas, track orders, and view favorites.
//       </p>
//     </div>
//   );
// }







// 'use client';

// import React from 'react';
// import { authClient } from '@/lib/auth-client';
// import AdminDashboard from '@/components/dashboard/AdminDashboard';
// import VendorDashboard from '@/components/dashboard/VendorDashboard';
// import CustomerDashboard from '@/components/dashboard/CustomerDashboard';

// export default function DashboardPage() {
//   const { data: session } = authClient.useSession();
//   const user = session?.user as { name?: string; role?: string } | undefined;

//   if (!user) {
//     return (
//       <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
//         <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
//         <div className="h-3 w-64 bg-gray-100 rounded" />
//       </div>
//     );
//   }

//   const role = (user.role || 'customer').toLowerCase();

//   if (role === 'admin') {
//     return <AdminDashboard userName={user.name} />;
//   }

//   if (role === 'vendor') {
//     return <VendorDashboard userName={user.name} />;
//   }

//   return <CustomerDashboard userName={user.name} />;
// }



'use client';

import React from 'react';
import { authClient } from '@/lib/auth-client';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import VendorDashboard from '@/components/dashboard/VendorDashboard';
import CustomerDashboard from '@/components/dashboard/CustomerDashboard';

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as { name?: string; role?: string } | undefined;

  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-64 bg-gray-100 rounded" />
      </div>
    );
  }

  const role = (user.role || 'customer').toLowerCase();

  if (role === 'admin') {
    return <AdminDashboard userName={user.name} />;
  }

  if (role === 'vendor') {
    return <VendorDashboard userName={user.name} />;
  }

  return <CustomerDashboard userName={user.name} />;
}