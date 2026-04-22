import type { Metadata } from "next";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { CheckSquare2 } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";

import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[radial-gradient(circle_at_top,_rgba(253,230,138,0.45),_transparent_30%),linear-gradient(180deg,_#fffdf7_0%,_#fff8e7_45%,_#f3efe2_100%)] text-foreground antialiased`}
      >
        <ClerkProvider>
          <header className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-stone-950 text-amber-50 shadow-sm">
                <CheckSquare2 className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
                  FocusFlow
                </p>
                <p className="text-sm text-stone-600">Plan less. Finish more.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="lg" className="text-stone-700">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="rounded-full bg-stone-950 px-5 text-amber-50 hover:bg-stone-800"
                  >
                    Sign up
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
