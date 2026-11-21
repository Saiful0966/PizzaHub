
'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/dashboardSidebar';
import { authClient } from '@/lib/auth-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user as
    | { name?: string; email?: string; image?: string | null; role?: string }
    | undefined;

  const userRole = user?.role || 'Customer';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FDF8F5] flex flex-col font-sans">
      {/* Mobile Sidebar Open Button */}
      <div className="md:hidden px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
        <span className="text-xs font-semibold text-gray-500">{userRole}</span>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex-1 flex items-stretch min-h-0">
        <DashboardSidebar
          role={userRole}
          userName={user?.name || 'Guest User'}
          userImage={user?.image}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}