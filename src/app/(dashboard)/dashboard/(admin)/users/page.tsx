
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Crown,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

interface UserDoc {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  image?: string;
  createdAt?: string;
}

const ROLE_OPTIONS = ["customer", "vendor", "admin"] as const;

const getCleanApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  return raw.replace(/\/+$/, "");
};

const formatRoleLabel = (role?: string) => {
  const normalized = String(role || "customer")
    .trim()
    .toLowerCase();
  if (normalized === "admin") return "Admin";
  if (normalized === "vendor") return "Vendor";
  return "User";
};

const getInitialLetter = (name?: string, email?: string) => {
  const source = (name || email || "U").trim();
  return source.charAt(0).toUpperCase() || "U";
};

function UserAvatarCell({ user }: { user: UserDoc }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasValidImage = Boolean(user.image && user.image.trim() && !imgFailed);

  if (hasValidImage) {
    return (
      <img
        src={user.image}
        alt={user.name || "User"}
        onError={() => setImgFailed(true)}
        className="h-9 w-9 rounded-full object-cover border border-gray-200 shrink-0"
      />
    );
  }

  return (
    <div
      aria-label={user.name || "User"}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D91B24] text-xs font-extrabold text-white shrink-0 select-none"
    >
      {getInitialLetter(user.name, user.email)}
    </div>
  );
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      const apiUrl = getCleanApiUrl();
      if (!apiUrl) {
        toast.error("API URL is not configured");
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);
        const res = await fetch(`${apiUrl}/users`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users from server");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalUsersCount = users.length;
  const activeUsersCount = useMemo(() => users.length, [users]);
  const adminsCount = useMemo(
    () =>
      users.filter((u) => String(u.role || "").trim().toLowerCase() === "admin")
        .length,
    [users]
  );

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return users.filter((u) => {
      const normalizedRole = String(u.role || "customer")
        .trim()
        .toLowerCase();

      const matchesRole =
        selectedRole === "all" || normalizedRole === selectedRole;

      const matchesQuery =
        !q ||
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q) ||
        (u.address || "").toLowerCase().includes(q) ||
        normalizedRole.includes(q);

      return matchesRole && matchesQuery;
    });
  }, [users, searchQuery, selectedRole]);

  const handleRoleChange = async (userId: string, nextRole: string) => {
    const apiUrl = getCleanApiUrl();
    if (!apiUrl) return;

    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: nextRole } : u))
    );

    try {
      setBusyUserId(userId);
      const res = await fetch(`${apiUrl}/users/${encodeURIComponent(userId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });

      if (!res.ok) {
        setUsers(previousUsers);
        toast.error("Failed to update user role");
        return;
      }

      toast.success(`Role updated to ${formatRoleLabel(nextRole)}`);
    } catch (err) {
      console.error("Role update error:", err);
      setUsers(previousUsers);
      toast.error("Failed to update user role");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string, targetName?: string) => {
    const apiUrl = getCleanApiUrl();
    if (!apiUrl) return;

    const previousUsers = [...users];
    setUsers((prev) => prev.filter((u) => u._id !== userId));

    try {
      setBusyUserId(userId);
      const res = await fetch(`${apiUrl}/users/${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setUsers(previousUsers);
        toast.error("Failed to delete user");
        return;
      }

      toast.success(`${targetName || "User"} deleted successfully`);
    } catch (err) {
      console.error("Delete user error:", err);
      setUsers(previousUsers);
      toast.error("Failed to delete user");
    } finally {
      setBusyUserId(null);
    }
  };

  const getRoleBadgeStyle = (role?: string) => {
    const normalized = String(role || "customer")
      .trim()
      .toLowerCase();
    if (normalized === "admin") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    if (normalized === "vendor") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-sky-50 text-sky-700 border-sky-200";
  };

  const formatJoinedDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "Recent";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Pill Badge + Header */}
      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#D91B24] border border-rose-100">
          <Users className="h-3.5 w-3.5" />
          <span>Manage Users</span>
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <span>Manage Users</span>
          <span aria-hidden="true">👥</span>
        </h1>
        <p className="text-sm text-gray-500">
          Manage all registered users on PizzaHub platform.
        </p>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-rose-100/90 bg-gradient-to-br from-[#FFF5F5] to-[#FFEAEA] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">Total Users</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : totalUsersCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +12%
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-[#D91B24] shadow-2xs">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <Users className="h-20 w-20 text-rose-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-amber-100/90 bg-gradient-to-br from-[#FFF9F2] to-[#FFF1E0] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                Active Users
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : activeUsersCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +10%
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-amber-600 shadow-2xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <ShieldCheck className="h-20 w-20 text-amber-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-purple-100/90 bg-gradient-to-br from-[#F8F5FF] to-[#EFE9FF] p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">Admins</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {loading ? "..." : adminsCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">
                ↑ +1%
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-purple-600 shadow-2xs">
              <Crown className="h-6 w-6" />
            </div>
          </div>
          <Crown className="h-20 w-20 text-purple-200/50 absolute -bottom-3 -right-3 pointer-events-none" />
        </div>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone or address..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#D91B24] transition"
          />
        </div>

        <select
          aria-label="Filter users by role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#D91B24] sm:w-44 cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="customer">User</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-extrabold text-gray-900">
            All Registered Users
          </h2>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#D91B24]">
            Total: {filteredUsers.length} users
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500">
                  <th className="py-3 pr-3">#</th>
                  <th className="py-3 px-3">Avatar</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone Number</th>
                  <th className="py-3 px-3">Address</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Joined On</th>
                  <th className="py-3 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {filteredUsers.map((u, index) => {
                  const normalizedRole = String(u.role || "customer")
                    .trim()
                    .toLowerCase();
                  const selectRoleValue = ROLE_OPTIONS.includes(
                    normalizedRole as (typeof ROLE_OPTIONS)[number]
                  )
                    ? normalizedRole
                    : "customer";

                  const hasPhone = Boolean(u.phone && u.phone.trim());
                  const hasAddress = Boolean(u.address && u.address.trim());

                  return (
                    <tr
                      key={u._id || index}
                      className="hover:bg-gray-50/70 transition"
                    >
                      <td className="py-3.5 pr-3 font-semibold text-gray-500">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-3">
                        <UserAvatarCell user={u} />
                      </td>
                      <td className="py-3.5 px-3 font-bold text-gray-900 whitespace-nowrap">
                        {u.name || "Unnamed User"}
                      </td>
                      <td className="py-3.5 px-3 text-gray-600 whitespace-nowrap">
                        {u.email || "—"}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {hasPhone ? (
                          <span className="text-gray-700">{u.phone!.trim()}</span>
                        ) : (
                          <span className="text-xs italic text-gray-400">
                            No phone number
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 max-w-[200px] truncate">
                        {hasAddress ? (
                          <span className="text-gray-700">
                            {u.address!.trim()}
                          </span>
                        ) : (
                          <span className="text-xs italic text-gray-400">
                            No address
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <select
                          aria-label={`Change role for ${u.name || "user"}`}
                          value={selectRoleValue}
                          disabled={busyUserId === u._id}
                          onChange={(e) =>
                            handleRoleChange(u._id, e.target.value)
                          }
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer disabled:opacity-60 ${getRoleBadgeStyle(
                            selectRoleValue
                          )}`}
                        >
                          <option
                            value="customer"
                            className="bg-white text-gray-900"
                          >
                            User
                          </option>
                          <option
                            value="vendor"
                            className="bg-white text-gray-900"
                          >
                            Vendor
                          </option>
                          <option
                            value="admin"
                            className="bg-white text-gray-900"
                          >
                            Admin
                          </option>
                        </select>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-gray-500 whitespace-nowrap">
                        {formatJoinedDate(u.createdAt)}
                      </td>
                      <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          disabled={busyUserId === u._id}
                          aria-label={`Delete ${u.name || "user"}`}
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-[#D91B24] hover:bg-rose-100 transition cursor-pointer disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}