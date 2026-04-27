import { auth } from "@clerk/nextjs/server";
import { TodoApp } from "@/components/todo-app";
import { LandingPage } from "@/components/landing-page";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    return <TodoApp userId={userId} />;
  }

  return <LandingPage />;
}