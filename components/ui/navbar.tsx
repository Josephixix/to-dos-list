"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Show } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-4 py-1 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
            <div className="flex items-center justify-center rounded-[20px] border-black/10 bg-[#7B77DE] px-5 py-1">
              <span className="text-sm font-extrabold tracking-tight text-white">
                TO-DOS
              </span>
            </div>
          </Link>

          {/* Desktop auth */}
          <div className="hidden sm:flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-stone-600 hover:text-stone-900">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="rounded-full bg-stone-950 px-4 text-amber-50 hover:bg-stone-800">
                  Sign up
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

          {/* Mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex size-9 items-center justify-center rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </Show>
          </div>
        </div>
      </nav>

      {/* Full screen mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-white sm:hidden flex flex-col transition-all duration-300 ease-in-out ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top area matches navbar height */}
        <div className="min-h-16" />

        {/* Menu content centered in remaining space */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8">
          {/* Logo repeated for context */}
          <div className="flex items-center justify-center rounded-[20px] bg-[#7B77DE] px-6 py-2 mb-6">
            <span className="text-base font-extrabold tracking-tight text-black">TO-DOS</span>
          </div>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="lg"
                className="w-64 justify-center text-stone-700 hover:text-stone-900 hover:bg-stone-100 text-base"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="w-64 rounded-full bg-stone-950 text-amber-50 hover:bg-stone-800 text-base"
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </Button>
            </SignUpButton>
          </Show>
        </div>

        {/* Bottom padding */}
        <div className="pb-12 text-center">
          <p className="text-xs text-stone-400">Plan less. Finish more.</p>
        </div>
      </div>
    </>
  );
}