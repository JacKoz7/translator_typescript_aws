import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigureAmplify, Provider, Navbar } from "@/components/";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

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
    <html lang="en" className="h-screen w-full">
      <body className={cn(inter.className, "bg-custom-brown h-full")}>
        <ConfigureAmplify />
        <Provider>
          <Navbar/>
          {children}
          <Toaster/>
        </Provider>
      </body>
    </html>
  );
}
