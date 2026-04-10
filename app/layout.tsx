import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import DesktopParticles from "@/components/DesktopParticles";

const META_PIXEL_ID = "2020490228678499";

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
    "Mended uses evidence-based CBT, mindfulness, and Stoic practice to help you break free from alcohol — for good. Take the free 3-minute quiz and get your personalised program built on the same techniques clinicians use.",
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
        {/* Meta Pixel — base code (fires PageView on every page) */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <DesktopParticles />
        <div
          className="min-h-screen w-full mx-auto relative overflow-x-hidden"
          style={{ maxWidth: "880px", zIndex: 2, position: "relative" }}
        >
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
