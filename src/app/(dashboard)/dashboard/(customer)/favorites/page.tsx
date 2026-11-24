"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Heart,
  ShoppingCart,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface FavoriteItem {
  _id?: string;
  id?: string;
  itemId?: string;
  name?: string;
  title?: string;
  category?: string;
  price?: number;
  oldPrice?: number;
  rating?: number;
  reviewsCount?: number;
  deliveryTime?: string;
  deliveryText?: string;
  image?: string;
}

const LOCAL_FAVORITES_KEY = "pizzahub_favorites";
const LOCAL_CART_KEY = "pizzahub_cart";

const buildDynamicPizzaTitle = (item: FavoriteItem, index: number) => {
  const rawTitle = (item.title || item.name || "").trim();
  if (rawTitle && !/^https?:\/\//i.test(rawTitle)) {
    return rawTitle;
  }

  const category = (item.category || "Pizza").trim();
  const pricePart =
    typeof item.price === "number" && !Number.isNaN(item.price)
      ? ` ($${item.price.toFixed(0)})`
      : "";
  const idPart = String(item._id || item.itemId || item.id || index + 1)
    .slice(-2)
    .toUpperCase();

  return `${category} #${idPart}${pricePart}`;
};

export default function FavoritesPage() {
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email || "";

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [clearingAll, setClearingAll] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadFavorites = async () => {
      try {
        if (isMounted) setLoading(true);

        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const apiUrl = rawApiUrl.replace(/\/+$/, "");

        if (apiUrl) {
          const query = userEmail
            ? `?email=${encodeURIComponent(userEmail)}`
            : "";
          const res = await fetch(`${apiUrl}/favorites${query}`, {
            cache: "no-store",
          });

          if (res.ok) {
            const data = await res.json();
            const list = Array.isArray(data)
              ? data
              : Array.isArray(data?.favorites)
              ? data.favorites
              : [];

            if (list.length > 0) {
              if (isMounted) {
                setFavorites(list);
                setLoading(false);
              }
              return;
            }
          }
        }

        if (typeof window !== "undefined") {
          const savedRaw = localStorage.getItem(LOCAL_FAVORITES_KEY);
          if (savedRaw) {
            const parsed = JSON.parse(savedRaw);
            if (Array.isArray(parsed) && isMounted) {
              setFavorites(parsed);
            }
          } else if (isMounted) {
            setFavorites([]);
          }
        }
      } catch (err) {
        console.warn("Error loading favorites:", err);
        if (typeof window !== "undefined" && isMounted) {
          try {
            const savedRaw = localStorage.getItem(LOCAL_FAVORITES_KEY);
            const parsed = savedRaw ? JSON.parse(savedRaw) : [];
            setFavorites(Array.isArray(parsed) ? parsed : []);
          } catch {
            setFavorites([]);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const syncLocalStorage = (updatedList: FavoriteItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(updatedList));
    }
  };

  const handleRemoveFavorite = async (item: FavoriteItem, index: number) => {
    const targetId = item._id || item.itemId || item.id;
    const previousFavorites = [...favorites];

    const updatedFavorites = favorites.filter((fav, idx) => {
      const favId = fav._id || fav.itemId || fav.id;
      if (targetId && favId) {
        return String(favId) !== String(targetId);
      }
      return idx !== index;
    });

    setFavorites(updatedFavorites);
    syncLocalStorage(updatedFavorites);
    toast.success("Removed from favorites");

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = rawApiUrl.replace(/\/+$/, "");

    if (apiUrl && targetId) {
      try {
        await fetch(
          `${apiUrl}/favorites/${encodeURIComponent(String(targetId))}${
            userEmail ? `?email=${encodeURIComponent(userEmail)}` : ""
          }`,
          { method: "DELETE" }
        );
      } catch (err) {
        console.warn("Remove favorite API warning:", err);
        setFavorites(previousFavorites);
        syncLocalStorage(previousFavorites);
      }
    }
  };

  const handleClearAllFavorites = async () => {
    if (favorites.length === 0) return;

    const previousFavorites = [...favorites];
    setClearingAll(true);
    setFavorites([]);
    syncLocalStorage([]);
    toast.success("Cleared all favorites");

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = rawApiUrl.replace(/\/+$/, "");

    if (apiUrl) {
      try {
        await fetch(
          `${apiUrl}/favorites${
            userEmail ? `?email=${encodeURIComponent(userEmail)}` : ""
          }`,
          { method: "DELETE" }
        );
      } catch (err) {
        console.warn("Clear favorites API warning:", err);
        setFavorites(previousFavorites);
        syncLocalStorage(previousFavorites);
      } finally {
        setClearingAll(false);
      }
    } else {
      setClearingAll(false);
    }
  };

  const handleAddToCart = (item: FavoriteItem, index: number) => {
    const title = buildDynamicPizzaTitle(item, index);
    const price = Number(item.price || 12.99);
    const itemKey = item._id || item.itemId || item.id || `fav-${index}`;

    if (typeof window !== "undefined") {
      try {
        const existingRaw = localStorage.getItem(LOCAL_CART_KEY);
        const existingCart: Array<{
          id: string;
          name: string;
          price: number;
          quantity: number;
          image?: string;
        }> = existingRaw ? JSON.parse(existingRaw) : [];

        const foundIndex = existingCart.findIndex(
          (c) => String(c.id) === String(itemKey)
        );

        if (foundIndex > -1) {
          existingCart[foundIndex].quantity += 1;
        } else {
          existingCart.push({
            id: String(itemKey),
            name: title,
            price,
            quantity: 1,
            image: item.image || "/pizzahub-logo.png",
          });
        }

        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cart-updated"));
      } catch (err) {
        console.warn("Cart storage warning:", err);
      }
    }

    toast.success(`${title} added to cart`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-medium text-gray-500"
      >
        <Link href="/dashboard" className="hover:text-gray-800 transition">
          Home
        </Link>
        <span>&gt;</span>
        <span className="text-[#D91B24] font-semibold">Favorites</span>
      </nav>

      {/* Header + Clear All Favorites */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-[#D91B24] border border-rose-100 shrink-0">
            <Heart className="h-5 w-5 fill-[#D91B24]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Favorites
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Your favorite pizzas, all in one place.
            </p>
          </div>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            disabled={clearingAll}
            onClick={handleClearAllFavorites}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-50/90 px-4 py-2 text-xs sm:text-sm font-semibold text-[#D91B24] hover:bg-rose-100 transition cursor-pointer disabled:opacity-60 self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All Favorites</span>
          </button>
        )}
      </div>

      {/* Favorites Grid */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-500">
          Loading your favorite pizzas...
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center space-y-3">
          <p className="text-sm font-medium text-gray-600">
            No favorite pizzas saved yet.
          </p>
          <Link
            href="/browse-menu"
            className="inline-flex items-center justify-center rounded-xl bg-[#D91B24] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b8151d] transition"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {favorites.map((item, index) => {
            const cardKey = item._id || item.itemId || item.id || index;
            const title = buildDynamicPizzaTitle(item, index);
            const price = Number(item.price ?? 14.99);
            const oldPrice =
              typeof item.oldPrice === "number" ? item.oldPrice : price + 4;
            const rating = item.rating ?? 4.6;
            const reviewsCount = item.reviewsCount ?? 95;
            const deliveryTime = item.deliveryTime || "30-40 min";
            const deliveryText = item.deliveryText || "Free Delivery";
            const imageSrc = item.image || "/pizzahub-logo.png";

            return (
              <div
                key={cardKey}
                className="rounded-2xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <img
                  src={imageSrc}
                  alt={title}
                  className="h-36 sm:h-32 w-full sm:w-44 rounded-xl object-cover border border-gray-100 bg-gray-100 shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {title}
                    </h2>

                    <button
                      type="button"
                      aria-label={`Remove ${title} from favorites`}
                      onClick={() => handleRemoveFavorite(item, index)}
                      className="p-1 text-[#D91B24] hover:scale-110 transition cursor-pointer shrink-0"
                    >
                      <Heart className="h-4 w-4 fill-[#D91B24]" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-semibold text-gray-700">
                      {rating.toFixed(1)}
                    </span>
                    <span>({reviewsCount} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-extrabold text-[#D91B24]">
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ${oldPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{deliveryTime}</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 truncate">
                        <Truck className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{deliveryText}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item, index)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#D91B24] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#b8151d] transition cursor-pointer shrink-0"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}