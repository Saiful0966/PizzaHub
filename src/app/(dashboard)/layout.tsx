
'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/dashboardSidebar';
import { authClient } from '@/lib/auth-client';
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // সেশন থেকে লগইন করা ইউজারের তথ্য আনা হচ্ছে
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | { name?: string; email?: string; image?: string | null; role?: string }
    | undefined;

  // সেশন ডাটা না আসা পর্যন্ত লোডিং স্টেট
  const isLoadingSession = !user;

  // সেশন লোড হলে আসল রোল, না পেলে ফলব্যাক 'Customer'
  const userRole = user?.role || 'Customer';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FDF8F5] flex flex-col font-sans">
      {/* ছোট স্ক্রিনে সাইডবার খোলার বাটন */}
      <div className="md:hidden px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
        <span className="text-xs font-semibold text-gray-500">
          {isLoadingSession ? 'Loading...' : userRole}
        </span>
      </div>

      {/* বাম পাশে সাইডবার এবং ডান পাশে মেইন কন্টেন্ট */}
      <div className="flex-1 flex items-start">
        <DashboardSidebar
          role={userRole}
          userName={user?.name}
          userImage={user?.image}
          isLoadingSession={isLoadingSession}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ডান পাশের মেইন সেকশন যেখানে পেজের কন্টেন্ট স্ক্রল হবে */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto">
          <Toaster position="top-right" />
          {children}
        </main>
      </div>
    </div>
  );
}

