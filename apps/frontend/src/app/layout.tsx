import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ConfigureAmplify } from "@/components/";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EasySpeak",
  description: "Created by Jacek Kozłowski 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplify />
        <div className="flex gap-2 px-4 py-2 bg-orange-400">
          <Link href="/">Home</Link>
          <Link href="/user">User</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
