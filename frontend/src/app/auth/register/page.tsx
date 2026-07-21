"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      toast.success("Registration successful!");
      router.push("/auth/login");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Registration failed. Please try again."
          : "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1628] via-[#0F1F3D] to-[#0A1628] px-4 py-12">
      <div className="glass-card w-full max-w-md p-8 sm:p-10">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
              Create Your Account
            </span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base">
            Join A9 Global for exclusive luxury travel experiences
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="block text-white/80 text-sm font-medium mb-1.5"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30
                         focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                         transition-colors duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-white/80 text-sm font-medium mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30
                         focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                         transition-colors duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-white/80 text-sm font-medium mb-1.5"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="09 123 456 789"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30
                         focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                         transition-colors duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white/80 text-sm font-medium mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30
                         focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                         transition-colors duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-white/80 text-sm font-medium mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30
                         focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                         transition-colors duration-200"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/20 rounded-lg py-2 px-4">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base
                       bg-gradient-to-r from-[#D4AF37] to-[#F5A623]
                       hover:from-[#C4A037] hover:to-[#E59620]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-lg shadow-[#D4AF37]/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Sign In link */}
        <p className="text-center text-white/50 text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#D4AF37] hover:text-[#F5A623] font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
