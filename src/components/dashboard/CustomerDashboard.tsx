'use client';

import React from 'react';

interface Props {
  userName?: string;
}

export default function CustomerDashboard({ userName }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-lg font-bold text-gray-900">Customer Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">
          Welcome, {userName || 'Customer'} — Browse pizzas, track orders, and view favorites.
        </p>

        {/* এখন এই <h2> সঠিক কার্ডের ভেতরে আছে */}
        <h2 className="text-sm font-medium text-gray-700 mt-4">
          fjsadkjalksjflksjfklsajfklsjfskljfskjfsklf skfjskfjskslfjsklsjfskldf klsjfkslljfsklf
        </h2>
      </div>
    </div>
  );
}