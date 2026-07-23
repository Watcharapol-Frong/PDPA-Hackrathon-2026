import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Kanit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ทันการณ์ (ThanKan) — Organization Portal",
  description:
    "Live Compliance Dashboard for connected organizations — ทันการณ์ (ThanKan) B2B platform mockup",
};

import { Suspense } from "react";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AppDataProvider } from "@/lib/data/AppDataProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        jakarta.variable,
        kanit.variable,
        jetbrains.variable,
      )}
    >
      <body className="min-h-full font-sans">
        <LanguageProvider>
          <Suspense fallback={null}>
            <AppDataProvider>{children}</AppDataProvider>
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
