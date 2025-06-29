import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("username");
    if (token && name) {
      setUser({ name });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-6 bg-white shadow-2xs sticky top-0 z-1">
      <img
        src={assets.logo}
        alt="VyapaarBuddy Logo"
        className="h-[55px] pl-15 w-auto cursor-pointer object-contain"
        onClick={() => navigate("/")}
      />

      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-[#1E1E2D] text-white px-4 py-2 rounded-full shadow"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-white text-[#1E1E2D] font-bold rounded-full">
              {user.name?.[0]?.toUpperCase()}
            </div>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-fade-in transition-all duration-200">
              <div className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                👋 Hello, {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/auth")}
          className="bg-[#1E1E2D] hover:bg-[#2f2f46] text-white px-5 py-2 rounded-xl font-medium transition"
        >
          Login / Register
        </button>
      )}
    </header>
  );
}
