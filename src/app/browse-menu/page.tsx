
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { addToCartStorage } from "@/lib/cart";

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image: string;
  createdAt?: string;
}

const CATEGORIES = ["All", "Pizza", "Sides", "Drinks", "Desserts"];

export default function BrowseMenuPage() {
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Search, Category, Sort, and Favorite State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load Menu Items from Backend API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/menuitems`);

        if (!res.ok) {
          throw new Error("Failed to load menu items");
        }

        const data: MenuItem[] = await res.json();
        setMenuItems(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Something went wrong!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filter List & Category, Search, and Sorting
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name-asc") {
      sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return sorted;
  }, [menuItems, searchQuery, selectedCategory, sortBy]);

  //  Favorite Item
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

 // Add Item to Cart, Show Toast, and Redirect to cart Page
  const handleAddToCart = (item: MenuItem) => {
    addToCartStorage(
      {
        _id: item._id,
        name: item.name || "Menu Item",
        price: Number(item.price || 0),
        image: item.image,
      },
      1
    );

    toast.success("Add to Cart Successful");

    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header page */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Your Favorite Pizza 🍕
          </h1>
          <p className="text-gray-500 mt-1">
            Find your favorite pizza from the best local restaurants.
          </p>
        </div>

        {/* Filter Bar: Search, Category, and Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-8">
          {/* Search*/}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pizza or restaurant..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-red-500"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-red-500 md:w-44"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Category" : cat}
              </option>
            ))}
          </select>

          {/* Sort  */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort menu items"
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-red-500 md:w-44"
          >
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

       {/* Loading / Error / Empty State / Menu Card Grid */}
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
                <div className="h-10 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 text-red-600 rounded-2xl p-6 text-center">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl p-10 text-center">
            No menu items found.
          </div>
        ) : (
          /* Menu Card  3 Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isFav = favorites.includes(item._id);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/*  Link to Details Page */}
                    <Link href={`/browse-menu/${item._id}`} className="block">
                      <div className="h-52 w-full bg-gray-100 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        {/* Title Link to Details Page */}
                        <Link
                          href={`/browse-menu/${item._id}`}
                          className="text-lg font-bold text-gray-900 hover:text-red-600 transition line-clamp-1"
                        >
                          {item.name}
                        </Link>

                       {/* // Favorite Button */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item._id)}
                          aria-label="Toggle favorite"
                          className="text-gray-400 hover:text-red-500 transition shrink-0"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isFav ? "fill-red-500 text-red-500" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* // Price and Category */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xl font-extrabold text-red-600">
                          ${Number(item.price || 0).toFixed(2)}
                        </span>
                        <span className="text-xs font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>

                     {/* Description */}
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-2.5 line-clamp-2">
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
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-2 transition cursor-pointer"
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
      </div>
    </div>
  );
}