import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TransformBusiness() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#1E1E2D] text-white py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-8">
          Join thousands of Indian businesses already using{" "}
          <span className="text-[#fabd05] font-medium">VyapaarBuddy</span> to
          streamline their operations and boost growth.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="bg-[#fabd05] text-[#1E1E2D] px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-yellow-400 transition"
          >
            Register Now - It's Free! <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="bg-white text-[#1E1E2D] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Login to Existing Account
          </button>
        </div>

        <p className="text-sm text-gray-400">
          No setup fees • No hidden charges • Cancel anytime
        </p>
      </div>
    </section>
  );
}
