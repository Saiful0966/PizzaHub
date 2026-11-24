"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getCartItems } from "@/lib/cart";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const CART_STORAGE_KEY = "pizzahub_cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const items = getCartItems() as CartItem[];
    return Array.isArray(items) ? items : [];
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Order Form State If null, Display the Logged-in User's Name and Email
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash on Delivery");

  const resolvedCustomerName = customerName ?? session?.user?.name ?? "";
  const resolvedCustomerEmail = customerEmail ?? session?.user?.email ?? "";

  // Total Amount Calculation
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  // Send Data to MongoDB Orders Collection When Confirm Order Is Clicked
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !resolvedCustomerName.trim() ||
      !resolvedCustomerEmail.trim() ||
      !address.trim() ||
      !number.trim() ||
      !paymentMethod
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const currentUser = session?.user as
        | { id?: string; name?: string | null; email?: string | null; role?: string | null }
        | undefined;

      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: currentUser?.id || null,
          customerName: resolvedCustomerName.trim(),
          customerEmail: resolvedCustomerEmail.trim(),
          customerRole: currentUser?.role || "customer",
          phone: number.trim(),
          address: address.trim(),
          paymentMethod,
          items: cartItems,
          totalAmount,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to place order");
      }

      // Clear Cart and Update Navbar Count After Order Is Saved
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
        window.dispatchEvent(new Event("cart-updated"));
      }

      setCartItems([]);
      toast.success("Order confirmed successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong while ordering"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500"
        >
          <Link href="/" className="hover:text-[#D92323]">
            Home
          </Link>
          <span>&gt;</span>
          <Link href="/cart" className="hover:text-[#D92323]">
            Cart
          </Link>
          <span>&gt;</span>
          <span className="font-semibold text-[#D92323]">Checkout</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-2xs">
            <p className="text-gray-600 mb-4">No items in cart to checkout.</p>
            <Link
              href="/browse-menu"
              className="inline-flex items-center justify-center rounded-xl bg-[#D92323] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#b81d1d] transition"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
           {/* // Order Form on the Left Side */}
            <form
              onSubmit={handleConfirmOrder}
              className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Order Form
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={resolvedCustomerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D92323]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={resolvedCustomerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D92323]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D92323]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number
                </label>
                <input
                  type="tel"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D92323]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D92323] bg-white"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <Link
                  href="/cart"
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Back to Cart
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#D92323] hover:bg-[#b81d1d] px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Confirming Order..." : "Confirm Order"}
                </button>
              </div>
            </form>

           {/* Order Summary on the Right Side */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-gray-100 pb-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-gray-700 truncate">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900 shrink-0">
                      ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-semibold text-gray-700">
                  Total
                </span>
                <span className="text-lg font-extrabold text-[#D92323]">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}