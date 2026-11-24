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

interface UserProfileDoc {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
  address?: string;
}

const LOCAL_PROFILE_KEY = "pizzahub_customer_profile";

const getCleanApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  return raw.replace(/\/+$/, "");
};

export default function CustomerProfilePage() {
  const { data: session } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sessionName = session?.user?.name || "";
  const sessionEmail = session?.user?.email || "";
  const sessionImage = session?.user?.image || "";

  const [userId, setUserId] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        if (isMounted) setLoading(true);

        const activeEmail = sessionEmail;
        if (isMounted) {
          setEmail(activeEmail);
          setFullName(sessionName);
          setAvatarUrl(sessionImage);
          setPreviewUrl(sessionImage);
        }

        if (typeof window !== "undefined") {
          const savedRaw = localStorage.getItem(LOCAL_PROFILE_KEY);
          if (savedRaw) {
            const parsed = JSON.parse(savedRaw) as UserProfileDoc;
            if (
              isMounted &&
              (!activeEmail ||
                !parsed.email ||
                parsed.email.toLowerCase() === activeEmail.toLowerCase())
            ) {
              if (parsed.name) setFullName(parsed.name);
              if (parsed.phone) setPhone(parsed.phone);
              if (parsed.address) setAddress(parsed.address);
              if (parsed.image) {
                setAvatarUrl(parsed.image);
                setPreviewUrl(parsed.image);
              }
            }
          }
        }

        const apiUrl = getCleanApiUrl();
        if (apiUrl && activeEmail) {
          const res = await fetch(`${apiUrl}/users`, { cache: "no-store" });
          if (res.ok) {
            const usersData = await res.json();
            const list = Array.isArray(usersData) ? usersData : [];
            const matchedUser = list.find(
              (u: UserProfileDoc) =>
                (u.email || "").trim().toLowerCase() ===
                activeEmail.trim().toLowerCase()
            ) as UserProfileDoc | undefined;

            if (matchedUser && isMounted) {
              if (matchedUser._id) setUserId(String(matchedUser._id));
              if (matchedUser.name) setFullName(matchedUser.name);
              if (matchedUser.phone) setPhone(matchedUser.phone);
              if (matchedUser.address) setAddress(matchedUser.address);
              if (matchedUser.image) {
                setAvatarUrl(matchedUser.image);
                setPreviewUrl(matchedUser.image);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Error loading profile:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [sessionEmail, sessionName, sessionImage]);

  const handleImageFile = (file?: File) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a JPG or PNG image");
      return;
    }

    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeBytes) {
      toast.error("Image size must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = typeof reader.result === "string" ? reader.result : "";
      if (resultStr) {
        setPreviewUrl(resultStr);
        setAvatarUrl(resultStr);
        toast.success("Profile photo selected");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleImageFile(droppedFile);
    }
  };

  const persistProfileEverywhere = async (
    updatedData: UserProfileDoc,
    showSuccessToast = true
  ) => {
    const profilePayload: UserProfileDoc = {
      name: (updatedData.name || "").trim() || "Customer",
      email: email || sessionEmail || "",
      phone: (updatedData.phone || "").trim(),
      address: (updatedData.address || "").trim(),
      image: updatedData.image || "",
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profilePayload));
        window.dispatchEvent(new Event("profile-updated"));
      } catch (err) {
        console.warn("Local profile save warning:", err);
      }
    }

    const apiUrl = getCleanApiUrl();
    if (apiUrl) {
      try {
        if (userId) {
          await fetch(`${apiUrl}/users/${encodeURIComponent(userId)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profilePayload),
          });
        } else if (profilePayload.email) {
          await fetch(`${apiUrl}/users`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profilePayload),
          });
        }
      } catch (err) {
        console.warn("Backend profile sync warning:", err);
      }
    }

    if (showSuccessToast) {
      toast.success("Profile updated successfully");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      await persistProfileEverywhere(
        {
          name: fullName,
          phone,
          address,
          image: previewUrl || avatarUrl,
        },
        true
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePhotoClick = () => {
    if (previewUrl && previewUrl !== avatarUrl) {
      setAvatarUrl(previewUrl);
      persistProfileEverywhere(
        {
          name: fullName,
          phone,
          address,
          image: previewUrl,
        },
        true
      );
      return;
    }
    fileInputRef.current?.click();
  };

  const displayedAvatar =
    previewUrl || avatarUrl || sessionImage || "/pizzahub-logo.png";

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
        <span className="text-[#D91B24] font-semibold">Profile Settings</span>
      </nav>

      {/* Top Profile Banner */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={displayedAvatar}
            alt={fullName || "Customer Profile"}
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-white shadow-sm bg-gray-100"
          />
          <button
            type="button"
            aria-label="Upload new profile photo"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0.5 right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#D91B24] text-white shadow-xs hover:bg-[#b8151d] transition cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your profile information
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-500">
          Loading profile information...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Personal Information */}
          <form
            onSubmit={handleUpdateProfile}
            className="lg:col-span-7 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-2xs space-y-5"
          >
            <div className="flex items-center gap-2 text-base font-bold text-gray-900">
              <User className="h-4 w-4 text-[#D91B24]" />
              <span>Personal Information</span>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="profile-fullname"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="profile-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D91B24] transition"
                />
              </div>

              {/* Email Address Change hoibo na  disabled  */}
              <div>
                <label
                  htmlFor="profile-email"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    disabled
                    readOnly
                    aria-readonly="true"
                    className="w-full rounded-xl border border-gray-200 bg-gray-100/80 pl-10 pr-4 py-2.5 text-sm text-gray-600 cursor-not-allowed select-none outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="profile-phone"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712-345678"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D91B24] transition"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="profile-address"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Address
                </label>
                <div className="relative">
                  <MapPin className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="profile-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#D91B24] transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-[#D91B24] py-3 px-5 text-sm font-bold text-white hover:bg-[#b8151d] transition inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Updating..." : "Update Profile"}</span>
            </button>
          </form>

          {/* Right Change Profile Picture */}
          <div className="lg:col-span-5 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 text-base font-bold text-gray-900">
              <ImagePlus className="h-4 w-4 text-[#D91B24]" />
              <span>Change Profile Picture</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={displayedAvatar}
                  alt="Preview Avatar"
                  className="h-24 w-24 rounded-full object-cover border border-gray-100 bg-gray-100"
                />
                <span className="absolute bottom-0.5 right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#D91B24] text-white">
                  <Camera className="h-3 w-3" />
                </span>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    fileInputRef.current?.click();
                  }
                }}
                className={`flex-1 w-full rounded-2xl border border-dashed p-5 text-center transition cursor-pointer ${
                  isDragging
                    ? "border-[#D91B24] bg-rose-50/60"
                    : "border-rose-200 bg-[#FFFDFC] hover:bg-rose-50/40"
                }`}
              >
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  Click to upload
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  or drag and drop
                </p>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  JPG, PNG (Max 2MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleImageFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>

            <button
              type="button"
              onClick={handleChangePhotoClick}
              className="w-full rounded-xl border border-[#D91B24] py-2.5 px-4 text-sm font-bold text-[#D91B24] hover:bg-rose-50 transition inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <ImagePlus className="h-4 w-4" />
              <span>Change Photo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}