'use client';

import React from 'react';

interface Props {
  userName?: string;
}

export default function VendorDashboard({ userName }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-lg font-bold text-gray-900">Vendor Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">
          Welcome, {userName || 'Vendor'} — Manage menu items, customer orders, and subscription.
        </p>
      </div>

      {/* এখান থেকে Vendor-এর স্ট্যাট কার্ড / মেনু ও অর্ডার সেকশন ডিজাইন করবেন */}
    </div>
  );
}