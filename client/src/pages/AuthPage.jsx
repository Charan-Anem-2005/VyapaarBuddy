import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./Api";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const route = mode === "login" ? "/auth/login" : "/auth/register";
    const body =
      mode === "login" ? { email, password } : { name, email, password };

    try {
      const { data } = await API.post(route, body);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.name);
      toast.success(`Welcome ${data.user.name}`);
      navigate("/account");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Authentication failed, please try again"
      );
    }
  };

  const onGoogle = async (cred) => {
    try {
      const { data } = await API.post("/auth/google-login", {
        token: cred.credential,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.name);
      toast.success(`Welcome ${data.user.name}`);
      navigate("/account");
    } catch {
      toast.error("Google login failed, please try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-gray-100">
        <img
          src={assets.logo}
          alt="Logo"
          className="h-16 w-auto object-contain m-auto mb-7"
        />
        <h2 className="text-3xl font-bold text-center text-[#1E1E2D]">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fabd05]"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fabd05]"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fabd05]"
          />
          <button
            type="submit"
            className="w-full bg-[#1E1E2D] text-white py-3 rounded-md hover:bg-[#343449] transition"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-[#fabd05] font-medium hover:underline"
          >
            {mode === "login" ? "Register here" : "Login"}
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          <span>OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={onGoogle}
            onError={() => alert("Google login failed")}
          />
        </div>
      </div>
    </div>
  );
}
