'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UploadCloud,
  Check,
  ArrowRight,
  ChefHat,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'vendor' as 'vendor' | 'customer',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Password validation checks
  const hasMinLength = formData.password.length >= 6;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Main Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-gray-100">
        
        {/* Left Side - Centered Pizza Banner Text */}
        <div className="md:col-span-5 relative bg-[#3D0505] text-white flex flex-col justify-start overflow-hidden min-h-[560px] md:min-h-full">
          <img
            src="/signUp-logo.png"
            alt="PizzaHub Banner"
            className="absolute inset-0 w-full h-full object-cover object-[center_65%]"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(35, 2, 2, 0.88) 0%, rgba(45, 4, 4, 0.72) 48%, rgba(25, 2, 2, 0.12) 80%, rgba(0, 0, 0, 0.18) 100%)',
            }}
          />

          {/* Text Positioned  */}
          <div className="relative z-10 px-7 pt-10 pb-6">
            <h1 className="text-[32px] font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
              Join <span className="text-[#FBBF24]">PizzaHub</span>
            </h1>

            <p className="text-[19px] font-bold tracking-wide mt-2 text-amber-50 drop-shadow-sm">
              Order. Enjoy. Repeat.
            </p>

            <p className="text-[13.5px] font-normal text-white/90 mt-2 leading-[1.55] max-w-[250px] drop-shadow-sm">
              Create your account and get started with the best pizza experience!
            </p>

            {/* Extra Highlights */}
            <div className="mt-4 space-y-1.5 text-xs text-amber-50/95 drop-shadow-sm">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                <span>Wood-fired fresh crusts & cheesy toppings</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                <span>Fast hot delivery straight to your door</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                <span>Exclusive member deals & easy restaurant setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Sign Up Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
              <p className="text-xs text-gray-500 mt-1">
                Join PizzaHub and enjoy delicious pizza!
              </p>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/*  Google Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg text-sm transition shadow-sm mb-5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="off"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D91B24] focus:ring-1 focus:ring-[#D91B24]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="signup_email_field"
                    autoComplete="off"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D91B24] focus:ring-1 focus:ring-[#D91B24]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="signup_password_field"
                    autoComplete="new-password"
                    required
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2 text-sm bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D91B24] focus:ring-1 focus:ring-[#D91B24]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Validation */}
                <div className="mt-2 space-y-1 text-[11px]">
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasMinLength ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>Minimum 6 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasUppercase ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>One uppercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasLowercase ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>One lowercase letter</span>
                  </div>
                </div>
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Profile Image <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <label className="border-2 border-dashed border-gray-200 hover:border-[#D91B24]/50 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition bg-gray-50/50">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <>
                      <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-xs font-medium text-gray-600">
                        Upload Profile Image
                      </span>
                      <span className="text-[10px] text-gray-400">PNG, JPG up to 5MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Account Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Vendor Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'vendor' })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-left transition ${
                      formData.role === 'vendor'
                        ? 'border-[#D91B24] bg-red-50/40 text-[#D91B24]'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <ChefHat className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-bold leading-none">Vendor</div>
                      <div className="text-[9px] text-gray-500 mt-0.5">(Restaurant Owner)</div>
                    </div>
                  </button>

                  {/* Customer Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'customer' })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition ${
                      formData.role === 'customer'
                        ? 'border-[#D91B24] bg-red-50/40 text-[#D91B24]'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <User className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-semibold">Customer</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#D91B24] hover:bg-[#b8141c] text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition shadow-md mt-2"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Link */}
            <p className="text-center text-xs text-gray-500 mt-5">
              Already have an account?{' '}
              <a href="/signin" className="text-[#D91B24] font-semibold hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;







 