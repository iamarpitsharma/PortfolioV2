import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, Inter, Space_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Arpit Sharma | Backend Developer",
  description:
    "Portfolio of Arpit Sharma — Backend Developer based in Bengaluru. Specializing in Node.js, Express.js REST APIs, JWT/RBAC security, MongoDB aggregation, and distributed real-time systems.",
  keywords: [
    "Arpit Sharma",
    "Backend Developer",
    "Node.js Developer",
    "Bengaluru",
    "REST APIs",
    "MongoDB",
    "TypeScript",
    "System Design",
  ],
  authors: [{ name: "Arpit Sharma" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var isDark = saved ? (saved === 'dark') : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${syne.variable} ${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} antialiased bg-grid-pattern`}
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}