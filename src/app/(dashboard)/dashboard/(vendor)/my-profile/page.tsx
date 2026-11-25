// import React from 'react';

// const profilePage = () => {
//     return (
//         <div>
//             <h1> my-profile Page </h1>
//         </div>
//     );
// };

// export default profilePage;
















"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Camera,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface DbUserDoc {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string;
}

const getCleanApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  return raw.replace(/\/+$/, "");
};

const getInitialLetter = (name?: string, email?: string) => {
  const source = (name || email || "V").trim();
  return source.charAt(0).toUpperCase() || "V";
};

export default function VendorMyProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const sessionUser = session?.user as
    | { name?: string; email?: string; image?: string }
    | undefined;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropInputRef = useRef<HTMLInputElement | null>(null);

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [imgFailed, setImgFailed] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const currentEmail = (sessionUser?.email || "").trim().toLowerCase();
      if (currentEmail && isMounted) {
        setEmail(currentEmail);
      }
      if (sessionUser?.name && isMounted) {
        setFullName((prev) => prev || sessionUser.name || "");
      }
      if (sessionUser?.image && isMounted) {
        setAvatarUrl((prev) => prev || sessionUser.image || "");
      }

      const apiUrl = getCleanApiUrl();
      if (!apiUrl || !currentEmail) return;

      try {
        const res = await fetch(`${apiUrl}/users`, { cache: "no-store" });
        if (!res.ok) return;
        const users: DbUserDoc[] = await res.json();
        const matched = Array.isArray(users)
          ? users.find(
              (u) => (u.email || "").trim().toLowerCase() === currentEmail
            )
          : undefined;

        if (matched && isMounted) {
          if (matched.name) setFullName(matched.name);
          if (matched.phone) setPhone(matched.phone);
          if (matched.address) setAddress(matched.address);
          if (matched.image) {
            setAvatarUrl(matched.image);
            setImgFailed(false);
          }
        }
      } catch (err) {
        console.warn("Failed to load profile from DB:", err);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [sessionUser?.email, sessionUser?.name, sessionUser?.image]);

  const handleFileSelected = (file?: File) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPG or PNG image");
      return;
    }

    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxBytes) {
      toast.error("Image size must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
        setImgFailed(false);
        toast.success("Photo selected. Click Update Profile to save.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const targetEmail = (email || sessionUser?.email || "")
      .trim()
      .toLowerCase();
    if (!targetEmail) {
      toast.error("Email is missing");
      return;
    }

    const apiUrl = getCleanApiUrl();
    if (!apiUrl) {
      toast.error("API URL is not configured");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${apiUrl}/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          name: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          image: avatarUrl.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        toast.error(data?.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Update profile error:", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const hasValidImage = Boolean(avatarUrl && avatarUrl.trim() && !imgFailed);
  const initialLetter = getInitialLetter(fullName, email);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-gray-500"
      >
        <Link href="/" className="hover:text-[#D91B24] transition">
          Home
        </Link>
        <span>&gt;</span>
        <span className="font-semibold text-[#D91B24]">Profile Settings</span>
      </nav>

      {/* Top Profile Header */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {hasValidImage ? (
            <img
              src={avatarUrl}
              alt={fullName || "Vendor"}
              onError={() => setImgFailed(true)}
              className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm bg-gray-100"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D91B24] text-xl font-extrabold text-white border-2 border-white shadow-sm select-none">
              {initialLetter}
            </div>
          )}

          <button
            type="button"
            aria-label="Change profile picture"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#D91B24] text-white shadow-sm hover:bg-[#b8151d] transition cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-sm text-gray-500">
            Manage your profile information
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Card: Personal Information */}
        <form
          onSubmit={handleUpdateProfile}
          className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-5"
        >
          <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
            <User className="h-4 w-4 text-[#D91B24]" />
            <span>Personal Information</span>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="vendor-full-name"
                className="block text-xs font-bold text-gray-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="vendor-full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isPending ? "Loading..." : "Enter your full name"}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D91B24] transition"
              />
            </div>

            {/* Email Address (Non-editable) */}
            <div>
              <label
                htmlFor="vendor-email"
                className="block text-xs font-bold text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="vendor-email"
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  aria-readonly="true"
                  className="w-full rounded-xl border border-gray-200 bg-gray-100/80 pl-10 pr-4 py-2.5 text-sm text-gray-500 cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="vendor-phone"
                className="block text-xs font-bold text-gray-700 mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="vendor-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D91B24] transition"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="vendor-address"
                className="block text-xs font-bold text-gray-700 mb-1.5"
              >
                Address
              </label>
              <div className="relative">
                <MapPin className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="vendor-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D91B24] transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#D91B24] px-5 py-3 text-sm font-bold text-white hover:bg-[#b8151d] transition cursor-pointer disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Updating..." : "Update Profile"}</span>
          </button>
        </form>

        {/* Right Card: Change Profile Picture */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
            <ImagePlus className="h-4 w-4 text-[#D91B24]" />
            <span>Change Profile Picture</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {hasValidImage ? (
                <img
                  src={avatarUrl}
                  alt={fullName || "Vendor avatar"}
                  onError={() => setImgFailed(true)}
                  className="h-16 w-16 rounded-full object-cover border border-gray-200 bg-gray-100"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D91B24] text-xl font-extrabold text-white select-none">
                  {initialLetter}
                </div>
              )}

              <button
                type="button"
                aria-label="Upload avatar"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#D91B24] text-white shadow-sm hover:bg-[#b8151d] transition cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div
              onClick={() => dropInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileSelected(e.dataTransfer.files?.[0]);
              }}
              className={`flex-1 rounded-xl border border-dashed p-3.5 text-center transition cursor-pointer ${
                isDragging
                  ? "border-[#D91B24] bg-rose-50/50"
                  : "border-rose-200 bg-rose-50/20 hover:bg-rose-50/40"
              }`}
            >
              <p className="text-xs font-bold text-gray-800">Click to upload</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                or drag and drop
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                JPG, PNG (Max 2MB)
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
            className="hidden"
          />

          <input
            ref={dropInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-[#D91B24] hover:bg-rose-50/60 transition cursor-pointer"
          >
            <ImagePlus className="h-4 w-4" />
            <span>Change Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}