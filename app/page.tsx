"use client";

import { useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BetaPortalLogin() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // <-- 2. INITIALIZE ROUTER

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      // 3. CALL THE REAL API
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (response.ok) {
        // Success! The API set the cookie. Route to the dashboard.
        router.push('/dashboard');
      } else {
        // Failed
        setError(true);
        setLoading(false);
        setTimeout(() => setError(false), 2000);
      }
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-shrwd-bg relative overflow-hidden">

        {/* The Central Authentication Card */}
        <div className="w-full max-w-[400px] flex flex-col opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>

          {/* Adaptive padding: p-6 on mobile, p-8 on desktop */}
          <div className="bg-shrwd-card border border-shrwd-border rounded-2xl p-6 sm:p-8 shadow-2xl">

            {/* Card Header (Centered Symmetry) */}
            <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">

              {/* SHRWD Logo with the #50C878 Dot */}
              <h2 className="text-3xl tracking-tighter text-shrwd-text font-logo lowercase flex items-baseline select-none mb-6">
                shrwd<span className="text-[#50C878] ml-[1px] text-4xl leading-none">.</span>
              </h2>

              {/* Subtle Brighter Divider */}
              <div className="w-12 h-[1px] bg-shrwd-muted mb-6 opacity-70"></div>

              <h1 className="text-lg sm:text-xl font-semibold tracking-tight mb-2 text-gray-300">
                Developer Access
              </h1>
              <p className="text-shrwd-subtext text-sm leading-relaxed px-2 sm:px-4">
                Beta distribution portal. Enter your access key to continue.
              </p>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleAuthenticate} className="w-full flex flex-col gap-5 sm:gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-shrwd-subtext uppercase tracking-wider">
                  Access Key
                </label>
                <div className="relative">
                  <input
                      type="text"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                      placeholder="Enter key"
                      disabled={loading}
                      autoFocus
                      /* text-base on mobile prevents iOS zoom, sm:text-sm keeps desktop sleek */
                      className={`w-full bg-shrwd-bg border ${
                          error ? "border-red-900 focus:border-red-500" : "border-shrwd-border focus:border-shrwd-border-hover"
                      } text-shrwd-text px-4 py-3.5 sm:py-3 rounded-xl outline-none transition-all font-mono tracking-widest uppercase placeholder:text-shrwd-muted text-base sm:text-sm shadow-inner text-center`}
                  />
                  {error && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>

              <button
                  type="submit"
                  disabled={!passcode || loading}
                  className="w-full bg-shrwd-text hover:bg-gray-200 text-black font-semibold py-3.5 sm:py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <span>{loading ? "Authenticating..." : "Continue"}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Branding (Stacked) */}
        {/*<div className="pt-12 absolute bottom-8 sm:bottom-10 opacity-0 animate-fade-in-up flex flex-col items-center gap-1.5" style={{ animationDelay: '400ms' }}>*/}
        {/*  <p className="text-[10px] tracking-[0.15em] text-shrwd-subtext font-brand select-none">*/}
        {/*    GuardedCliffs*/}
        {/*  </p>*/}
        {/*  <p className="text-[8px] tracking-widest text-shrwd-muted select-none uppercase">*/}
        {/*    Copyright © 2026*/}
        {/*  </p>*/}
        {/*</div>*/}

      </main>
  );
}