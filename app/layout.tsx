import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import DesktopSidebar from "@/components/DesktopSidebar";

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
  title: "Mended — Break free from alcohol, for good.",
  description:
    "Mended uses science-backed hypnosis to help you break free from alcohol — for good. Take the free 3-minute quiz and get your personalised program. Used by 94,000+ people.",
  openGraph: {
    title: "Mended — Break free from alcohol, for good.",
    description:
      "Take the free 3-minute quiz and discover your personalised hypnosis program. Break free from alcohol — for good.",
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

        {/* Mobile: single column, centered at 480px max */}
        {/* Desktop (md+): two columns — quiz left, sidebar right */}
        <div className="min-h-screen flex justify-center md:justify-start md:max-w-6xl md:mx-auto">

          {/* Quiz column — always 480px max, full width on mobile */}
          <div
            className="w-full relative overflow-x-hidden"
            style={{ maxWidth: "480px" }}
          >
            {children}
          </div>

          {/* Sidebar — desktop only */}
          <div
            className="hidden md:block flex-1 border-l"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <DesktopSidebar />
          </div>

        </div>
      </body>
    </html>
  );
}
