import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import DesktopParticles from "@/components/DesktopParticles";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Break Free From Alcohol",
  description:
    "Mended uses evidence-based CBT, mindfulness, and Stoic practice to help you break free from alcohol — for good. Take the free 3-minute quiz and get your personalised program. Used by 94,000+ people.",
  openGraph: {
    title: "Break Free From Alcohol",
    description:
      "Take the free 3-minute quiz and discover your personalised CBT and mindfulness program. Break free from alcohol — for good.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-quiz-bg text-white antialiased">
        <DesktopParticles />
        <div
          className="min-h-screen w-full mx-auto relative overflow-x-hidden"
          style={{ maxWidth: "880px", zIndex: 2, position: "relative" }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
