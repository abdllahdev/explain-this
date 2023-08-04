import { cn } from "@/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex flex-col h-screen text-slate-300 bg-slate-900",
          inter.className,
        )}
      >
        <header className="flex p-4 px-8 text-xl font-black border-b-2 border-slate-800">
          <a href="/">Explain.js</a>
        </header>
        {children}
      </body>
    </html>
  );
}
