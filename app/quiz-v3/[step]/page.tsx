"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { quizQuestions, getTotalSteps } from "@/lib/quizDataV3";
import ProgressBar from "@/components/quiz-v3/ProgressBar";
import QuizChoice from "@/components/quiz-v3/QuizChoice";
import QuizRange from "@/components/quiz-v3/QuizRange";
import QuizMultiple from "@/components/quiz-v3/QuizMultiple";
import QuizInfo from "@/components/quiz-v3/QuizInfo";

export default function QuizStep() {
  const params = useParams();
  const router = useRouter();
  const step = parseInt(params.step as string);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved answers from localStorage
    const saved = localStorage.getItem("quizV3Answers");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
    }
  }, [step]);

  const question = quizQuestions[step - 1];
  const totalSteps = getTotalSteps();

  if (!question) {
    router.push("/quiz-v3/email");
    return null;
  }

  const saveAnswer = (value: string | string[]) => {
    const newAnswers = { ...answers, [step]: value };
    setAnswers(newAnswers);
    localStorage.setItem("quizV3Answers", JSON.stringify(newAnswers));
  };

  const handleNext = (value?: string | string[]) => {
    // For info screens, just navigate (no value needed)
    if (question.type === "info") {
      navigateNext();
      return;
    }

    // If value is provided, save it and navigate
    if (value !== undefined) {
      saveAnswer(value);
      navigateNext();
    }
  };

  const handleSelectMultiple = (values: string[]) => {
    saveAnswer(values);
  };

  const navigateNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (step < quizQuestions.length) {
        router.push(`/quiz-v3/${step + 1}`);
      } else {
        router.push("/quiz-v3/email");
      }
      setIsLoading(false);
    }, 300);
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`/quiz-v3/${step - 1}`);
    } else {
      router.push("/");
    }
  };

  // For info screens, use a different layout
  if (question.type === "info") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
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
              <span className="text-gray-600 font-medium">{step} / {quizQuestions.length}</span>
            </div>
            <ProgressBar current={step} total={quizQuestions.length} />
          </div>

          {/* Info Content */}
          <div className="mb-12 pb-32">
            <QuizInfo
              content={question.content!}
              image={question.image}
              testimonial={question.testimonial}
            />
          </div>

          {/* Next Button - Sticky footer for info screens */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-50 flex justify-center">
            <div className="w-full max-w-md">
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="w-full py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg bg-purple-700 text-white hover:scale-105 hover:shadow-purple-500/50 disabled:opacity-50"
              >
                {isLoading ? "Carregando..." : "Próxima"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For question screens
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
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
            <span className="text-gray-600 font-medium">{step} / {quizQuestions.length}</span>
          </div>
          <ProgressBar current={step} total={quizQuestions.length} />
        </div>

        {/* Question */}
        {question.question && (
          <div className="text-center mb-8 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {question.question}
            </h2>
            {question.subtitle && (
              <p className="text-base text-gray-600">{question.subtitle}</p>
            )}
          </div>
        )}

        {/* Answer Options */}
        <div className={(question.type === "multiple" || question.type === "range") ? "mb-8 pb-32" : "mb-8"}>
          {question.type === "choice" && question.options && (
            <QuizChoice
              options={question.options}
              onSelect={(value) => handleNext(value)}
              selected={typeof answers[step] === 'string' ? answers[step] as string : ''}
            />
          )}

          {question.type === "multiple" && question.options && (
            <QuizMultiple
              options={question.options}
              onSelect={handleSelectMultiple}
              selected={Array.isArray(answers[step]) ? answers[step] as string[] : []}
            />
          )}

          {question.type === "range" && (
            <QuizRange
              min={question.min!}
              max={question.max!}
              unit={question.unit!}
              onSelect={(value) => saveAnswer(value)}
              defaultValue={typeof answers[step] === 'string' ? parseInt(answers[step] as string) : undefined}
            />
          )}

          {question.type === "input" && (
            <div className="max-w-md mx-auto space-y-6">
              <input
                type="text"
                placeholder={question.placeholder}
                defaultValue={typeof answers[step] === 'string' ? answers[step] as string : ''}
                onBlur={(e) => {
                  if (e.target.value) {
                    handleNext(e.target.value);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    handleNext(e.currentTarget.value);
                  }
                }}
                className="w-full px-6 py-4 text-lg text-center border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          )}
        </div>

        {/* Next Button - Sticky footer for multiple choice and range questions */}
        {(question.type === "multiple" || question.type === "range") && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-50 flex justify-center">
            <div className="w-full max-w-md">
              <button
                onClick={() => handleNext(answers[step])}
                disabled={!answers[step] || (Array.isArray(answers[step]) && (answers[step] as string[]).length === 0) || isLoading}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${
                  answers[step] && (question.type === "range" || (Array.isArray(answers[step]) && (answers[step] as string[]).length > 0))
                    ? 'bg-purple-700 text-white hover:scale-105 hover:shadow-purple-500/50'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? "Carregando..." : "Próxima"}
                {question.type === "multiple" && answers[step] && Array.isArray(answers[step]) && (answers[step] as string[]).length > 0 &&
                  ` (${(answers[step] as string[]).length})`
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
