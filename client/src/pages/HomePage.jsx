import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import WhytoChoose from "../components/WhytoChoose";
import TransformBusiness from "../components/TransformBussiness";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>VyapaarBuddy – Smart Business Management</title>
        <meta
          name="description"
          content="Manage billing, GST invoices, inventory, and ledgers in one place with VyapaarBuddy."
        />
        <meta property="og:title" content="VyapaarBuddy" />
        <meta
          property="og:description"
          content="Billing, Inventory, GST invoices, ledgers, all in one place."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vyapaarbuddy.store" />
      </Helmet>
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
    </>
  );
}
