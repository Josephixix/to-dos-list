import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { TodoApp } from "@/components/todo-app";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    return <TodoApp userId={userId} />;
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center px-4 pb-20 pt-12 sm:px-6">

      {/* LEFT - TOP (UNCHANGED) */}
      <div className="hidden lg:block absolute left-10 top-10 space-y-4">
        <img
          src="/img.jpg"
          alt="preview 1"
          className="w-28 h-28 rounded-xl object-cover"
        />
        <img
          src="/img1.jpg"
          alt="preview 2"
          className="w-28 h-28 rounded-xl object-cover"
        />
      </div>

      {/* LEFT - MIDDLE (IMG 3 MOVED UP) */}
      <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2">
        <img
          src="/img2.jpg"
          alt="preview 3"
          className="w-28 h-28 rounded-xl object-cover"
        />
      </div>

      {/* RIGHT - BOTTOM STACK */}
      <div className="hidden lg:block absolute right-10 bottom-10 space-y-4">
        <img
          src="/img5.jpg"
          alt="preview 5"
          className="w-28 h-28 rounded-xl object-cover"
        />
        <img
          src="/img6.jpg"
          alt="preview 4"
          className="w-28 h-28 rounded-xl object-cover"
        />
      </div>

      {/* CENTER CONTENT */}
      <section className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto z-10">

        {/* Headline */}
        <h1 className="font-extrabold tracking-tight text-2xl md:text-5xl lg:text-6xl text-stone-950 leading-tight">
          A simple and organized <br />
          to-do{" "}
          <span className="inline-flex items-center gap-2">
            list
            <span className="inline-block align-middle h-9 w-12 md:h-12 md:w-18 lg:h-19 lg:w-22 rounded-xl overflow-hidden">
              <img
                src="/list.jpg"
                alt="preview"
                className="h-full w-full object-cover"
              />
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm lg:text-xl text-stone-500 leading-relaxed max-w-xl">
          To-dos turns your scattered to-do list into a calm, focused workspace.
          Simple to start in seconds. Powerful to run your whole life.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-3 mt-2">
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="rounded-full bg-stone-950 px-7 text-amber-50 hover:bg-stone-800 text-sm font-semibold"
            >
              Get started free
            </Button>
          </SignUpButton>

          <SignInButton mode="modal">
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full text-stone-600 hover:text-stone-900 text-sm font-semibold"
            >
              Sign in
            </Button>
          </SignInButton>
        </div>

        <p className="text-xs text-stone-400 mt-1">
          Free to use · No credit card required
        </p>

      </section>
    </main>
  );
}