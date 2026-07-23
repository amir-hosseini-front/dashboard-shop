import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const vazirmatn = localFont({
  src: "../public/fonts/IranianSans.ttf", // مسیر فایل
  weight: "400",
  style: "normal",
  variable: "--font-myFont",
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "داشبورد مدیریت",
  description: "پنل مدیریت با Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.className}>
      <body>{children}</body>
    </html>
  );
}
