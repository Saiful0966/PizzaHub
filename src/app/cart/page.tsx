"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CartItem,
  getCartItems,
  removeFromCartStorage,
  saveCartItems,
} from "@/lib/cart";

const EMPTY_CART: CartItem[] = [];
let cachedRawCart: string | null = null;
let cachedCartItems: CartItem[] = EMPTY_CART;


function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  const raw = localStorage.getItem("pizzahub_cart");
  if (raw !== cachedRawCart) {
    cachedRawCart = raw;
    cachedCartItems = getCartItems();
  }
  return cachedCartItems;
}

function subscribeToCart(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("cart-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("cart-updated", callback);
    window.removeEventListener("storage", callback);
  };
}


export default function CartPage() {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => EMPTY_CART,
  );


  const router = useRouter();

  const updateQty = (id: string, delta: number) => {
    const updated = items.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item,
    );
    saveCartItems(updated);
  };

  const handleRemove = (id: string) => {
    removeFromCartStorage(id);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0,
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">Your cart is currently empty.</p>
          <Link
            href="/browse-menu"
            className="mt-4 inline-block rounded-lg bg-[#D91B24] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b8151d]"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || "/placeholder-pizza.jpg"}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div>
                    <h2 className="font-bold text-gray-900">{item.name}</h2>
                    <p className="text-sm font-semibold text-[#D91B24]">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQty(item._id, -1)}
                    className="h-8 w-8 rounded-lg border border-gray-200 font-bold"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item._id, 1)}
                    className="h-8 w-8 rounded-lg border border-gray-200 font-bold"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item._id)}
                    aria-label="Remove item"
                    className="ml-2 text-gray-500 hover:text-[#D91B24]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="mt-4 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-[#D91B24]">${subtotal.toFixed(2)}</span>
            </div>
            {/* <button
              type="button"
              className="mt-6 w-full rounded-xl bg-[#D91B24] py-3 text-sm font-semibold text-white hover:bg-[#b8151d]"
            >
              Proceed to Checkout
            </button> */}
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full rounded-xl bg-[#D91B24] py-3 px-5 text-sm font-semibold text-white hover:bg-[#b8151d] transition cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
