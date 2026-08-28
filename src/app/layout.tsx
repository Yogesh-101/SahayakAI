import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SahayakAI - Hackathon EPFO Claims Prototype",
  description:
    "Hackathon prototype for Build What Moves India. Mock EPFO claim tracking with AI diagnosis — not affiliated with EPFO or Government of India.",
  keywords: [
    "EPFO",
    "PF claim",
    "provident fund",
    "claim status",
    "AI diagnosis",
    "SahayakAI",
  ],
  authors: [{ name: "SahayakAI Team" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "SahayakAI - Hackathon EPFO Claims Prototype",
    description:
      "Hackathon prototype with mock data. Not an official government product.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3B3F8C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
