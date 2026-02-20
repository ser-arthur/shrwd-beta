"use client";

import { useState } from "react";
import { QrCode, Download, ExternalLink, Smartphone, ShieldCheck, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {ArrowRight} from "lucide-react";

export default function DashboardPage() {
    const [platform, setPlatform] = useState<"ios" | "android">("ios");
    const router = useRouter();

    const handleSignOut = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-shrwd-bg text-shrwd-text flex flex-col items-center">

            {/* Top Navigation Bar */}
            <header className="w-full max-w-4xl px-6 py-8 flex justify-between items-center">
                <h2 className="text-2xl tracking-tighter text-shrwd-text font-logo lowercase flex items-baseline select-none">
                    shrwd<span className="text-[#50C878] ml-[1px] text-3xl leading-none">.</span>
                </h2>
                <button
                    onClick={handleSignOut}
                    className="text-shrwd-subtext hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                </button>
            </header>

            {/* Main Content Area */}
            <main className="w-full max-w-2xl px-6 flex flex-col items-center mt-4 sm:mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

                {/* Header Setup */}
                <div className="text-center mb-10 flex flex-col items-center">
                    <div className="inline-block bg-shrwd-border text-shrwd-text px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 shadow-sm">
                        Latest Build: v1.0.0-beta.2
                    </div>

                    {/* NEW: Link to Changelog */}
                    <Link href="/releases" className="text-xs font-semibold text-shrwd-subtext hover:text-white transition-colors flex items-center gap-1 mb-8">
                        View Release History <ArrowRight className="w-3 h-3" />
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
                        <Smartphone className="w-4 h-4" />
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
                        <Download className="w-4 h-4" />
                        Android
                    </button>
                </div>

                {/* Instructions Card */}
                <div className="w-full bg-shrwd-card border border-shrwd-border rounded-2xl p-6 sm:p-8 shadow-xl mb-10 sm:mb-2">

                    {/* --- iOS INSTRUCTIONS --- */}
                    {platform === "ios" && (
                        <div className="flex flex-col animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">

                                {/* DESKTOP ONLY: QR Code Placeholder */}
                                <div className="hidden sm:flex w-48 h-48 bg-white rounded-xl p-3 flex-shrink-0 items-center justify-center">
                                    <div className="w-full h-full border-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                                        <QrCode className="w-12 h-12 mb-2 text-black" />
                                        <span className="text-xs font-bold text-black uppercase tracking-widest">QR Code Here</span>
                                    </div>
                                </div>

                                {/* Steps */}
                                <div className="flex flex-col gap-6 w-full">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-shrwd-border flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Get Expo Go</h3>
                                            <p className="text-sm text-shrwd-subtext leading-relaxed mb-2">Download the official Expo Go client from the iOS App Store to run the development build.</p>
                                            <a href="https://apps.apple.com/us/app/expo-go/id982107779" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-gray-300 transition-colors uppercase tracking-wider">
                                                Open App Store <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-shrwd-border flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Launch the App</h3>
                                            <p className="text-sm text-shrwd-subtext leading-relaxed">
                                                <span className="hidden sm:inline">Open your iPhone's camera and scan the QR code to the left to launch SHRWD.</span>
                                                <span className="sm:hidden">Tap the button below to instantly launch SHRWD inside your installed Expo app.</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* MOBILE ONLY: Deep Link Button (Moved to the bottom!) */}
                                    <div className="w-full sm:hidden pt-4 border-t border-shrwd-border mt-2">
                                        <a
                                            href="exp://u.expo.dev/update/YOUR-EXPO-ID"
                                            className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg"
                                        >
                                            <Smartphone className="w-5 h-5" />
                                            Open in Expo Go
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* --- ANDROID INSTRUCTIONS --- */}
                    {platform === "android" && (
                        <div className="flex flex-col animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
                            <div className="flex flex-col gap-8">
                                {/* Steps */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-3">
                                        <div className="w-10 h-10 rounded-full bg-shrwd-border flex items-center justify-center text-white mb-2">
                                            <Download className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-white">1. Download APK</h3>
                                        <p className="text-sm text-shrwd-subtext leading-relaxed">Download the raw Android Package Kit directly to your device.</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="w-10 h-10 rounded-full bg-shrwd-border flex items-center justify-center text-white mb-2">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-white">2. Allow Install</h3>
                                        <p className="text-sm text-shrwd-subtext leading-relaxed">If prompted, tap "Settings" and allow installation from unknown sources.</p>
                                    </div>
                                </div>

                                {/* Big Download Button */}
                                <div className="w-full pt-6 border-t border-shrwd-border mt-2">
                                    <a
                                        href="/shrwd.apk"
                                        download
                                        className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download APK
                                    </a>

                                    {/* Clean, consolidated metadata */}
                                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-shrwd-muted font-medium">
                                        <span>v1.0.0-beta.1</span>
                                        <span className="w-1 h-1 rounded-full bg-shrwd-border"></span>
                                        <span>~45MB</span>
                                        <span className="w-1 h-1 rounded-full bg-shrwd-border"></span>
                                        <span>Android 10+</span>
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

