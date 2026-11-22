'use client';

import React from 'react';

interface Props {
  userName?: string;
}

export default function AdminDashboard({ userName }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">
          Welcome, {userName || 'Admin'} — Manage users, menu approvals, and transactions.
        </p>
      </div>

      

      {/* এখান থেকে Admin-এর স্ট্যাট কার্ড / টেবিল ডিজাইন করবেন */}
    </div>
  );
}