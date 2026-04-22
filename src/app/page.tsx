import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle2, ListTodo, ShieldCheck, Sparkles } from "lucide-react";

import { TodoApp } from "@/components/todo-app";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: ListTodo,
    title: "Simple task capture",
    description: "Write down what matters now and keep the rest out of your way.",
  },
  {
    icon: CheckCircle2,
    title: "Clear progress",
    description: "See what is done and what still needs your attention at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Clerk authentication",
    description: "Use secure sign in and sign up flows without building auth from scratch.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    return <TodoApp userId={userId} />;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-20 pt-6 sm:px-6 lg:gap-16 lg:pt-10">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/80 px-4 py-2 text-sm font-medium text-stone-700">
            <Sparkles className="size-4" />
            Stay organized without the clutter
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
              A simple to-do list app that helps you actually finish things.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-600">
              Sign in with Clerk, land straight in your workspace, and keep your
              day focused on the tasks that matter most.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="h-12 rounded-full bg-stone-950 px-6 text-amber-50 hover:bg-stone-800"
              >
                Create account
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-stone-300 bg-white/80 px-6 text-stone-900 hover:bg-stone-50"
              >
                Sign in
              </Button>
            </SignInButton>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-200/80 bg-white/85 p-5 shadow-[0_30px_80px_-40px_rgba(41,37,36,0.4)] backdrop-blur sm:p-7">
          <div className="rounded-[1.5rem] bg-stone-950 p-6 text-stone-50">
            <p className="text-sm font-medium tracking-[0.22em] text-amber-200 uppercase">
              Preview
            </p>
            <h2 className="mt-3 text-3xl font-semibold">What your workspace feels like</h2>
            <div className="mt-6 space-y-3">
              {["Plan the day", "Finish the top priority", "Review progress"].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item}</p>
                    <p className="text-sm text-stone-300">One step at a time, clearly tracked.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-[1.75rem] border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-200 text-stone-900">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-stone-950">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
