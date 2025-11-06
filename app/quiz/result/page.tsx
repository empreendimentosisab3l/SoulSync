"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to first result screen
    router.push("/quiz/result/1");
  }, [router]);

  return null;
}
