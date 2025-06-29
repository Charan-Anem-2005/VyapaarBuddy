import React from "react";

import {
  ArrowRight,
  Play,
  Smile,
  IndianRupee,
  Signal,
  Headphones,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="text-center px-6 py-20 pt-35 max-w-5xl mx-auto relative">
        {/* Tagline */}
        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-yellow-200/30 text-yellow-900 text-xs font-medium border-2 border-yellow-300/20">
          🧠 Your Smart Business Companion
        </div>

        {/* Heading */}
        <h1 className="text-6xl sm:text-6xl font-bold leading-snug text-[#1E1E2D] mb-4">
          Simplify Your Business Operations with{" "}
          <span className="text-[#1E1E2D]">
            Vyapaar<span className="text-[#fabd05]">Buddy</span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-2xl sm:text-lg text-gray-600 max-w-4xs mx-auto mb-8">
          The all-in-one platform for Indian businesses to manage inventory,
          generate GST invoices, track finances, and grow — all from one
          dashboard.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={() => navigate("/auth")}
            className="bg-[#1E1E2D] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[#2a2a4b] transition flex items-center gap-2"
          >
            Start Free Trial <ArrowRight size={25} />
          </button>
          <button className="border border-[#1E1E2D] text-[#1E1E2D] px-5 py-2.5 rounded-md font-medium hover:bg-gray-100 transition flex items-center gap-2">
            <Play size={25} /> Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 text-center text-[#1E1E2D] text-sm sm:text-base">
          <div className="flex flex-col items-center gap-1">
            <Smile className="text-[#fabd05]" size={35} />
            <p className="font-semibold text-2xl">10,000+</p>
            <p className="text-gray-500 text-1xl">Happy Businesses</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <IndianRupee className="text-[#fabd05]" size={35} />
            <p className="font-semibold text-2xl">₹50L+</p>
            <p className="text-gray-500 text-1xl">Transactions Processed</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Signal className="text-[#fabd05]" size={35} />
            <p className="font-semibold text-2xl">99.9%</p>
            <p className="text-gray-500 text-1xl">Uptime Guarantee</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Headphones className="text-[#fabd05]" size={35} />
            <p className="font-semibold text-2xl">35/7</p>
            <p className="text-gray-500 text-1xl">Support Available</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
