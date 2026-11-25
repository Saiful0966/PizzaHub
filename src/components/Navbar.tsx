// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";

// import { getCartItems, getCartTotalCount } from "@/lib/cart";

// export interface NavbarUser {
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
// }

// interface NavbarProps {
//   user?: NavbarUser | null;
//   cartCount?: number;
//   onLogout?: () => void | Promise<void>;
// }

// const Navbar: React.FC<NavbarProps> = ({
//   user = null,
//   cartCount = 0,
//   onLogout,
// }) => {
//   const router = useRouter();
//   const { data: session, isPending } = authClient.useSession();

//   const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   const currentUser = user ?? session?.user ?? null;
//   const isLoggedIn = Boolean(currentUser);

//   const getInitial = (nameOrEmail?: string | null): string => {
//     const source = (nameOrEmail || "U").trim();
//     return source.charAt(0).toUpperCase() || "U";
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogoutClick = async () => {
//     setIsDropdownOpen(false);
//     if (onLogout) {
//       await onLogout();
//       return;
//     }
//     await authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           router.push("/signin");
//           router.refresh();
//         },
//       },
//     });
//   };


//   const pathname = usePathname();

//   return (
//     <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo & Name */}
//           <div className="flex items-center">
//             <Link href="/" className="flex items-center gap-2 shrink-0">
//               <img
//                 src="/pizzahub-logo.png"
//                 alt="PizzaHub Logo"
//                 className="h-12 w-12 object-contain rounded-full"
//               />
//               <span className="text-xl font-extrabold tracking-tight text-gray-900">
//                 Pizza<span className="text-[#D92323]">Hub</span>
//               </span>
//             </Link>
//           </div>

//           {/* Menu Links */}
//           <div className="hidden md:flex items-center justify-center gap-8 flex-1">
//             <Link
//               href="/"
//               className={`text-sm transition-colors ${
//                 pathname === "/"
//                   ? "font-semibold text-[#D92323]"
//                   : "font-medium text-gray-600 hover:text-[#D92323]"
//               }`}
//             >
//               Home
//             </Link>
//             <Link
//               href="/browse-menu"
//               className={`text-sm transition-colors ${
//                 pathname.startsWith("/browse-menu")
//                   ? "font-semibold text-[#D92323]"
//                   : "font-medium text-gray-600 hover:text-[#D92323]"
//               }`}
//             >
//               Browse Menu
//             </Link>
//           </div>

//           {/* Right Section Auth Buttons OR Cart + Profile Dropdown */}
//           <div className="hidden md:flex items-center gap-5">
//             {isPending && !user ? (
//               <div className="h-9 w-28 rounded-full bg-gray-100 animate-pulse" />
//             ) : isLoggedIn && currentUser ? (
//               <>
//                 {/* Cart Icon  */}
//                 <Link
//                   href="/cart"
//                   className="relative p-2 text-gray-700 hover:text-[#D92323] hover:bg-red-50 rounded-full transition-colors"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                     />
//                   </svg>
//                   {cartCount > 0 && (
//                     <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#D92323] rounded-full">
//                       {cartCount}
//                     </span>
//                   )}
//                 </Link>

//                 {/* Profile Dropdown */}
//                 <div className="relative" ref={dropdownRef}>
//                   <button
//                     type="button"
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="flex items-center gap-2.5 p-1 pr-3 rounded-full border border-gray-200 hover:border-[#D92323]/40 hover:bg-gray-50 transition-all focus:outline-none"
//                   >
//                     {currentUser.image ? (
//                       <img
//                         src={currentUser.image}
//                         alt={currentUser.name || "User"}
//                         className="w-8 h-8 rounded-full object-cover border border-gray-200"
//                       />
//                     ) : (
//                       <span className="w-8 h-8 rounded-full bg-[#D92323] text-white text-sm font-bold flex items-center justify-center shrink-0">
//                         {getInitial(currentUser.name || currentUser.email)}
//                       </span>
//                     )}

//                     <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
//                       {currentUser.name || currentUser.email}
//                     </span>

//                     <svg
//                       className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>

//                   {/* Dropdown Menu */}
//                   {isDropdownOpen && (
//                     <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
//                       {/* User Info Header */}
//                       <div className="px-4 py-2.5 border-b border-gray-100">
//                         <p className="text-sm font-semibold text-gray-900 truncate">
//                           {currentUser.name || "User"}
//                         </p>
//                         {currentUser.email && (
//                           <p className="text-xs text-gray-500 truncate">
//                             {currentUser.email}
//                           </p>
//                         )}
//                       </div>

//                       {/* Menu Items */}
//                       <div className="py-1">
//                         <Link
//                           href="/dashboard"
//                           onClick={() => setIsDropdownOpen(false)}
//                           className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#D92323] transition-colors"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
//                             />
//                           </svg>
//                           Dashboard
//                         </Link>

//                         <Link
//                           href="/profile-settings"
//                           onClick={() => setIsDropdownOpen(false)}
//                           className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#D92323] transition-colors"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                             />
//                           </svg>
//                           Profile Settings
//                         </Link>
//                       </div>

//                       {/* Logout */}
//                       <div className="border-t border-gray-100 pt-1">
//                         <button
//                           type="button"
//                           onClick={handleLogoutClick}
//                           className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                             />
//                           </svg>
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/signin"
//                   className="text-sm font-semibold text-gray-700 hover:text-[#D92323] px-3 py-2 transition-colors"
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   href="/signup"
//                   className="text-sm font-semibold text-white bg-[#D92323] hover:bg-[#b81d1d] px-5 py-2.5 rounded-lg shadow-sm transition-all"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile Hamburger & Cart */}
//           <div className="flex md:hidden items-center gap-2">
//             {isLoggedIn && (
//               <Link href="/cart" className="relative p-1.5 text-gray-700">
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                   />
//                 </svg>
//                 {cartCount > 0 && (
//                   <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#D92323] rounded-full">
//                     {cartCount}
//                   </span>
//                 )}
//               </Link>
//             )}
//             <button
//               type="button"
//               className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 ></path>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


















"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getCartItems, getCartTotalCount } from "@/lib/cart";

export interface NavbarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface NavbarProps {
  user?: NavbarUser | null;
  cartCount?: number;
  onLogout?: () => void | Promise<void>;
}

const Navbar: React.FC<NavbarProps> = ({
  user = null,
  cartCount: initialCartCount,
  onLogout,
}) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(initialCartCount ?? 0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentUser = user ?? session?.user ?? null;
  const isLoggedIn = Boolean(currentUser);

  useEffect(() => {
    const syncCartCount = () => {
      setCartCount(getCartTotalCount(getCartItems()));
    };

    syncCartCount();
    window.addEventListener("cart-updated", syncCartCount);
    window.addEventListener("storage", syncCartCount);

    return () => {
      window.removeEventListener("cart-updated", syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  const getInitial = (nameOrEmail?: string | null): string => {
    const source = (nameOrEmail || "U").trim();
    return source.charAt(0).toUpperCase() || "U";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = async () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      await onLogout();
      return;
    }
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };

  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/pizzahub-logo.png"
                alt="PizzaHub Logo"
                className="h-12 w-12 object-contain rounded-full"
              />
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Pizza<span className="text-[#D92323]">Hub</span>
              </span>
            </Link>
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex items-center justify-center gap-8 flex-1">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                pathname === "/"
                  ? "font-semibold text-[#D92323]"
                  : "font-medium text-gray-600 hover:text-[#D92323]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/browse-menu"
              className={`text-sm transition-colors ${
                pathname.startsWith("/browse-menu")
                  ? "font-semibold text-[#D92323]"
                  : "font-medium text-gray-600 hover:text-[#D92323]"
              }`}
            >
              Browse Menu
            </Link>
          </div>

          {/* Right Section Auth Buttons OR Cart + Profile Dropdown */}
          <div className="hidden md:flex items-center gap-5">
            {isPending && !user ? (
              <div className="h-9 w-28 rounded-full bg-gray-100 animate-pulse" />
            ) : isLoggedIn && currentUser ? (
              <>
                {/* Cart Icon */}
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-700 hover:text-[#D92323] hover:bg-red-50 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-[#D92323] rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 p-1 pr-3 rounded-full border border-gray-200 hover:border-[#D92323]/40 hover:bg-gray-50 transition-all focus:outline-none"
                  >
                    {currentUser.image ? (
                      <img
                        src={currentUser.image}
                        alt={currentUser.name || "User"}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-[#D92323] text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {getInitial(currentUser.name || currentUser.email)}
                      </span>
                    )}

                    <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
                      {currentUser.name || currentUser.email}
                    </span>

                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {currentUser.name || "User"}
                        </p>
                        {currentUser.email && (
                          <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                          </p>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#D92323] transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                          </svg>
                          Dashboard
                        </Link>

                        <Link
                          href="/dashboard/my-profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#D92323] transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile Settings
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogoutClick}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-sm font-semibold text-gray-700 hover:text-[#D92323] px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold text-white bg-[#D92323] hover:bg-[#b81d1d] px-5 py-2.5 rounded-lg shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger & Cart */}
          <div className="flex md:hidden items-center gap-2">
            {isLoggedIn && (
              <Link href="/cart" className="relative p-1.5 text-gray-700">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-[#D92323] rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;