import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "SMK Techno Media",
  description: "Website absensi siswa sekolah techno media",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // try {
  //   const response = await fetch(`${process.env.LOCAL_TEST_API}/api/initdb`, {
  //     method: "GET",
  //     cache: "no-store",
  //   });

  //   if (!response.ok) {
  //     console.error("Failed to initialize database");
  //   }
  // } catch (error) {
  //   console.error("Database initialization error:", error);
  // }
  return (
    <html lang="en">
      <body className={`${dmSans.className}`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
