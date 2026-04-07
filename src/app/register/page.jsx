"use client";

import React, { useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { useAuthStore } from "../../store/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    
    setIsLoading(true);
    // Simulate network delay for effect
    setTimeout(() => {
      // For this dummy logic, registering automatically logs you in
      login(email);
      window.location.href = "/";
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[url('https://raw.createusercontent.com/be84bc4b-495b-44a7-94a0-32ee6dc4938c/')] bg-cover opacity-10 blur-sm pointer-events-none" />

      {/* Header Back Button */}
      <a href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10">
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back to Home</span>
      </a>

      <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl z-10 relative">
        <div className="flex flex-col items-center gap-1 mb-10">
          <div className="h-14 w-14 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 mb-4">
            <Play size={28} fill="#e50914" stroke="#e50914" />
          </div>
          <span className="text-white font-black text-3xl tracking-tighter uppercase italic leading-none">
            LK21
          </span>
          <span className="text-[10px] font-bold text-[#e50914] tracking-widest uppercase text-center">
            OFFICIAL
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#e50914] transition-colors"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#e50914] transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#e50914] transition-colors"
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full bg-[#e50914] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-white hover:underline transition-all">Sign in.</a>
        </div>
      </div>
    </div>
  );
}
