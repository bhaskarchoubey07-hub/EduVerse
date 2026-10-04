import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/store/auth-context";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export const viewport: Viewport = {
  themeColor: "#070a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "EduVerse AI — Board Exam Prep for Class 10, 11 & 12 (CBSE, ICSE, State Boards)",
  description:
    "Learn Smarter. Prepare Better. Achieve More. All-in-one AI tutor, verified 10-year question papers, chapter notes, and timed mock exams for CBSE, ICSE, and State Board success.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EduVerse AI",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  keywords: [
    "CBSE Class 10",
    "CBSE Class 12",
    "ICSE Class 10",
    "ISC Class 12",
    "Punjab Board",
    "Board Exam Prep",
    "AI Tutor for Students",
    "Previous Year Question Papers",
    "Class 10 Science",
    "Class 12 Physics",
    "Class 12 Mathematics",
    "Mock Tests",
  ],
  authors: [{ name: "EduVerse AI Education Team" }],
  openGraph: {
    title: "EduVerse AI — Next-Gen Board Examination Preparation",
    description:
      "All-in-one platform for Class 10, 11 & 12 board exams with AI tutoring, 10-year verified papers, and chapter tests.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070a14] text-slate-100 antialiased selection:bg-violet-500 selection:text-white">
        <AuthProvider>
          <OfflineIndicator />
          {children}
          <MobileBottomNav />
          <PWAInstallPrompt />
          <ServiceWorkerRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
