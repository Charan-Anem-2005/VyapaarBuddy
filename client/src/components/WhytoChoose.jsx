import { CheckCircle, ArrowRight, User, Zap, Star, Shield } from "lucide-react";

const WhytoChoose = () => {
  return (
    <>
      <section className="bg-[#f9fafb] py-40 px-6 mb-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Side */}
          <div className="flex-1">
            <h2 className="text-6xl md:text-6xl font-bold text-[#1E1E2D] mb-10">
              Why Choose{" "}
              <span className="text-[#1E1E2D]">
                Vyapaar<span className="text-[#fabd05]">Buddy</span>?
              </span>
            </h2>
            <ul className="space-y-6 mb-8">
              {[
                "Made specifically for Indian businesses",
                "No complicated setups — just login and start",
                "100% cloud-based and mobile-friendly",
                "Perfect for small & medium enterprises",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-[#1E1E2D]"
                >
                  <CheckCircle size={25} className="text-[#fabd05] mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="bg-[#fabd05] text-[#1E1E2D] px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-yellow-400 transition">
              Get Started Today <ArrowRight size={20} />
            </button>
          </div>

          {/* Right Side Card */}
          <div className="flex-1 bg-white rounded-xl shadow-lg pb-6  border border-gray-100 relative">
            <div className="bg-gradient-to-r from-[#1E1E2D] to-[#2c2c40] text-white px-5 py-5 rounded-t-md font-semibold text-2xl top-0 flex items-center gap-2">
              <User size={25} /> Perfect for Indian Businesses
            </div>
            <div className="p-4 md:p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="bg-[#fad462]  p-2 rounded-md">
                  <Zap size={25} className="text-[#1E1E2D]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E1E2D]">Quick Setup</p>
                  <p className="text-sm text-gray-500">
                    Start in minutes, not hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#fad462]  p-2 rounded-md">
                  <Star size={25} className="text-[#1E1E2D]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E1E2D]">5-Star Support</p>
                  <p className="text-sm text-gray-500">
                    Hindi & English support
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#fad462] p-2 rounded-md">
                  <Shield size={25} className="text-[#1E1E2D]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E1E2D]">
                    Secure & Reliable
                  </p>
                  <p className="text-sm text-gray-500">Bank-level security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhytoChoose;
