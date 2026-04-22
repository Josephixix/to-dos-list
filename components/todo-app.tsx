"use client";

import { useEffect, useState } from "react";
import { Check, LoaderCircle, Plus, Trash2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

type TodoAppProps = {
  userId: string;
};

const starterTasks: Task[] = [
  { id: 1, title: "Review today's priorities", done: true },
  { id: 2, title: "Reply to important messages", done: false },
  { id: 3, title: "Ship one meaningful task", done: false },
];

export function TodoApp({ userId }: TodoAppProps) {
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadTasks() {
      try {
        const response = await fetch("/api/todos", { cache: "no-store" });
        const data: { tasks?: Task[]; error?: string } = await response.json();

        if (!response.ok || !data.tasks) {
          throw new Error(data.error ?? "Failed to load tasks.");
        }

        if (!isActive) {
          return;
        }

        setTasks(data.tasks);
        setErrorMessage(null);
        setSaveState("idle");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setSaveState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load tasks.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      isActive = false;
    };
  }, [userId]);

  async function saveTasks(nextTasks: Task[]) {
    setTasks(nextTasks);
    setSaveState("saving");

    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: nextTasks }),
      });

      const data: { ok?: boolean; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save tasks.");
      }

      setErrorMessage(null);
      setSaveState("idle");
    } catch (error) {
      setSaveState("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to save tasks.");
    }
  }

  async function addTask() {
    const title = value.trim();

    if (!title) {
      return;
    }

    const nextTasks = [{ id: Date.now(), title, done: false }, ...tasks];
    setValue("");
    await saveTasks(nextTasks);
  }

  async function toggleTask(id: number) {
    const nextTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task,
    );

    await saveTasks(nextTasks);
  }

  async function removeTask(id: number) {
    const nextTasks = tasks.filter((task) => task.id !== id);
    await saveTasks(nextTasks);
  }

  const completedCount = tasks.filter((task) => task.done).length;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <div className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/90 shadow-[0_30px_80px_-40px_rgba(41,37,36,0.45)] backdrop-blur">
        <div className="border-b border-stone-200/80 bg-stone-950 px-6 py-8 text-stone-50 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium tracking-[0.24em] text-amber-200 uppercase">
                Your dashboard
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Keep today under control.
              </h2>
              <p className="max-w-2xl text-sm text-stone-300 sm:text-base">
                Add tasks, mark them complete, and keep your next step visible.
              </p>
            </div>

            <div className="space-y-2 text-right">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200">
                {completedCount} of {tasks.length} tasks complete
              </div>
              <p className="text-xs text-stone-300">
                {isLoading && "Loading your tasks..."}
                {!isLoading && saveState === "saving" && "Saving to Firebase..."}
                {!isLoading && saveState === "idle" && "Your tasks are being stored in Firebase"}
                {!isLoading && saveState === "error" && "Firebase save failed"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {errorMessage ? (
              <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 rounded-3xl border border-stone-200 bg-stone-50 p-4 sm:flex-row">
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void addTask();
                  }
                }}
                placeholder="Add a new task..."
                className="h-12 flex-1 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none ring-0 placeholder:text-stone-400 focus:border-stone-400"
              />
              <Button
                size="lg"
                onClick={() => void addTask()}
                className="h-12 rounded-2xl bg-amber-400 px-5 text-stone-950 hover:bg-amber-300"
                disabled={isLoading}
              >
                <Plus className="size-4" />
                Add task
              </Button>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center gap-3 rounded-3xl border border-stone-200 bg-white p-4 text-stone-500 shadow-sm">
                  <LoaderCircle className="size-5 animate-spin" />
                  Loading your task list...
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => void toggleTask(task.id)}
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border transition ${
                        task.done
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-stone-300 bg-stone-50 text-stone-400"
                      }`}
                      aria-label={`Mark ${task.title} as ${task.done ? "incomplete" : "complete"}`}
                    >
                      <Check className="size-5" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-base font-medium ${
                          task.done ? "text-stone-400 line-through" : "text-stone-900"
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-sm text-stone-500">
                        {task.done ? "Finished" : "Still in progress"}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void removeTask(task.id)}
                      className="rounded-2xl text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside className="space-y-4 rounded-[1.75rem] bg-stone-100 p-5">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="text-sm font-medium tracking-[0.2em] text-stone-500 uppercase">
                Storage
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                Reliable saves through the server.
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Clerk protects the request, then the server writes your tasks to
                Firebase using the admin SDK.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-amber-300 p-5 text-stone-950">
              <p className="text-sm font-medium tracking-[0.2em] uppercase">
                Good sign
              </p>
              <p className="mt-3 text-sm leading-6">
                If the status says your tasks are being stored in Firebase, logout
                and sign back in to confirm they come back.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
