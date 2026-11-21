// 'use client';

// import React, { useState } from 'react';
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   Flame,
//   Clock,
//   Sparkles,
// } from 'lucide-react';

// const SignIn = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('Sign In Submitted:', formData);
    
//   };

//   return (
//     <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center p-4 md:p-8 font-sans">
//       {/* Main Card Container */}
//       <div className="w-full max-w-4xl min-h-[840px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-gray-100">
        
//         {/* Left Side  Centered Pizza Banner & Text */}
//         <div className="md:col-span-5 relative bg-[#3D0505] text-white flex flex-col justify-start overflow-hidden min-h-[620px] md:h-full">
//           <img
//             src="/signUp-logo.png"
//             alt="PizzaHub Banner"
//             className="absolute inset-0 w-full h-full object-cover object-[center_65%]"
//           />
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{
//               background:
//                 'linear-gradient(180deg, rgba(35, 2, 2, 0.88) 0%, rgba(45, 4, 4, 0.72) 48%, rgba(25, 2, 2, 0.12) 80%, rgba(0, 0, 0, 0.18) 100%)',
//             }}
//           />

//           {/* Text Positioned  */}
//           <div className="relative z-10 px-7 pt-12 pb-8">
//             <h1 className="text-[34px] font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
//               Welcome <span className="text-[#FBBF24]">Back!</span>
//             </h1>

//             <p className="text-[14px] font-normal text-white/90 mt-3 leading-[1.6] max-w-[255px] drop-shadow-sm">
//               Sign in to your PizzaHub account and continue your delicious journey!
//             </p>

//             {/* Extra Highlights */}
//             <div className="mt-5 space-y-2 text-xs text-amber-50/95 drop-shadow-sm">
//               <div className="flex items-center gap-2">
//                 <Flame className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
//                 <span>Freshly baked slices waiting for you</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
//                 <span>Track live orders & quick reorder</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
//                 <span>Manage menus or unlock hot rewards</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side  Sign In Form */}
//         <div className="md:col-span-7 p-6 sm:p-10 md:py-16 flex flex-col justify-center">
//           <div className="max-w-md w-full mx-auto">
//             {/* Icon */}
//             <div className="flex justify-center mb-3">
//               <span className="text-4xl select-none" role="img" aria-label="Pizza Slice">
//                 🍕
//               </span>
//             </div>

//             {/* Header */}
//             <div className="text-center mb-7">
//               <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
//               <p className="text-xs text-gray-500 mt-1">
//                 Welcome back! Please sign in to continue.
//               </p>
//             </div>

//             {/* Divider */}
//             <div className="relative flex py-2 items-center mb-5">
//               <div className="flex-grow border-t border-gray-200"></div>
//               <span className="flex-shrink mx-3 text-xs text-gray-400 font-medium">OR</span>
//               <div className="flex-grow border-t border-gray-200"></div>
//             </div>

//             {/*  Google Button */}
//             <button
//               type="button"
//               className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg text-sm transition shadow-sm mb-6"
//             >
//               <svg className="w-4 h-4" viewBox="0 0 24 24">
//                 <path
//                   fill="#4285F4"
//                   d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
//                 />
//                 <path
//                   fill="#34A853"
//                   d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
//                 />
//                 <path
//                   fill="#FBBC05"
//                   d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
//                 />
//                 <path
//                   fill="#EA4335"
//                   d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
//                 />
//               </svg>
//               Continue with Google
//             </button>

//             {/* Form */}
//             <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
//               {/* Email */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="email"
//                     name="signin_email_field"
//                     autoComplete="off"
//                     required
//                     placeholder="Enter your email address"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="w-full pl-9 pr-3 py-2.5 text-sm bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D91B24] focus:ring-1 focus:ring-[#D91B24]"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="signin_password_field"
//                     autoComplete="current-password"
//                     required
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     className="w-full pl-9 pr-10 py-2.5 text-sm bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D91B24] focus:ring-1 focus:ring-[#D91B24]"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Forgot password */}
//               <div className="flex items-center justify-between text-xs pt-0.5">
//                 <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
//                   <input
//                     type="checkbox"
//                     checked={formData.rememberMe}
//                     onChange={(e) =>
//                       setFormData({ ...formData, rememberMe: e.target.checked })
//                     }
//                     className="w-3.5 h-3.5 rounded border-gray-300 text-[#D91B24] focus:ring-[#D91B24]"
//                   />
//                   <span>Remember me</span>
//                 </label>

//                 <a
//                   href="/forgot-password"
//                   className="text-[#D91B24] font-semibold hover:underline"
//                 >
//                   Forgot password?
//                 </a>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-[#D91B24] hover:bg-[#b8141c] text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition shadow-md mt-2"
//               >
//                 <span>Sign In</span>
//                 <ArrowRight className="w-4 h-4" />
//               </button>
//             </form>

//             {/* Footer Link */}
//             <p className="text-center text-xs text-gray-500 mt-6">
//               Don&apos;t have an account?{' '}
//               <a href="/signup" className="text-[#D91B24] font-semibold hover:underline">
//                 Sign Up
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   Flame,
//   Clock,
//   Sparkles,
// } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';
// import { authClient } from '@/lib/auth-client';

// const SignIn = () => {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const loadingToast = toast.loading('Signing in...');

//     try {
//       const { data, error } = await authClient.signIn.email({
//         email: formData.email,
//         password: formData.password,
//         rememberMe: formData.rememberMe,
//         callbackURL: '/',
//       });

//       toast.dismiss(loadingToast);

//       if (error) {
//         toast.error(error.message || 'Invalid email or password');
//         return;
//       }

//       console.log('Better Auth SignIn Success:', data);
//       toast.success('Signed in successfully!');
//       router.push('/');
//       router.refresh();
//     } catch {
//       toast.dismiss(loadingToast);
//       toast.error('Something went wrong. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center p-4 md:p-8 font-sans">
//       <Toaster position="top-right" reverseOrder={false} />

//       {/* Main Card Container */}
//       <div className="w-full max-w-4xl min-h-[840px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-gray-100">
        
//         {/* Left Side Centered Pizza Banner & Text */}
//         <div className="md:col-span-5 relative bg-[#3D0505] text-white flex flex-col justify-start overflow-hidden min-h-[620px] md:h-full">
//           <img
//             src="/signUp-logo.png"
//             alt="PizzaHub Banner"
//             className="absolute inset-0 w-full h-full object-cover object-[center_65%]"
//           />
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{
//               background:
//                 'linear-gradient(180deg, rgba(35, 2, 2, 0.88) 0%, rgba(45, 4, 4, 0.72) 48%, rgba(25, 2, 2, 0.12) 80%, rgba(0, 0, 0, 0.18) 100%)',
//             }}
//           />

//           {/* Text Positioned */}
//           <div className="relative z-10 px-7 pt-12 pb-8">
//             <h1 className="text-[34px] font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
//               Welcome <span className="text-[#FBBF24]">Back!</span>
//             </h1>

//             <p className="text-[14px] font-normal text-white/90 mt-3 leading-[1.6] max-w-[255px] drop-shadow-sm">
//               Sign in to your PizzaHub account and continue your delicious journey!
//             </p>

//             {/* Extra Highlights */}
//             <div className="mt-5 space-y-2 text-xs text-amber-50/95 drop-shadow-sm">
//               <div className="flex items-center gap-2">
//                 <Flame className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
//                 <span>Freshly baked slices waiting for you</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
//                 <span>Track live orders & quick reorder</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
//                 <span>Manage menus or unlock hot rewards</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side Sign In Form */}
//         <div className="md:col-span-7 p-6 sm:p-10 md:py-16 flex flex-col justify-center">
//           <div className="max-w-md w-full mx-auto">
//             {/* Icon */}
//             <div className="flex justify-center mb-3">
//               <span className="text-4xl select-none" role="img" aria-label="Pizza Slice">
//                 🍕
//               </span>
//             </div>

//             {/* Header */}
//             <div className="text-center mb-7">
//               <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
//               <p className="text-xs text-gray-500 mt-1">
//                 Welcome back! Please sign in to continue.
//               </p>
//             </div>

//             {/* Divider */}
//             <div className="relative flex py-2 items-center mb-5">
//               <div className="flex-grow border-t border-gray-200"></div>
//               <span className="flex-shrink mx-3 text-xs text-gray-400 font-medium">OR</span>
//               <div className="flex-grow border-t border-gray-200"></div>
//             </div>

//             {/* Google Button */}
//             <button
//               type="button"
//               className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg text-sm transition shadow-sm mb-6"
//             >
//               <svg className="w-4 h-4" viewBox="0 0 24 24">
//                 <path
//                   fill="#4285F4"
//                   d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
//                 />
//                 <path
//                   fill="#34A853"
//                   d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
//                 />
//                 <path
//                   fill="#FBBC05"
//                   d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
//                 />
//                 <path
//                   fill="#EA4335"
//                   d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
//                 />
//               </svg>
//               Continue with Google
//             </button>

//             {/* Form */}
//             <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
//               {/* Email */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="email"
//                     name="signin_email_field"
//                     autoComplete="off"
//                     required
//                     placeholder="Enter your email address"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="w-full pl-9 pr-3 py-2.5 text-sm bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D91B24] focus:ring-1 focus:ring-[#D91B24]"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="signin_password_field"
//                     autoComplete="current-password"
//                     required
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     className="w-full pl-9 pr-10 py-2.5 text-sm bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D91B24] focus:ring-1 focus:ring-[#D91B24]"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Forgot password */}
//               <div className="flex items-center justify-between text-xs pt-0.5">
//                 <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
//                   <input
//                     type="checkbox"
//                     checked={formData.rememberMe}
//                     onChange={(e) =>
//                       setFormData({ ...formData, rememberMe: e.target.checked })
//                     }
//                     className="w-3.5 h-3.5 rounded border-gray-300 text-[#D91B24] focus:ring-[#D91B24]"
//                   />
//                   <span>Remember me</span>
//                 </label>

//                 <a
//                   href="/forgot-password"
//                   className="text-[#D91B24] font-semibold hover:underline"
//                 >
//                   Forgot password?
//                 </a>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-[#D91B24] hover:bg-[#b8141c] disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition shadow-md mt-2"
//               >
//                 <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
//                 <ArrowRight className="w-4 h-4" />
//               </button>
//             </form>

//             {/* Footer Link */}
//             <p className="text-center text-xs text-gray-500 mt-6">
//               Don&apos;t have an account?{' '}
//               <a href="/signup" className="text-[#D91B24] font-semibold hover:underline">
//                 Sign Up
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;




















'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const SignIn = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading('Signing in...');

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: '/',
      });

      toast.dismiss(loadingToast);

      if (error) {
        toast.error(error.message || 'Invalid email or password');
        return;
      }

      console.log('Better Auth SignIn Success:', data);
      toast.success('Signed in successfully!');
      router.push('/');
      router.refresh();
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FDF8F5] flex items-center justify-center py-17 px-4 md:px-6 font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Main Card Container */}
      <div className="w-full max-w-4xl md:min-h-[640px] bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-gray-100">
        
        {/* Left Side Centered Pizza Banner & Text */}
        <div className="md:col-span-5 relative bg-[#3D0505] text-white flex flex-col justify-start overflow-hidden min-h-[420px] md:h-full">
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

          {/* Text Positioned */}
          <div className="relative z-10 px-7 pt-10 pb-6">
            <h1 className="text-[30px] font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
              Welcome <span className="text-[#FBBF24]">Back!</span>
            </h1>

            <p className="text-[13px] font-normal text-white/90 mt-2 leading-[1.55] max-w-[245px] drop-shadow-sm">
              Sign in to your PizzaHub account and continue your delicious journey!
            </p>

            {/* Extra Highlights */}
            <div className="mt-4 space-y-2 text-xs text-amber-50/95 drop-shadow-sm">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                <span>Freshly baked slices waiting for you</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                <span>Track live orders & quick reorder</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                <span>Manage menus or unlock hot rewards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Sign In Form */}
        <div className="md:col-span-7 p-6 sm:p-8 md:py-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Icon */}
            <div className="flex justify-center mb-2">
              <span className="text-3xl select-none" role="img" aria-label="Pizza Slice">
                🍕
              </span>
            </div>

            {/* Header */}
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
              <p className="text-xs text-gray-500 mt-1">
                Welcome back! Please sign in to continue.
              </p>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-medium">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Button */}
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
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="signin_email_field"
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
                    name="signin_password_field"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
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
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#D91B24] focus:ring-[#D91B24]"
                  />
                  <span>Remember me</span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-[#D91B24] font-semibold hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D91B24] hover:bg-[#b8141c] disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition shadow-md mt-1"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Link */}
            <p className="text-center text-xs text-gray-500 mt-5">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-[#D91B24] font-semibold hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;