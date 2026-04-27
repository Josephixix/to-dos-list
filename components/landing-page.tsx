"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const TYPED_TEXT = "A simple and organized";
const TYPED_TEXT_2 = "to-do list";

function TypewriterText({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 45);

    return () => clearTimeout(timer);
  }, [started, displayed, text]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <motion.span
          className="inline-block w-[2px] h-[0.85em] bg-stone-950 ml-[1px] align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </span>
  );
}

export function LandingPage() {
  const [line1Done, setLine1Done] = useState(false);
  const [line2Done, setLine2Done] = useState(false);

  useEffect(() => {
    // Line 1 finishes after delay + typing time
    const t1 = setTimeout(() => setLine1Done(true), 200 + TYPED_TEXT.length * 45 + 100);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!line1Done) return;
    const t2 = setTimeout(() => setLine2Done(true), TYPED_TEXT_2.length * 45 + 100);
    return () => clearTimeout(t2);
  }, [line1Done]);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center px-4 pb-20 pt-12 sm:px-6">

      {/* LEFT TOP */}
      <motion.div
        className="hidden lg:flex absolute left-6 xl:left-12 top-10 flex-col gap-4"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <motion.img
          src="/img1.jpg"
          alt="preview 2"
          className="w-40 h-40 xl:w-52 xl:h-52 rounded-2xl object-cover"
          whileHover={{ scale: 1.05, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.div>

      {/* LEFT MIDDLE */}
      <motion.div
        className="hidden lg:block absolute left-6 xl:left-12 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
      >
        <motion.img
          src="/img2.jpg"
          alt="preview 3"
          className="w-40 h-40 xl:w-52 xl:h-52 rounded-2xl object-cover"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.div>

      {/* RIGHT BOTTOM STACK */}
      <motion.div
        className="hidden lg:flex absolute right-6 xl:right-12 bottom-10 flex-col gap-4"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <motion.img
          src="/img5.jpg"
          alt="preview 5"
          className="w-40 h-40 xl:w-52 xl:h-52 rounded-2xl object-cover"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <motion.img
          src="/img6.jpg"
          alt="preview 4"
          className="w-40 h-40 xl:w-52 xl:h-52 rounded-2xl object-cover"
          whileHover={{ scale: 1.05, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.div>

      {/* CENTER CONTENT */}
      <section className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto z-10">

        {/* Headline with typewriter */}
        <h1 className="font-extrabold tracking-tight text-3xl md:text-5xl lg:text-6xl text-stone-950 leading-tight min-h-[1.2em]">
          <TypewriterText text={TYPED_TEXT} delay={200} />
          <br />
          <span className="inline-flex items-center gap-2">
            <TypewriterText text="to-do list" delay={200 + TYPED_TEXT.length * 45 + 200} />
            {/* Inline image fades in after line 2 is done */}
            <motion.span
              className="inline-block align-middle h-9 w-12 md:h-12 md:w-18 lg:h-14 lg:w-20 rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={line2Done ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <img src="/list.jpg" alt="preview" className="h-full w-full object-cover" />
            </motion.span>
          </span>
        </h1>

        {/* Subheadline fades in after headline done */}
        <motion.p
          className="text-sm lg:text-xl text-stone-500 leading-relaxed max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={line2Done ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          To-dos turns your scattered to-do list into a calm,
          focused workspace. Simple enough to start in seconds.
          Powerful enough to run your whole life.
        </motion.p>

        {/* CTA fades in after subheadline */}
        <motion.div
          className="flex items-center gap-3 mt-2"
          initial={{ opacity: 0, y: 16 }}
          animate={line2Done ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <SignUpButton mode="modal">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="rounded-full bg-black px-7 text-white hover:bg-stone-800 text-sm font-semibold"
              >
                Get started free
              </Button>
            </motion.div>
          </SignUpButton>

          <SignInButton mode="modal">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full text-stone-600 hover:text-stone-900 text-sm font-semibold"
              >
                Sign in
              </Button>
            </motion.div>
          </SignInButton>
        </motion.div>

        <motion.p
          className="text-xs text-stone-400 mt-1"
          initial={{ opacity: 0 }}
          animate={line2Done ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Free to use · No credit card required
        </motion.p>

      </section>
    </main>
  );
}