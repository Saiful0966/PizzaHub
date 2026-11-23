
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { addToCartStorage } from "@/lib/cart";

interface MenuDetailsActionsProps {
  item: {
    _id: string;
    title?: string;
    name?: string;
    price?: number;
    image?: string;
  };
}

export default function MenuDetailsActions({ item }: MenuDetailsActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);

  const itemTitle = item.title || item.name || "Menu Item";

  const decreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCartStorage(
      {
        _id: item._id,
        name: itemTitle,
        price: Number(item.price || 0),
        image: item.image,
      },
      quantity
    );

    toast.success("Add to Cart Successful");
    router.push("/cart");
  };

  return (
    <div className="mt-7">
      <p className="mb-2.5 text-sm font-bold text-gray-900">Quantity</p>

      <div className="flex flex-wrap items-center gap-4">
        {/* - / quantity / + */}
        <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-2 py-1.5 shadow-2xs">
          <button
            type="button"
            onClick={decreaseQty}
            aria-label="Decrease quantity"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="min-w-10 text-center text-base font-bold text-gray-900">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQty}
            aria-label="Increase quantity"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#D91B24] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b8151d] cursor-pointer"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}