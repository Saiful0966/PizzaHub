import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo & Name */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 shrink-0">
                            <img
                                src="/pizzahub-logo.png"
                                alt="PizzaHub Logo"
                                className="h-13 w-13 object-contain rounded-full"
                            />
                            <span className="text-xl font-extrabold tracking-tight text-gray-900">
                                Pizza<span className="text-[#D92323]">Hub</span>
                            </span>
                        </Link>
                    </div>

                    {/*  Menu Links */}
                    <div className="hidden md:flex items-center justify-center gap-8 flex-1">
                        <Link href="/" className="text-sm font-semibold text-[#D92323]">
                            Home
                        </Link>
                        <Link href="/browse-menu" className="text-sm font-medium text-gray-600 hover:text-[#D92323] transition-colors">
                            Browse Menu
                        </Link>
                    </div>

                    {/*  Sign In & Sign Up Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/signin"
                            className="text-sm font-semibold text-gray-700 hover:text-[#D92323] px-3 py-2 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="text-sm font-semibold text-white bg-[#D92323] hover:bg-[#b81d1d] px-5 py-2.5 rounded-lg shadow-sm transition-all"
                        >
                            Sign Up
                        </Link>
                    </div>
                    <div className="flex md:hidden items-center">
                        <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;