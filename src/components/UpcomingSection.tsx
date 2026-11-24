"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { addToCartStorage } from "@/lib/cart";

interface MenuItem {
  _id: string;
  title?: string;
  name?: string;
  category?: string;
  price?: number;
  description?: string;
  image?: string;
  createdAt?: string;
}

export default function UpcomingSection() {
  const router = useRouter();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  //  API 
  useEffect(() => {
    const fetchLatestItems = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/menuitems`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load menu items");
        }

        const rawData = await res.json();
        const list: MenuItem[] = Array.isArray(rawData)
          ? rawData
          : rawData?.data || [];

        
         // Reverse/Sort to Show Newly Added Items First Then Take the First 6
        const sortedByNewest = [...list].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          // New Items First
          return b._id.localeCompare(a._id);
        });

        setItems(sortedByNewest.slice(0, 6));
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Something went wrong!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLatestItems();
  }, []);

  // Add Item to Cart, Show Toast, and Redirect to /cart Page
  const handleAddToCart = (item: MenuItem) => {
    const itemTitle = item.title || item.name || "Menu Item";

    addToCartStorage(
      {
        _id: item._id,
        name: itemTitle,
        price: Number(item.price || 0),
        image: item.image,
      },
      1
    );

    toast.success("Add to Cart Successful");
    router.push("/cart");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header  Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D92323] bg-red-50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fresh From Kitchen</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Upcoming & Latest Menu
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Newly added items from our menu, updated live.
          </p>
        </div>

        <Link
          href="/browse-menu"
          className="text-sm font-semibold text-[#D92323] hover:underline shrink-0"
        >
          View All Menu →
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-xl mb-4" />
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-10 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 text-red-600 rounded-2xl p-6 text-center text-sm">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl p-8 text-center text-sm">
          No upcoming menu items available right now.
        </div>
      ) : (
      /* 6 Dynamic Card Grid 3 Cards per Row */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const itemTitle = item.title || item.name || "Delicious Item";

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Details Page link  */}
                  <Link href={`/browse-menu/${item._id}`} className="block">
                    <div className="h-48 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={item.image || "/placeholder-pizza.jpg"}
                        alt={itemTitle}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">

                      <Link
                        href={`/browse-menu/${item._id}`}
                        className="text-lg font-bold text-gray-900 hover:text-[#D92323] transition line-clamp-1"
                      >
                        {itemTitle}
                      </Link>

                      <span className="text-xs font-semibold bg-red-50 text-[#D92323] px-2.5 py-1 rounded-full shrink-0">
                        {item.category || "New"}
                      </span>
                    </div>

                    <p className="text-xl font-extrabold text-[#D92323] mt-2">
                      ${Number(item.price || 0).toFixed(2)}
                    </p>

                    {item.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="px-4 pb-4">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-[#D92323] hover:bg-[#b81d1d] text-white font-semibold py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}