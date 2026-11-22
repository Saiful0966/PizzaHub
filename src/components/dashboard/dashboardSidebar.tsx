


// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import {
//   LayoutDashboard,
//   ShoppingBag,
//   Heart,
//   UserCog,
//   PlusCircle,
//   Pizza,
//   Crown,
//   Users,
//   CheckSquare,
//   CreditCard,
//   Settings,
//   LogOut,
//   ChevronUp,
//   X,
// } from 'lucide-react';
// import { authClient } from '@/lib/auth-client';

// interface DashboardSidebarProps {
//   role: string;
//   userName?: string;
//   userImage?: string | null;
//   sidebarOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
// }

// const DashboardSidebar = ({
//   role,
//   userName = 'Guest User',
//   userImage,
//   sidebarOpen,
//   setSidebarOpen,
// }: DashboardSidebarProps) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);

//   const normalizedRole = (role || 'Customer').toLowerCase();

//   const handleLogout = async () => {
//     setProfileMenuOpen(false);
//     await authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           router.push('/signin');
//           router.refresh();
//         },
//       },
//     });
//   };

//   const customerMenus = [
//     { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//     { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
//     { label: 'Favorites', href: '/dashboard/favorites', icon: Heart },
//     { label: 'Profile Settings', href: '/dashboard/profile', icon: UserCog },
//   ];

//   const vendorMenus = [
//     { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//     { label: 'Add Menu Item', href: '/dashboard/add-pizza', icon: PlusCircle },
//     { label: 'My Menu', href: '/dashboard/pizzas', icon: Pizza },
//     { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
//     { label: 'Subscription', href: '/dashboard/subscription', icon: Crown },
//     { label: 'Profile', href: '/dashboard/profile', icon: UserCog },
//   ];

//   const adminMenus = [
//     { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//     { label: 'Manage Users', href: '/dashboard/users', icon: Users },
//     { label: 'Menu Approval', href: '/dashboard/approvals', icon: CheckSquare },
//     { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
//     { label: 'Settings', href: '/dashboard/settings', icon: Settings },
//   ];

//   const navItems =
//     normalizedRole === 'admin'
//       ? adminMenus
//       : normalizedRole === 'vendor'
//       ? vendorMenus
//       : customerMenus;

//   return (
//     <>
//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//         />
//       )}

//       <aside
//         className={`fixed md:sticky md:top-16 inset-y-0 left-0 z-30 w-60 h-screen md:h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
//         }`}
//       >
//         <div>
//           {/* Mobile Header */}
//           <div className="h-12 px-4 flex items-center justify-between border-b border-gray-100 md:hidden">
//             <span className="text-xs font-bold text-gray-500 uppercase">Menu</span>
//             <button
//               type="button"
//               onClick={() => setSidebarOpen(false)}
//               className="text-gray-500 hover:text-gray-800"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Role Menu List */}
//           <nav className="p-3 space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const active = pathname === item.href;

//               return (
//                 <Link
//                   key={item.label}
//                   href={item.href}
//                   onClick={() => setSidebarOpen(false)}
//                   className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
//                     active
//                       ? 'bg-[#D91B24] text-white shadow-sm'
//                       : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4 shrink-0" />
//                   <span>{item.label}</span>
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Bottom User Name + Role with Sign Out Dropdown */}
//         <div className="relative p-3 border-t border-gray-200 bg-gray-50/60">
//           {profileMenuOpen && (
//             <div className="mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5">
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
//               >
//                 <LogOut className="w-4 h-4 shrink-0" />
//                 <span>Sign Out</span>
//               </button>
//             </div>
//           )}

//           <button
//             type="button"
//             onClick={() => setProfileMenuOpen((prev) => !prev)}
//             className="w-full flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition text-left"
//           >
//             <div className="flex items-center gap-2.5 min-w-0">
//               {userImage ? (
//                 <img
//                   src={userImage}
//                   alt={userName}
//                   className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
//                 />
//               ) : (
//                 <div className="w-9 h-9 rounded-full bg-[#D91B24] text-white font-bold text-xs flex items-center justify-center shrink-0">
//                   {userName.charAt(0).toUpperCase()}
//                 </div>
//               )}

//               <div className="min-w-0 leading-tight">
//                 <p className="text-xs font-bold text-gray-900 truncate">{userName}</p>
//                 <p className="text-[11px] font-medium text-gray-500 truncate">
//                   {role || 'Customer'}
//                 </p>
//               </div>
//             </div>

//             <ChevronUp
//               className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
//                 profileMenuOpen ? 'rotate-180' : ''
//               }`}
//             />
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default DashboardSidebar;
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  UserCog,
  PlusCircle,
  Pizza,
  Crown,
  Users,
  CheckSquare,
  CreditCard,
  Settings,
  LogOut,
  ChevronUp,
  X,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

interface DashboardSidebarProps {
  role: string;
  userName?: string;
  userImage?: string | null;
  isLoadingSession?: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardSidebar = ({
  role,
  userName,
  userImage,
  isLoadingSession = false,
  sidebarOpen,
  setSidebarOpen,
}: DashboardSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const normalizedRole = (role || 'Customer').toLowerCase();
  const displayName = userName || 'User';

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
          router.refresh();
        },
      },
    });
  };

  const customerMenus = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Favorites', href: '/dashboard/favorites', icon: Heart },
    { label: 'Profile Settings', href: '/dashboard/profile', icon: UserCog },
  ];

  const vendorMenus = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Add Menu Item', href: '/dashboard/add-item', icon: PlusCircle },
    { label: 'My Menu', href: '/dashboard/my-menu', icon: Pizza },
    { label: 'Orders', href: '/dashboard/customer-orders', icon: ShoppingBag },
    { label: 'Subscription', href: '/dashboard/subscription', icon: Crown },
    { label: 'Profile', href: '/dashboard/my-profile', icon: UserCog },
  ];

  const adminMenus = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/dashboard/users', icon: Users },
    { label: 'Menu Approval', href: '/dashboard/menu-approvals', icon: CheckSquare },
    { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const navItems =
    normalizedRole === 'admin'
      ? adminMenus
      : normalizedRole === 'vendor'
      ? vendorMenus
      : customerMenus;

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky md:top-16 inset-y-0 left-0 z-30 w-60 h-screen md:h-[calc(100vh-4rem)] shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* মোবাইল সাইডবার বন্ধ করার বাটন */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-gray-100 md:hidden">
            <span className="text-xs font-bold text-gray-500 uppercase">Menu</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* সেশন লোড হওয়ার সময় মেনু ফ্ল্যাশ ঠেকাতে স্কেলিটন, না হলে সঠিক রোলের মেনু */}
          {isLoadingSession ? (
            <div className="p-3 space-y-2 animate-pulse">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-9 w-full rounded-lg bg-gray-100"
                />
              ))}
            </div>
          ) : (
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                      active
                        ? 'bg-[#D91B24] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* সাইডবারের নিচে ইউজার ছবি, নাম, রোল এবং Sign Out ড্রপডাউন */}
        <div className="relative p-3 border-t border-gray-200 bg-gray-50/60">
          {profileMenuOpen && (
            <div className="mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {isLoadingSession ? (
            <div className="flex items-center gap-2.5 p-1.5 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-2.5 w-14 bg-gray-200 rounded" />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#D91B24] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 leading-tight">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] font-medium text-gray-500 truncate">
                    {role || 'Customer'}
                  </p>
                </div>
              </div>

              <ChevronUp
                className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                  profileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;