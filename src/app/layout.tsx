import type { Metadata } from "next";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {DM_Sans } from "next/font/google";

import { Button } from "@/components/ui/button";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";



const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

 
export const metadata: Metadata = {
  title: "To-do App",
  description: "A simple Clerk-powered to-do list app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} min-h-screen text-foreground antialiased`}
      >
        <ClerkProvider>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
