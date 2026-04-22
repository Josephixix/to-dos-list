import { auth } from "@clerk/nextjs/server";

import { createFirebaseCustomToken } from "@/lib/firebase-admin";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await createFirebaseCustomToken(userId);
    return Response.json({ token });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create Firebase token.";

    return Response.json({ error: message }, { status: 500 });
  }
}
