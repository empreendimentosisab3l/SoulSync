"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { quizQuestions, getTotalSteps } from "@/lib/quizDataV3";
import { pageview, trackQuizV3Step, trackQuizV3Answer, trackQuizV3Complete } from "@/lib/analytics";
import ProgressBar from "@/components/quiz-v3/ProgressBar";
import QuizChoice from "@/components/quiz-v3/QuizChoice";
import QuizRange from "@/components/quiz-v3/QuizRange";
import QuizMultiple from "@/components/quiz-v3/QuizMultiple";
import QuizInfo from "@/components/quiz-v3/QuizInfo";
import QuizV3Input from "@/components/quiz-v3/QuizV3Input";

export default function QuizStep() {
  const params = useParams();
  const router = useRouter();
  const step = parseInt(params.step as string);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const question = quizQuestions[step - 1];

  useEffect(() => {
    // Load saved answers from localStorage
    const saved = localStorage.getItem("quizV3Answers");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
    }

    // Track page view and step
    if (question) {
      pageview(`/quiz-v3/${step}`);
      trackQuizV3Step(step, question.type);
    }
  }, [step, question]);

  const totalSteps = getTotalSteps();

  if (!question) {
    router.push("/quiz-v3/email");
    return null;
  }

  const saveAnswer = (value: string | string[]) => {
    const newAnswers = { ...answers, [step]: value };
    setAnswers(newAnswers);
    localStorage.setItem("quizV3Answers", JSON.stringify(newAnswers));

    // Track answer
    trackQuizV3Answer(step, value);
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
        // Track quiz complete
        trackQuizV3Complete(step);
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
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
          <div className="max-w-2xl mx-auto w-full space-y-3">
            {/* Header Content */}
            <div className="relative flex items-center justify-center h-8 mb-2">
              <span className="text-gray-900 font-bold text-lg sm:text-xl tracking-tight">SoulSync</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-700 ease-out"
                style={{ width: `${(step / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4">
          <div className="max-w-2xl w-full">
            {/* Info Content */}
            <div className="mb-8 pb-28 sm:pb-32">
            <QuizInfo
              title={question.question}
              content={question.content!}
              image={question.image}
              testimonial={question.testimonial}
              rating={question.rating}
            />
          </div>

            {/* Next Button - Sticky footer for info screens */}
            <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-50 flex justify-center">
              <div className="w-full max-w-md">
                <button
                  onClick={() => handleNext()}
                  disabled={isLoading}
                  className="w-full py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 shadow-lg bg-teal-600 text-white active:scale-95 sm:hover:scale-105 hover:bg-teal-700 disabled:opacity-50"
                >
                  {isLoading ? "Carregando..." : (question.buttonText || "Próxima")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For question screens
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <div className="max-w-2xl mx-auto w-full space-y-3">
          {/* Header Content */}
          <div className="relative flex items-center justify-center h-8 mb-2">
            <span className="text-gray-900 font-medium text-base sm:text-lg">Meu perfil</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 transition-all duration-700 ease-out"
              style={{ width: `${(step / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4">
        <div className="max-w-2xl w-full">
          {/* Question */}
          {question.question && question.type !== "input" && (
            <div className="text-center mb-6 sm:mb-8 space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {question.question}
            </h2>
            {question.subtitle && (
              <p className="text-sm sm:text-base text-gray-600">{question.subtitle}</p>
            )}
          </div>
        )}

        {/* Answer Options */}
        <div className={(question.type === "multiple" || question.type === "range") ? "mb-6 sm:mb-8 pb-28 sm:pb-32" : "mb-6 sm:mb-8"}>
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
            <QuizV3Input
              question={question.question!}
              subtitle={question.subtitle}
              description={question.description}
              inputType={question.inputType || 'text'}
              placeholder={question.placeholder}
              unit={question.unit}
              onContinue={handleNext}
              buttonText="Continuar"
              showTerms={question.showTerms}
              measurementType={
                step === 17 ? 'height' :
                  step === 18 ? 'weight' :
                    undefined
              }
              otherValue={
                step === 18 ? (typeof answers[17] === 'string' ? answers[17] as string : undefined) :
                  step === 19 ? (typeof answers[18] === 'string' ? answers[18] as string : undefined) :
                    undefined
              }
              feedbackType={
                step === 18 ? 'bmi' :
                  step === 19 ? 'weight-loss' :
                    undefined
              }
            />
          )}
          </div>

          {/* Next Button - Sticky footer for multiple choice and range questions */}
          {(question.type === "multiple" || question.type === "range") && (
            <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-50 flex justify-center">
              <div className="w-full max-w-md">
                <button
                  onClick={() => handleNext(answers[step])}
                  disabled={!answers[step] || (Array.isArray(answers[step]) && (answers[step] as string[]).length === 0) || isLoading}
                  className={`w-full py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 shadow-lg ${answers[step] && (question.type === "range" || (Array.isArray(answers[step]) && (answers[step] as string[]).length > 0))
                    ? 'bg-teal-600 text-white active:scale-95 sm:hover:scale-105 hover:bg-teal-700'
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
    </div>
  );
}
