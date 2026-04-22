"use client";

import { useEffect, useState, useRef } from "react";
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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isActive = true;

    async function loadTasks() {
      try {
        const response = await fetch("/api/todos", { cache: "no-store" });
        const data: { tasks?: Task[]; error?: string } = await response.json();

        if (!response.ok || !data.tasks) {
          throw new Error(data.error ?? "Failed to load tasks.");
        }

        if (!isActive) return;

        setTasks(data.tasks);
        setErrorMessage(null);
        setSaveState("idle");
      } catch (error) {
        if (!isActive) return;

        setSaveState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load tasks."
        );
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadTasks();

    return () => {
      isActive = false;
    };
  }, [userId]);

  // 🔥 Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save tasks."
      );
    }
  }

  async function addTask() {
    const title = value.trim();

    if (!title) {
      inputRef.current?.focus();
      return;
    }

    const nextTasks = [{ id: Date.now(), title, done: false }, ...tasks];
    setValue("");
    await saveTasks(nextTasks);

    // 🔥 Keep focus after adding
    inputRef.current?.focus();
  }

  async function toggleTask(id: number) {
    const nextTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );

    await saveTasks(nextTasks);
  }

  async function removeTask(id: number) {
    const nextTasks = tasks.filter((task) => task.id !== id);
    await saveTasks(nextTasks);

    // optional: keep typing flow after delete
    inputRef.current?.focus();
  }

  const completedCount = tasks.filter((task) => task.done).length;

  return (
    <section className="mx-auto w-full max-w-xl px-3 sm:px-6 pt-14 sm:pt-25 pb-12 sm:pb-16">
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90">

        {/* HEADER */}
        <div className="border-b border-stone-200/80 bg-stone-950 px-4 sm:px-8 py-6 sm:py-4 text-stone-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                welcome
              </p>
            </div>

            <div className="space-y-1 sm:text-right">
              <div className="rounded-xl sm:rounded-lg border border-white/10 bg-white/5 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-stone-200">
                {completedCount} of {tasks.length} tasks complete
              </div>

              <p className="text-[11px] sm:text-xs text-stone-300">
                {isLoading && "Loading your tasks..."}
                {!isLoading && saveState === "saving" && "Saving..."}
                {!isLoading && saveState === "error" && "Save failed"}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-6 px-4 sm:px-8 py-6 sm:py-8 lg:grid-cols-[1.2fr_0.8fr]">

          <div className="space-y-4">

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700">
                <TriangleAlert className="size-4 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* INPUT */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:p-4">
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Add a new task..."
                className="h-10 sm:h-9 flex-1 rounded-xl border border-stone-200 bg-white px-3 sm:px-4 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
              />

              <Button
                onClick={() => addTask()}
                disabled={isLoading}
                className="h-10 sm:h-9 w-full sm:w-auto rounded-xl bg-[#4946c8] px-4 sm:px-5 text-white hover:bg-[#4946c8]/90"
              >
                <Plus className="size-4 mr-1" />
                Add
              </Button>
            </div>

            {/* TASK LIST */}
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white p-3 text-sm text-stone-500">
                  <LoaderCircle className="size-4 animate-spin" />
                  Loading tasks...
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 sm:p-4"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex size-6 sm:size-5 items-center justify-center rounded-md border ${
                        task.done
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-stone-50 border-stone-300 text-stone-400"
                      }`}
                    >
                      <Check className="size-3" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm sm:text-base font-medium ${
                          task.done
                            ? "line-through text-stone-400"
                            : "text-stone-900"
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs sm:text-sm text-stone-500">
                        {task.done ? "Finished" : "In progress"}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTask(task.id)}
                      className="size-8 sm:size-9 rounded-lg text-stone-500 hover:bg-stone-100"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}