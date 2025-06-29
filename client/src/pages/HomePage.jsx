import { useNavigate } from "react-router-dom";

import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import WhytoChoose from "../components/WhytoChoose";
import TransformBusiness from "../components/TransformBussiness";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1E1E2D] font-sans">
      <HeroSection />

      <FeaturesSection />

      <WhytoChoose />

      <TransformBusiness />

      {/* Footer */}
      <footer className="bg-[#1E1E2D] py-6 text-center text-white ">
        © {new Date().getFullYear()} VyapaarBuddy. All rights reserved.
      </footer>
    </div>
  );
}
