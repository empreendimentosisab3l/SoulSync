"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { quizQuestions, getTotalSteps } from "@/lib/quizData";
import ProgressBar from "@/components/ProgressBar";
import QuizChoice from "@/components/QuizChoice";
import QuizRange from "@/components/QuizRange";
import QuizMultiple from "@/components/QuizMultiple";
import QuizInfo from "@/components/QuizInfo";
import QuizMeasurements from "@/components/QuizMeasurements";

export default function QuizStep() {
  const params = useParams();
  const router = useRouter();
  const step = parseInt(params.step as string);
  const [selected, setSelected] = useState<string>("");
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved answers from localStorage
    const saved = localStorage.getItem("quizAnswers");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
      if (parsed[step]) {
        if (Array.isArray(parsed[step])) {
          setSelectedMultiple(parsed[step]);
        } else {
          setSelected(parsed[step]);
        }
      } else {
        setSelected("");
        setSelectedMultiple([]);
      }
    }
  }, [step]);

  const question = quizQuestions[step - 1];
  const totalSteps = getTotalSteps();

  if (!question) {
    router.push("/quiz/email");
    return null;
  }

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleSelectMultiple = (values: string[]) => {
    setSelectedMultiple(values);
  };

  const handleNext = () => {
    // For info screens, no answer needed
    if (question.type === "info") {
      navigateNext();
      return;
    }

    // For multiple choice, check if at least one selected
    if (question.type === "multiple") {
      if (selectedMultiple.length === 0) return;
      saveAndNavigate(selectedMultiple);
      return;
    }

    // For single choice/range/input
    if (!selected) return;
    saveAndNavigate(selected);
  };

  const saveAndNavigate = (answer: string | string[]) => {
    const newAnswers = { ...answers, [step]: answer };
    setAnswers(newAnswers);
    localStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
    navigateNext();
  };

  const navigateNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (step < quizQuestions.length) {
        router.push(`/quiz/${step + 1}`);
      } else {
        router.push("/quiz/email");
      }
      setIsLoading(false);
    }, 300);
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`/quiz/${step - 1}`);
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
          <div className="mb-12">
            <QuizInfo
              content={question.content!}
              image={question.image}
              testimonial={question.testimonial}
            />
          </div>

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-purple-700 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50"
            >
              {isLoading ? "Carregando..." : "Próxima"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For question screens
  const canProceed =
    question.type === "multiple"
      ? selectedMultiple.length > 0
      : !!selected;

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
        <div className="mb-8">
          {question.type === "choice" && question.options && (
            <QuizChoice
              options={question.options}
              onSelect={handleSelect}
              selected={selected}
            />
          )}

          {question.type === "multiple" && question.options && (
            <QuizMultiple
              options={question.options}
              onSelect={handleSelectMultiple}
              selected={selectedMultiple}
            />
          )}

          {question.type === "range" && (
            <QuizRange
              min={question.min!}
              max={question.max!}
              unit={question.unit!}
              onSelect={handleSelect}
              defaultValue={selected ? parseInt(selected) : undefined}
            />
          )}

          {question.type === "input" && question.id === 17 && (
            <QuizMeasurements
              onComplete={(data) => {
                saveAndNavigate(JSON.stringify(data));
              }}
              defaultValues={
                selected && typeof selected === "string" && selected.startsWith("{")
                  ? JSON.parse(selected)
                  : undefined
              }
            />
          )}
        </div>

        {/* Next Button - Only show if not measurements screen */}
        {!(question.type === "input" && question.id === 17) && (
          <div className="text-center">
            <button
              onClick={handleNext}
              disabled={!canProceed || isLoading}
              className="inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-purple-700 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Carregando..." : "Próxima"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
