"use client";

import {useState} from "react";
import {QrCode, Download, ExternalLink, Smartphone, ShieldCheck, LogOut, ArrowRight} from "lucide-react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
    const [platform, setPlatform] = useState<"ios" | "android">("ios");
    const router = useRouter();

    const handleSignOut = async () => {
        await fetch("/api/auth/logout", {method: "POST"});
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-shrwd-bg text-shrwd-text flex flex-col items-center">

            {/* Top Navigation Bar - Now Sticky with Glass Blur */}
            <header
                className="sticky top-0 z-50 w-full bg-shrwd-bg/80 backdrop-blur-md border-b border-shrwd-border/50 flex justify-center">
                <div className="w-full max-w-4xl px-6 py-4 sm:py-5 flex justify-between items-center">
                    <h2 className="text-2xl tracking-tighter text-shrwd-text font-logo lowercase flex items-baseline select-none">
                        shrwd<span className="text-[#50C878] ml-[1px] text-3xl leading-none">.</span>
                    </h2>
                    <button
                        onClick={handleSignOut}
                        className="text-shrwd-subtext hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4"/>
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area - Added pb-24 for bottom breathing room */}
            <main
                className="w-full max-w-2xl px-6 pb-24 flex flex-col items-center mt-6 sm:mt-12 opacity-0 animate-fade-in-up"
                style={{animationDelay: '100ms'}}>

                {/* Header Setup */}
                <div className="text-center mb-10 flex flex-col items-center">
                    <div
                        className="inline-block bg-shrwd-border text-shrwd-text px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 shadow-sm">
                        Latest Build: v1.0.0-beta.2
                    </div>

                    {/* Link to Changelog */}
                    <Link href="/releases"
                          className="text-xs font-semibold text-shrwd-subtext hover:text-white transition-colors flex items-center gap-1 mb-8">
                        View Release History <ArrowRight className="w-3 h-3"/>
                    </Link>

                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-shrwd-text">
                        Install the App
                    </h1>
                    <p className="text-shrwd-subtext text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                        Select your operating system below to get the latest beta version of SHRWD on your device.
                    </p>
                </div>

                {/* Platform Toggle */}
                <div className="bg-shrwd-card p-1 rounded-xl border border-shrwd-border flex w-full max-w-sm mb-8">
                    <button
                        onClick={() => setPlatform("ios")}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex justify-center items-center gap-2 ${
                            platform === "ios"
                                ? "bg-shrwd-border text-white shadow-sm"
                                : "text-shrwd-subtext hover:text-white"
                        }`}
                    >
                        <Smartphone className="w-4 h-4"/>
                        iOS (Apple)
                    </button>
                    <button
                        onClick={() => setPlatform("android")}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex justify-center items-center gap-2 ${
                            platform === "android"
                                ? "bg-shrwd-border text-white shadow-sm"
                                : "text-shrwd-subtext hover:text-white"
                        }`}
                    >
                        <Download className="w-4 h-4"/>
                        Android
                    </button>
                </div>

                {/* Instructions Card */}
                <div className="w-full bg-shrwd-card border border-shrwd-border rounded-2xl p-6 sm:p-8 shadow-xl">

                    {/* --- iOS INSTRUCTIONS (PENDING) --- */}
                    {platform === "ios" && (
                        <div className="flex flex-col animate-fade-in-up items-center text-center py-8" style={{ animationDuration: '0.4s' }}>
                            <div className="w-16 h-16 rounded-full bg-shrwd-border flex items-center justify-center mb-6">
                                <Smartphone className="w-8 h-8 text-shrwd-subtext" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">iOS Build in Progress</h3>
                            <p className="text-shrwd-subtext text-sm max-w-sm leading-relaxed mb-8">
                                The iOS version of SHRWD is currently undergoing native architecture refinements. Distribution to Apple devices will be unlocked in a future testing phase.
                            </p>
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-shrwd-border rounded-lg px-4 py-2 text-xs font-bold tracking-widest text-shrwd-muted uppercase">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                                Status: In Development
                            </div>
                        </div>
                    )}

                    {/* --- ANDROID INSTRUCTIONS --- */}
                    {platform === "android" && (
                        <div className="flex flex-col animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
                            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">

                                {/* DESKTOP ONLY: QR Code for APK */}
                                <div className="hidden sm:flex flex-col items-center gap-4 w-48 flex-shrink-0">
                                    <div className="w-48 h-48 bg-white rounded-xl p-3 shadow-inner flex items-center justify-center">
                                        <img
                                            src="/shrwd-qr.png"
                                            alt="Scan to download APK"
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    </div>
                                    <p className="text-xs text-shrwd-subtext font-medium text-center leading-relaxed">
                                        Scan with your Android camera to download directly to your phone.
                                    </p>
                                </div>

                                {/* Steps & Button */}
                                <div className="flex flex-col gap-8 w-full">
                                    {/* Steps */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-3">
                                            <div className="w-10 h-10 rounded-full bg-shrwd-border flex items-center justify-center text-white mb-1">
                                                <Download className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-semibold text-white">1. Download APK</h3>
                                            <p className="text-sm text-shrwd-subtext leading-relaxed">Download the raw Android Package Kit to your device.</p>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="w-10 h-10 rounded-full bg-shrwd-border flex items-center justify-center text-white mb-1">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-semibold text-white">2. Allow Install</h3>
                                            <p className="text-sm text-shrwd-subtext leading-relaxed">If prompted, allow installation from unknown sources.</p>
                                        </div>
                                    </div>

                                    {/* Big Download Button */}
                                    <div className="w-full pt-6 border-t border-shrwd-border">
                                        <a
                                            href="/shrwd.apk"
                                            download
                                            className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg"
                                        >
                                            <Download className="w-5 h-5" />
                                            <span>Download APK</span>
                                        </a>

                                        {/* Clean, consolidated metadata */}
                                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-shrwd-muted font-medium">
                                            <span>v1.0.0-beta.2</span>
                                            <span className="w-1 h-1 rounded-full bg-shrwd-border"></span>
                                            <span>~88MB</span>
                                            <span className="w-1 h-1 rounded-full bg-shrwd-border"></span>
                                            <span>Android 10+</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </main>

        </div>
    );
}