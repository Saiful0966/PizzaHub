
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface MenuItem {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  insertedId?: string;
}

export default function AddMenuItem() {
  const router = useRouter();

  const [formData, setFormData] = useState<MenuItem>({
    name: "",
    category: "Pizza",
    price: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  // Handle Input Change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menuitems`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            price: Number(formData.price),
          }),
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add menu item");
      }

      setFormData({
        name: "",
        category: "Pizza",
        price: "",
        description: "",
        image: "",
      });

      toast.success(data.message || "Menu item added successfully!");
      router.push("/dashboard/my-menu");
    } catch (err: unknown) {
      setError(true);

      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong!";

      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset Form
  const handleCancel = (): void => {
    setFormData({
      name: "",
      category: "Pizza",
      price: "",
      description: "",
      image: "",
    });

    setMessage("");
    setError(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm">
      {/* Item Details */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">🍴 Item Details</h2>

        {/* Item Name */}
        <div>
          <label className="block font-semibold mb-2">
            Item Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
            required
            className="w-full border rounded-lg p-3 outline-none focus:border-red-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-2">
            Category <span className="text-red-500">*</span>
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:border-red-500"
          >
            <option value="Pizza">🍕 Pizza</option>
            <option value="Sides">Sides</option>
            <option value="Drinks">Drinks</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold mb-2">
            Price ($) <span className="text-red-500">*</span>
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="14.99"
            min="0"
            step="0.01"
            required
            className="w-full border rounded-lg p-3 outline-none focus:border-red-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write item description..."
            maxLength={200}
            rows={4}
            className="w-full border rounded-lg p-3 outline-none focus:border-red-500 resize-none"
          />

          <p className="text-right text-xs text-gray-400">
            {formData.description.length}/200
          </p>
        </div>

        {/* Image URL */}
        <div>
          <label className="block font-semibold mb-2">
            Image URL <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center border rounded-lg overflow-hidden focus-within:border-red-500">
            <span className="px-4 text-gray-500">🔗</span>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste image URL here..."
              required
              className="w-full p-3 outline-none"
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Enter a direct image link (https://example.com/pizza.jpg)
          </p>
        </div>

        {/* Error Message */}
        {message && error && (
          <p className="text-sm font-medium text-red-600">{message}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            ✕ Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Adding..." : "+ Add Item"}
          </button>
        </div>
      </form>

      {/* Live Preview */}
      <div className="bg-red-50/50 p-5 sm:p-6 rounded-2xl border border-red-100/70 flex flex-col">
        <h2 className="text-xl font-bold mb-5 text-gray-900">👁 Preview</h2>

        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex-1 flex flex-col justify-between min-h-[540px]">
          <div>
            {formData.image ? (
              <div className="w-full h-80 overflow-hidden bg-gray-100">
                <img
                  src={formData.image}
                  alt={formData.name || "Menu item"}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full h-80 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                Image preview will appear here
              </div>
            )}

            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-2xl font-bold text-gray-900 break-words">
                    {formData.name || "Item Name"}
                  </h3>
                  <span className="shrink-0 bg-red-50 text-red-600 font-medium px-3 py-1 rounded-full text-xs">
                    {formData.category}
                  </span>
                </div>

                <p className="text-red-600 text-3xl font-extrabold mt-3">
                  ${Number(formData.price || 0).toFixed(2)}
                </p>

                <p className="text-gray-600 mt-4 leading-relaxed break-words">
                  {formData.description || "Item description will appear here."}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Live Menu Card Preview</span>
            <span className="font-medium text-gray-700">
              {formData.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
