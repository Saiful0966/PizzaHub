



"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface MenuItemDoc {
  _id: string;
  name?: string;
  title?: string;
  price?: number;
  category?: string;
  description?: string;
  image?: string;
  status?: string;
  vendorName?: string;
  vendorEmail?: string;
  createdAt?: string;
}

const getCleanApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  return raw.replace(/\/+$/, "");
};

const normalizeStatus = (
  status?: string
): "Pending" | "Approved" | "Rejected" => {
  const s = String(status || "Pending")
    .trim()
    .toLowerCase();
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  return "Pending";
};

const getItemTitle = (item: MenuItemDoc) => {
  const raw = (item.name || item.title || "").trim();
  if (raw && !/^https?:\/\//i.test(raw)) {
    return raw;
  }
  return item.category ? `${item.category} Pizza` : "Pizza Item";
};

const getItemDescription = (item: MenuItemDoc) => {
  const raw = (item.description || "").trim();
  if (raw && !/^https?:\/\//i.test(raw)) {
    return raw;
  }
  return "Freshly prepared item on PizzaHub menu.";
};

export default function VendorMyMenuPage() {
  const { data: session } = authClient.useSession();
  const userEmail = (session?.user?.email || "").trim().toLowerCase();

  const [menus, setMenus] = useState<MenuItemDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<MenuItemDoc | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("Pizza");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editImage, setEditImage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchVendorMenus = async () => {
      const apiUrl = getCleanApiUrl();
      if (!apiUrl) {
        toast.error("API URL is not configured");
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);
        const res = await fetch(`${apiUrl}/menuitems`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await res.json();
        const list: MenuItemDoc[] = Array.isArray(data) ? data : [];

        const hasVendorEmails = list.some((m) => Boolean(m.vendorEmail));
        const filteredByVendor =
          userEmail && hasVendorEmails
            ? list.filter(
                (m) => (m.vendorEmail || "").trim().toLowerCase() === userEmail
              )
            : list;

        if (isMounted) {
          setMenus(filteredByVendor);
        }
      } catch (err) {
        console.error("Error fetching vendor menus:", err);
        toast.error("Failed to load your menu items");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVendorMenus();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const categories = useMemo(() => {
    const set = new Set<string>(["Pizza", "Sides", "Drinks"]);
    menus.forEach((m) => {
      if (m.category && m.category.trim()) {
        set.add(m.category.trim());
      }
    });
    return Array.from(set);
  }, [menus]);

  const filteredMenus = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return menus.filter((item) => {
      const title = getItemTitle(item).toLowerCase();
      const desc = getItemDescription(item).toLowerCase();
      const cat = (item.category || "Pizza").trim();
      const status = normalizeStatus(item.status);

      const matchesCategory =
        selectedCategory === "all" ||
        cat.toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus =
        selectedStatus === "all" ||
        status.toLowerCase() === selectedStatus.toLowerCase();

      const matchesSearch = !q || title.includes(q) || desc.includes(q);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [menus, searchQuery, selectedCategory, selectedStatus]);

  const openEditModal = (item: MenuItemDoc) => {
    setEditingItem(item);
    setEditName(getItemTitle(item));
    setEditPrice(String(Number(item.price || 0)));
    setEditCategory(item.category || "Pizza");
    setEditDescription(getItemDescription(item));
    setEditImage(item.image || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const apiUrl = getCleanApiUrl();
    if (!apiUrl) return;

    const parsedPrice = Number(editPrice);
    if (!editName.trim() || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid name and price");
      return;
    }

    const updatedPayload = {
      name: editName.trim(),
      title: editName.trim(),
      price: parsedPrice,
      category: editCategory.trim() || "Pizza",
      description: editDescription.trim(),
      image: editImage.trim(),
    };

    const previousMenus = [...menus];
    setMenus((prev) =>
      prev.map((m) =>
        m._id === editingItem._id ? { ...m, ...updatedPayload } : m
      )
    );

    try {
      setBusyId(editingItem._id);
      const res = await fetch(
        `${apiUrl}/menuitems/${encodeURIComponent(editingItem._id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPayload),
        }
      );

      if (!res.ok) {
        setMenus(previousMenus);
        toast.error("Failed to update menu item");
        return;
      }

      toast.success("Menu item updated");
      setEditingItem(null);
    } catch (err) {
      console.error("Edit menu error:", err);
      setMenus(previousMenus);
      toast.error("Failed to update menu item");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteItem = async (item: MenuItemDoc) => {
    const apiUrl = getCleanApiUrl();
    if (!apiUrl) return;

    const previousMenus = [...menus];
    setMenus((prev) => prev.filter((m) => m._id !== item._id));

    try {
      setBusyId(item._id);
      const res = await fetch(
        `${apiUrl}/menuitems/${encodeURIComponent(item._id)}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        setMenus(previousMenus);
        toast.error("Failed to delete menu item");
        return;
      }

      toast.success(`${getItemTitle(item)} deleted`);
    } catch (err) {
      console.error("Delete item error:", err);
      setMenus(previousMenus);
      toast.error("Failed to delete menu item");
    } finally {
      setBusyId(null);
    }
  };

  const renderAdminStatusBadge = (status?: string) => {
    const normalized = normalizeStatus(status);
    if (normalized === "Approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3" />
          <span>APPROVED</span>
        </span>
      );
    }
    if (normalized === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rose-700 border border-rose-200">
          <XCircle className="h-3 w-3" />
          <span>REJECTED</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-700 border border-amber-200">
        <Clock className="h-3 w-3" />
        <span>PENDING</span>
      </span>
    );
  };

  const getCategoryBadgeStyle = (category?: string) => {
    const cat = (category || "Pizza").toLowerCase();
    if (cat === "sides") {
      return "bg-sky-50 text-sky-700 border-sky-200";
    }
    if (cat === "drinks") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="space-y-6">
      {/* Header + Add New Item CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            My Menu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your restaurant menu items and pricing.
          </p>
        </div>

        <Link
          href="/dashboard/add-menu"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D91B24] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b8151d] transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Item</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#D91B24] transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#D91B24] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#D91B24] cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* 3 Column Menu Cards Grid */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center text-sm text-gray-500">
          Loading menu items...
        </div>
      ) : filteredMenus.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center space-y-3">
          <p className="text-sm text-gray-500">No menu items found.</p>
          <Link
            href="/dashboard/add-menu"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#D91B24] px-4 py-2 text-xs font-bold text-white hover:bg-[#b8151d] transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Item</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenus.map((item) => {
            const title = getItemTitle(item);
            const description = getItemDescription(item);
            const isBusy = busyId === item._id;

            return (
              <div
                key={item._id}
                className="rounded-2xl border border-gray-100 bg-white shadow-2xs overflow-hidden flex flex-col justify-between min-w-0"
              >
                <div className="p-4 space-y-3">
                  {/* Top Row Image  Category & Admin Status */}
                  <div className="flex items-start justify-between gap-2.5">
                    <img
                      src={item.image || "/pizzahub-logo.png"}
                      alt={title}
                      className="h-20 w-24 rounded-xl object-cover border border-gray-100 bg-gray-100 shrink-0"
                    />

                    <div className="flex flex-col items-end gap-1.5 min-w-0">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getCategoryBadgeStyle(
                          item.category
                        )}`}
                      >
                        {item.category || "Pizza"}
                      </span>

                      {renderAdminStatusBadge(item.status)}
                    </div>
                  </div>

                  {/* Title, Price & Description */}
                  <div className="space-y-1 min-w-0">
                    <h2 className="text-sm sm:text-base font-extrabold text-gray-900 truncate">
                      {title}
                    </h2>
                    <p className="text-sm font-extrabold text-[#D91B24]">
                      ${Number(item.price || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed break-words">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions Edit & Delete */}
                <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/40">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => openEditModal(item)}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100/70 transition cursor-pointer disabled:opacity-60"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDeleteItem(item)}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#D91B24] hover:bg-rose-50 transition cursor-pointer disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Menu  */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]"
          onClick={() => setEditingItem(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-extrabold text-gray-900">
                Edit Menu Item
              </h3>
              <button
                type="button"
                aria-label="Close edit modal"
                onClick={() => setEditingItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-gray-900 outline-none focus:border-[#D91B24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-gray-900 outline-none focus:border-[#D91B24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-gray-900 outline-none focus:border-[#D91B24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-gray-900 outline-none focus:border-[#D91B24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-gray-900 outline-none focus:border-[#D91B24] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyId === editingItem._id}
                  className="rounded-xl bg-[#D91B24] px-4 py-2 text-xs font-bold text-white hover:bg-[#b8151d] transition cursor-pointer disabled:opacity-60"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}