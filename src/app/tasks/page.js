"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Tasks from "../components/Tasks";

export default function TasksPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <Tasks />;
} 