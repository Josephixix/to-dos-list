import { auth } from "@clerk/nextjs/server";

import { getFirebaseAdminDatabase } from "@/lib/firebase-admin";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

const starterTasks: Task[] = [
  { id: 1, title: "Review today's priorities", done: true },
  { id: 2, title: "Reply to important messages", done: false },
  { id: 3, title: "Ship one meaningful task", done: false },
];

function isTaskList(value: unknown): value is Task[] {
  return (
    Array.isArray(value) &&
    value.every(
      (task) =>
        typeof task === "object" &&
        task !== null &&
        typeof task.id === "number" &&
        typeof task.title === "string" &&
        typeof task.done === "boolean",
    )
  );
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const todosRef = getFirebaseAdminDatabase().ref(`todos/${userId}`);
    const snapshot = await todosRef.get();
    const tasks: unknown = snapshot.val();

    if (isTaskList(tasks)) {
      return Response.json({ tasks });
    }

    await todosRef.set(starterTasks);
    return Response.json({ tasks: starterTasks });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load tasks.";

    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: { tasks?: unknown } = await request.json();

    if (!isTaskList(body.tasks)) {
      return Response.json({ error: "Invalid task payload." }, { status: 400 });
    }

    await getFirebaseAdminDatabase().ref(`todos/${userId}`).set(body.tasks);
    return Response.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save tasks.";

    return Response.json({ error: message }, { status: 500 });
  }
}
