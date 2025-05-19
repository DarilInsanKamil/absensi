import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { initDb } from "./api/_db/init_db";

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
  if (process.env.SKIP_DB_INIT !== "true") {
    await initDb();
  }
  return (
    <html lang="en">
      <body className={`${dmSans.className}`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
