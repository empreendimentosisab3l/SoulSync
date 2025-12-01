"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Quiz V2 landing page immediately
    router.replace("/quiz-v2");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hypno-bg">
      <div className="text-white text-xl">Carregando...</div>
    </div>
  );
}
