import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#240907] text-gray-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 items-start">
          
          {/*  Logo  */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/pizzahub-logo.png"
                alt="PizzaHub Logo"
                className="h-9 w-9 object-contain rounded-full"
              />
              <span className="text-xl font-extrabold tracking-tight text-white">
                Pizza<span className="text-[#D92323]">Hub</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xs">
              Fresh pizza, fast delivery, happy customers. <br />
              Your favorite pizza place is just a click away!
            </p>
          </div>

          {/*  Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3.5">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/browse-menu"
                  className="hover:text-white transition-colors"
                >
                  Browse Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/*  Contact Us */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3.5">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#D92323] shrink-0 mt-0.5" />
                <span>123 PizzaHub Street, Food City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#D92323] shrink-0" />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#D92323] shrink-0" />
                <span>support@pizzahub.com</span>
              </li>
            </ul>
          </div>

          {/*  Follow Us & Copyright */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3.5">
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#D92323] flex items-center justify-center text-white transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>

                <a
                  href="#"
                  aria-label="Twitter"
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#D92323] flex items-center justify-center text-white transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#D92323] flex items-center justify-center text-white transition-colors"
                >
                  <svg
                    className="h-4 w-4 stroke-current fill-none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                <a
                  href="#"
                  aria-label="YouTube"
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#D92323] flex items-center justify-center text-white transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              &copy; 2026 PizzaHub. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;