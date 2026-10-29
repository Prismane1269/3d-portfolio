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
  title: "Taseen — Creative Developer & 3D Artist",
  description:
    "Portfolio of Taseen — A creative developer specializing in immersive 3D web experiences, interactive design, and modern web technologies.",
  keywords: ["portfolio", "3D", "web developer", "creative", "Three.js", "React"],
  authors: [{ name: "Taseen" }],
  openGraph: {
    title: "Taseen — Creative Developer & 3D Artist",
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
