import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creative Developer & 3D Web Artist",
  description:
    "Interactive 3D web experiences, WebGL shaders, spatial computing, and creative development showcase.",
  keywords: ["portfolio", "3D", "web developer", "creative", "Three.js", "React Three Fiber", "WebGL"],
  authors: [{ name: "Creative Developer" }],
  openGraph: {
    title: "Creative Developer & 3D Web Artist",
    description: "Crafting Digital Experiences in 3D",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
