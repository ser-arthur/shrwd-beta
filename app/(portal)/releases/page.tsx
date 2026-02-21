"use client";

import { ArrowLeft, Plus, Wrench, Trash2 } from "lucide-react";
import Link from "next/link";

const RELEASES = [
    {
        version: "v1.0.0-beta.2",
        date: "Feb 20, 2026",
        isLatest: true,
        changes: {
            added: [
                "Redesigned overview screen to include upcoming bills from budget planner.",
                "Smart icon categorization for recurring subscriptions.",
                "Smooth gesture animations when swiping between Planner and Insights."
            ],
            removed: [
                "Stripped down cluttered pie charts to keep the UI purely functional and text-driven."
            ],
            fixed: [
                "Fixed cross-currency conversion logic to ensure accurate totals",
                "Fixed start-up delay bug on older android devices."
            ]
        }
    },
    {
        version: "v1.0.0-beta.1",
        date: "Feb 14, 2026",
        isLatest: false,
        changes: {
            added: [
                "Initial Beta Release for core testing group.",
                "Basic income and expense tracking logic.",
                "Secure local storage implementation for offline use."
            ],
            removed: [],
            fixed: []
        }
    }
];

export default function ReleasesPage() {
    return (
        <div className="min-h-screen bg-shrwd-bg text-shrwd-text flex flex-col items-center">

            {/* Top Navigation - Now Sticky with Glass Blur */}
            <header className="sticky top-0 z-50 w-full bg-shrwd-bg/80 backdrop-blur-md border-b border-shrwd-border/50 flex justify-center">
                <div className="w-full max-w-2xl px-6 py-4 sm:py-5 flex justify-between items-center">
                    <Link
                        href="/dashboard"
                        className="text-shrwd-subtext hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                    <h2 className="text-xl tracking-tighter text-shrwd-text font-logo lowercase flex items-baseline select-none opacity-50">
                        shrwd<span className="text-[#50C878] ml-[1px] text-2xl leading-none">.</span>
                    </h2>
                </div>
            </header>

            {/* Main Content Area - Added pb-24 for bottom breathing room */}
            <main className="w-full max-w-2xl px-6 pb-24 flex flex-col mt-6 sm:mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

                <div className="mb-12">
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-shrwd-text">
                        Release History
                    </h1>
                    <p className="text-shrwd-subtext text-sm sm:text-base leading-relaxed">
                        Track the evolution of SHRWD. Documenting our continuous effort to build a faster, smarter, and cleaner budgeting experience.
                    </p>
                </div>

                {/* The Timeline (Using your stable layout) */}
                <div className="relative border-l border-shrwd-border ml-3 sm:ml-4 space-y-12 pb-8">

                    {RELEASES.map((release, index) => (
                        <div key={release.version} className="relative pl-8 sm:pl-10 animate-fade-in-up" style={{ animationDelay: `${(index + 2) * 100}ms` }}>

                            {/* Timeline Node */}
                            <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${release.isLatest ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-shrwd-border'}`}></div>

                            {/* Version Header */}
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-6">
                                <h2 className="text-xl font-bold tracking-tight text-white">{release.version}</h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-shrwd-subtext">{release.date}</span>
                                    {release.isLatest && (
                                        <span className="bg-shrwd-border text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                      Latest
                    </span>
                                    )}
                                </div>
                            </div>

                            {/* Changes Card */}
                            <div className="bg-shrwd-card border border-shrwd-border rounded-2xl p-6 shadow-xl flex flex-col gap-6">

                                {/* Added Section */}
                                {release.changes.added && release.changes.added.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1 rounded-md bg-white/10 text-white flex-shrink-0">
                                                <Plus className="w-3.5 h-3.5" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Added</h3>
                                        </div>
                                        <ul className="space-y-3 pl-2">
                                            {release.changes.added.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-shrwd-subtext leading-relaxed">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-shrwd-muted shrink-0 mt-[8px]"></span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Removed Section */}
                                {release.changes.removed && release.changes.removed.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1 rounded-md bg-red-500/10 text-red-400 flex-shrink-0">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Removed</h3>
                                        </div>
                                        <ul className="space-y-3 pl-2">
                                            {release.changes.removed.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-shrwd-subtext leading-relaxed">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-shrwd-muted shrink-0 mt-[8px]"></span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Fixed Section */}
                                {release.changes.fixed && release.changes.fixed.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1 rounded-md bg-shrwd-border text-shrwd-subtext flex-shrink-0">
                                                <Wrench className="w-3.5 h-3.5" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Fixed</h3>
                                        </div>
                                        <ul className="space-y-3 pl-2">
                                            {release.changes.fixed.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-shrwd-subtext leading-relaxed">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-shrwd-muted shrink-0 mt-[8px]"></span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}

                </div>
            </main>

        </div>
    );
}