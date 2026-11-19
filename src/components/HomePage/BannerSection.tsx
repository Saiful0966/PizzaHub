import React from "react";
import { Flame, Star, ShieldCheck, Headphones } from "lucide-react";


const HeroBanner = () => {
  const features = [
    {
      title: "Fast Delivery",
      subtitle: "Hot & Fresh",
      icon: Flame,
    },
    {
      title: "Top Rated",
      subtitle: "Best Restaurants",
      icon: Star,
    },
    {
      title: "Secure Payment",
      subtitle: "100% Safe",
      icon: ShieldCheck,
    },
    {
      title: "24/7 Support",
      subtitle: "We're Here",
      icon: Headphones,
    },
  ];

  return (
    <section className="w-full bg-white">
      {/* Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative w-full min-h-[400px] md:min-h-[460px] rounded-2xl overflow-hidden flex items-center shadow-md bg-[#2a0808]">
          <img
            src="/pizzahub-banner.png"
            alt="Fresh Pizza Delivered to Your Door"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 max-w-xl px-6 sm:px-10 md:px-14 py-12 text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Fresh Pizza
              <span className="block text-white mt-1">
                Delivered to Your Door
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-gray-200 leading-relaxed max-w-md">
              Discover the best pizza shops near you. Order your favorite pizza
              and enjoy fast &amp; reliable delivery.
            </p>
          </div>
        </div>
      </div>

      {/*  Features Strip Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <IconComponent className="h-5 w-5 text-[#D92323]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};



export default HeroBanner;