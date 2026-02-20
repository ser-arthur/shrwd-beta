import type { Metadata } from "next";
import { Poppins, Audiowide, MuseoModerno } from "next/font/google";
import "./globals.css";

// 1. Remove the 'variable' from Poppins, we will use it directly
const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

const audiowide = Audiowide({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-audiowide"
});

const museoModerno = MuseoModerno({
    subsets: ["latin"],
    variable: "--font-museo"
});

export const metadata: Metadata = {
    title: "SHRWD Beta | Developer Access",
    description: "Beta distribution portal for SHRWD.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${audiowide.variable} ${museoModerno.variable}`}>
        {/* 2. Force Poppins directly onto the body */}
        <body className={`${poppins.className} bg-shrwd-bg text-shrwd-text antialiased selection:bg-white selection:text-black`}>
        {children}
        </body>
        </html>
    );
}