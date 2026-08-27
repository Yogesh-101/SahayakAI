import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SahayakAI - AI-Powered EPFO Claims Tracker",
  description:
    "Track your EPFO PF withdrawal, loan, and pension claims in real time. AI-powered bottleneck diagnosis, resolution guidance, and WhatsApp notifications.",
  keywords: [
    "EPFO",
    "PF claim",
    "provident fund",
    "claim status",
    "AI diagnosis",
    "SahayakAI",
  ],
  authors: [{ name: "SahayakAI Team" }],
  openGraph: {
    title: "SahayakAI - Track Your EPFO Claim",
    description:
      "Stop checking 'Under Process'. Get real-time bottleneck diagnosis and resolution steps.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4F46E5",
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
