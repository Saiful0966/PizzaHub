"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Crown,
  Eye,
  Mail,
  Package,
  Pizza,
  Search,
  Store,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

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
  submittedAt?: string;
}

const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"] as const;

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

const getVendorDisplayName = (item: MenuItemDoc) => {
  if (item.vendorName && item.vendorName.trim()) {
    return item.vendorName.trim();
  }
  if (item.vendorEmail && item.vendorEmail.includes("@")) {
    const prefix = item.vendorEmail.split("@")[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return "PizzaHub Vendor";
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "Recent";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function MenuApprovalsPage() {
  const [menus, setMenus] = useState<MenuItemDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MenuItemDoc | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMenus = async () => {
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
        if (isMounted) {
          setMenus(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        toast.error("Failed to load menu items");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMenus();

    return () => {
      isMounted = false;
    };
  }, []);

  const vendorOptions = useMemo(() => {
    const set = new Set<string>();
    menus.forEach((m) => {
      set.add(getVendorDisplayName(m));
    });
    return Array.from(set);
  }, [menus]);

  const pendingCount = useMemo(
    () => menus.filter((m) => normalizeStatus(m.status) === "Pending").length,
    [menus]
  );

  const approvedCount = useMemo(
    () => menus.filter((m) => normalizeStatus(m.status) === "Approved").length,
    [menus]
  );

  const rejectedCount = useMemo(
    () => menus.filter((m) => normalizeStatus(m.status) === "Rejected").length,
    [menus]
  );

  const totalMenusCount = menus.length;

  const filteredMenus = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return menus.filter((m) => {
      const title = getItemTitle(m).toLowerCase();
      const vendor = getVendorDisplayName(m);
      const status = normalizeStatus(m.status);

      const matchesVendor =
        selectedVendor === "all" || vendor === selectedVendor;

      const matchesStatus =
        selectedStatus === "all" ||
        status.toLowerCase() === selectedStatus.toLowerCase();

      const matchesSearch =
        !q ||
        title.includes(q) ||
        vendor.toLowerCase().includes(q) ||
        (m.vendorEmail || "").toLowerCase().includes(q);

      return matchesVendor && matchesStatus && matchesSearch;
    });
  }, [menus, searchQuery, selectedVendor, selectedStatus]);

  const handleStatusUpdate = async (
    item: MenuItemDoc,
    nextStatus: "Pending" | "Approved" | "Rejected"
  ) => {
    const apiUrl = getCleanApiUrl();
    if (!apiUrl) return;

    const previousMenus = [...menus];
    const previousSelected = selectedItem;

    setMenus((prev) =>
      prev.map((m) => (m._id === item._id ? { ...m, status: nextStatus } : m))
    );
    if (selectedItem?._id === item._id) {
      setSelectedItem({ ...selectedItem, status: nextStatus });
    }

    try {
      setBusyId(item._id);
      const res = await fetch(
        `${apiUrl}/menuitems/${encodeURIComponent(item._id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      if (!res.ok) {
        setMenus(previousMenus);
        setSelectedItem(previousSelected);
        toast.error("Failed to update menu status");
        return;
      }

      toast.success(`${getItemTitle(item)} marked as ${nextStatus}`);
    } catch (err) {
      console.error("Status update error:", err);
      setMenus(previousMenus);
      setSelectedItem(previousSelected);
      toast.error("Failed to update menu status");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteMenu = async (item: MenuItemDoc) => {
    const apiUrl = getCleanApiUrl();
    if (!apiUrl) return;

    const previousMenus = [...menus];
    setMenus((prev) => prev.filter((m) => m._id !== item._id));
    if (selectedItem?._id === item._id) {
      setSelectedItem(null);
    }

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
      console.error("Delete menu error:", err);
      setMenus(previousMenus);
      toast.error("Failed to delete menu item");
    } finally {
      setBusyId(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    const normalized = normalizeStatus(status);
    if (normalized === "Approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Approved</span>
        </span>
      );
    }
    if (normalized === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
          <XCircle className="h-3.5 w-3.5" />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
        <Clock className="h-3.5 w-3.5" />
        <span>Pending</span>
      </span>
    );
  };

  const getStatusSelectStyle = (status: "Pending" | "Approved" | "Rejected") => {
    if (status === "Approved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "Rejected") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="space-y-6">
      {/* Top Badge + Heading */}
      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#D91B24] border border-rose-100">
          <Crown className="h-3.5 w-3.5 fill-[#D91B24]" />
          <span>Menu Approval</span>
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <span>Menu Approval</span>
          <span aria-hidden="true">🍕</span>
        </h1>
        <p className="text-sm text-gray-500">
          Review and approve new menu items from vendors.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-amber-100/90 bg-gradient-to-br from-[#FFF9F2] to-[#FFF1E0] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                Pending Menus
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : pendingCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +2 this week
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-amber-600 shadow-2xs">
              <Pizza className="h-6 w-6" />
            </div>
          </div>
          <Pizza className="h-20 w-20 text-amber-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-gradient-to-br from-[#F3FCF7] to-[#E3F7EC] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                Approved Menus
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : approvedCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +5 this week
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-emerald-600 shadow-2xs">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <CheckCircle2 className="h-20 w-20 text-emerald-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-rose-100/90 bg-gradient-to-br from-[#FFF5F5] to-[#FFEAEA] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                Rejected Menus
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : rejectedCount}
              </p>
              <p className="text-xs font-bold text-rose-500 pt-0.5">
                ↑ +1 this week
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-[#D91B24] shadow-2xs">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
          <XCircle className="h-20 w-20 text-rose-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-purple-100/90 bg-gradient-to-br from-[#F8F5FF] to-[#EFE9FF] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                Total Menus
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : totalMenusCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +8 this week
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-purple-600 shadow-2xs">
              <Store className="h-6 w-6" />
            </div>
          </div>
          <Store className="h-20 w-20 text-purple-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu by name, vendor..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#D91B24] transition"
          />
        </div>

        <select
          aria-label="Filter menu by vendor"
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#D91B24] md:w-44 cursor-pointer"
        >
          <option value="all">All Vendors</option>
          {vendorOptions.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter menu by status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#D91B24] md:w-40 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Menus Table */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-extrabold text-gray-900">
            Vendor Menu Submissions
          </h2>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#D91B24]">
            Total: {filteredMenus.length} menus
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">
            Loading menus...
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            No menu items found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500">
                  <th className="py-3 pr-3">#</th>
                  <th className="py-3 px-3">Pizza Image</th>
                  <th className="py-3 px-3">Pizza Name</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {filteredMenus.map((item, idx) => {
                  const title = getItemTitle(item);
                  const currentStatus = normalizeStatus(item.status);
                  const isBusy = busyId === item._id;

                  return (
                    <tr
                      key={item._id || idx}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-gray-50/80 transition cursor-pointer"
                    >
                      <td className="py-3.5 pr-3 font-semibold text-gray-500">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-3">
                        <img
                          src={item.image || "/pizzahub-logo.png"}
                          alt={title}
                          className="h-10 w-10 rounded-full object-cover border border-gray-200 bg-gray-100"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-bold text-gray-900 whitespace-nowrap">
                        {title}
                      </td>
                      <td className="py-3.5 px-3 font-extrabold text-gray-900 whitespace-nowrap">
                        ${Number(item.price || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getStatusBadge(currentStatus)}
                      </td>
                      <td
                        className="py-3.5 pl-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            aria-label={`View details for ${title}`}
                            onClick={() => setSelectedItem(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition cursor-pointer disabled:opacity-60"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <select
                            aria-label={`Change status for ${title}`}
                            value={currentStatus}
                            disabled={isBusy}
                            onChange={(e) =>
                              handleStatusUpdate(
                                item,
                                e.target.value as
                                  | "Pending"
                                  | "Approved"
                                  | "Rejected"
                              )
                            }
                            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer disabled:opacity-60 ${getStatusSelectStyle(
                              currentStatus
                            )}`}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option
                                key={st}
                                value={st}
                                className="bg-white text-gray-900"
                              >
                                {st}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            disabled={isBusy}
                            aria-label={`Delete ${title}`}
                            onClick={() => handleDeleteMenu(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-[#D91B24] hover:bg-rose-100 transition cursor-pointer disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  🍕
                </span>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Product Details
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setSelectedItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Product Image + Summary */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={selectedItem.image || "/pizzahub-logo.png"}
                alt={getItemTitle(selectedItem)}
                className="h-28 w-full sm:w-32 rounded-xl object-cover border border-gray-200 bg-gray-100 shrink-0"
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="text-lg font-extrabold text-gray-900">
                  {getItemTitle(selectedItem)}
                </h4>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-base font-extrabold text-[#D91B24]">
                    ${Number(selectedItem.price || 0).toFixed(2)}
                  </span>
                  {getStatusBadge(selectedItem.status)}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pt-1">
                  {selectedItem.description ||
                    "Freshly prepared pizza submitted by vendor for approval on PizzaHub."}
                </p>
              </div>
            </div>

            {/* Vendor Name, Vendor Email, Submitted On, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                  <Store className="h-3.5 w-3.5 text-[#D91B24]" />
                  <span>Vendor Name</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1 truncate">
                  {getVendorDisplayName(selectedItem)}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                  <Calendar className="h-3.5 w-3.5 text-sky-600" />
                  <span>Submitted On</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {formatDate(
                    selectedItem.submittedAt || selectedItem.createdAt
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  <span>Vendor Email</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1 truncate">
                  {selectedItem.vendorEmail || "vendor@pizzahub.com"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                  <Package className="h-3.5 w-3.5 text-purple-600" />
                  <span>Category</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {selectedItem.category || "Pizza"}
                </p>
              </div>
            </div>

            {/* Full Product Details Key-Value List */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-2 text-xs">
              <p className="font-bold text-gray-800 text-sm mb-1.5">
                Full Product Details
              </p>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Pizza Name</span>
                <span className="font-semibold text-gray-900">
                  {getItemTitle(selectedItem)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Price</span>
                <span className="font-semibold text-gray-900">
                  ${Number(selectedItem.price || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Vendor</span>
                <span className="font-semibold text-gray-900">
                  {getVendorDisplayName(selectedItem)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Vendor Email</span>
                <span className="font-semibold text-gray-900">
                  {selectedItem.vendorEmail || "vendor@pizzahub.com"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Submitted On</span>
                <span className="font-semibold text-gray-900">
                  {formatDate(
                    selectedItem.submittedAt || selectedItem.createdAt
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-2 items-center">
                <span className="text-gray-500">Status</span>
                {getStatusBadge(selectedItem.status)}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={busyId === selectedItem._id}
                onClick={() => handleStatusUpdate(selectedItem, "Approved")}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition cursor-pointer disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                <span>Approve</span>
              </button>

              <button
                type="button"
                disabled={busyId === selectedItem._id}
                onClick={() => handleStatusUpdate(selectedItem, "Pending")}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition cursor-pointer disabled:opacity-60"
              >
                <Clock className="h-4 w-4" />
                <span>Pending</span>
              </button>

              <button
                type="button"
                disabled={busyId === selectedItem._id}
                onClick={() => handleStatusUpdate(selectedItem, "Rejected")}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#D91B24] px-3.5 py-2.5 text-sm font-bold text-white hover:bg-[#b8151d] transition cursor-pointer disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}