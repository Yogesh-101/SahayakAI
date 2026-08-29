import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SahayakAI - EPFO Claims Transparency",
  description:
    "Track EPFO PF claims with stage-by-stage visibility, AI diagnosis, and resolution guidance. Hackathon build for Build What Moves India.",
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
    title: "SahayakAI - EPFO Claims Transparency",
    description:
      "AI-powered EPFO claim tracking and diagnosis. Not an official government product.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a237e",
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
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
