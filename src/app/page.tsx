import Image from "next/image";
import BannerSection from "@/components/HomePage/BannerSection";
import WhyChoose from "@/components/HomePage/WhyChoose";
import UpcomingSection from "@/components/UpcomingSection";

export default function Home() {
  return (
  <div>
      <BannerSection />
      <UpcomingSection/>
      <WhyChoose />
    </div>
  );
}
