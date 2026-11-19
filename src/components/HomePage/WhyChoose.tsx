import React from "react";
import { Pizza, ClipboardCheck, MapPin, Tag } from "lucide-react";

const WhyChoosePizzaHub = () => {
  const reasons = [
    {
      title: "Wide Variety",
      subtitle: "Multiple restaurants",
      icon: Pizza,
    },
    {
      title: "Easy Ordering",
      subtitle: "Simple & fast",
      icon: ClipboardCheck,
    },
    {
      title: "Track Your Order",
      subtitle: "Real-time updates",
      icon: MapPin,
    },
    {
      title: "Best Prices",
      subtitle: "Great deals & offers",
      icon: Tag,
    },
  ];

  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section  */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">
          Why Choose PizzaHub?
        </h2>

        {/* Cards  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-red-100 transition-all duration-200 px-6 py-8 flex flex-col items-center text-center"
              >
                {/*  Icon */}
                <div className="mb-3.5 text-[#D92323]">
                  <IconComponent className="h-7 w-7 stroke-[2]" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900">
                  {item.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs text-gray-400 mt-1">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoosePizzaHub;