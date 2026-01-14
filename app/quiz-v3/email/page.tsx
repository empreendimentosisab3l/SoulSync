"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProgressBar from "@/components/quiz-v3/ProgressBar";
import { quizQuestions } from "@/lib/quizDataV3";

export default function EmailCapture() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email) {
      setError("Por favor, insira seu email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Por favor, insira um email válido");
      return;
    }

    setIsLoading(true);

    // Save user data
    localStorage.setItem("userDataV3", JSON.stringify(formData));

    // Navigate to loading page first
    setTimeout(() => {
      router.push("/quiz-v3/loading");
    }, 500);
  };

  const handleBack = () => {
    router.push(`/quiz-v3/${quizQuestions.length}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <span className="text-gray-600 font-medium">22 / 22</span>
          </div>
          <ProgressBar current={22} total={22} />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Um último passo!
            </h2>
            <p className="text-base text-orange-600">
              Insira seus dados para descobrir como a hipnoterapia pode ajudá-lo(a) a atingir suas metas de perda de peso.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                placeholder="Endereço de email"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Privacy Notice */}
            <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-xl">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-gray-600 leading-relaxed">
                Seus dados pessoais estão seguros conosco. Não enviamos spam nem compartilhamos endereços de e-mail com terceiros.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.email}
              className="w-full py-4 bg-purple-700 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-purple-800 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Carregando..." : "Continuar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
