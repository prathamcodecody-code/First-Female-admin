"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/admin/login", { email, password });

      localStorage.setItem("admin_token", res.data.token);
      document.cookie = `admin_token=${res.data.token}; path=/;`;

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid admin credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-8">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-brandPink/10 flex items-center justify-center mb-3">
            <ShieldCheck className="text-brandPink" size={26} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your store
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@firstfemale.in"
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5
                       focus:outline-none focus:ring-2 focus:ring-brandPink/40"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10
                         focus:outline-none focus:ring-2 focus:ring-brandPink/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className="
            w-full flex items-center justify-center gap-2
            bg-brandPink text-white font-semibold
            py-2.5 rounded-lg
            hover:bg-brandPinkLight
            transition disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* FOOTER */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © {new Date().getFullYear()} FirstFemale Admin
        </p>
      </div>
    </div>
  );
}
