'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getQuizV2Question, getTotalQuizV2Questions } from '@/lib/quizDataV2';
import { pageview, trackQuizStep, trackQuizAnswer, trackQuizComplete, trackEmailCapture } from '@/lib/analytics';
import QuizV2Card from '@/components/QuizV2Card';
import QuizV2Choice from '@/components/QuizV2Choice';
import QuizV2Multiple from '@/components/QuizV2Multiple';
import QuizV2Input from '@/components/QuizV2Input';
import QuizV2Range from '@/components/QuizV2Range';
import QuizV2Info from '@/components/QuizV2Info';
import QuizV2BodyFocus from '@/components/QuizV2BodyFocus';
import QuizV2Wheel from '@/components/QuizV2Wheel';
import QuizV2Analysis from '@/components/QuizV2Analysis';
import QuizV2Scratch from '@/components/QuizV2Scratch';
import QuizV2DatePicker from '@/components/QuizV2DatePicker';
import QuizV2Visualization from '@/components/QuizV2Visualization';
import QuizV2SummaryBMI from '@/components/QuizV2SummaryBMI';

export default function QuizV2StepPage() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params?.step as string || '1');

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  const totalSteps = getTotalQuizV2Questions();
  const questionData = getQuizV2Question(step);

  useEffect(() => {
    // Load saved answers from localStorage
    const saved = localStorage.getItem('quizV2Answers');
    if (saved) {
      setAnswers(JSON.parse(saved));
    }
    setIsLoading(false);

    // Clear old quiz data on first step
    if (step === 1) {
      localStorage.removeItem('quizV2Answers');
      localStorage.removeItem('quizV2UserData');
      setAnswers({});
    }

    // Track page view and step
    if (questionData) {
      pageview(`/quiz-v2/${step}`);
      trackQuizStep(step, questionData.type);
    }
  }, [step, questionData]);

  const saveAnswer = (value: any) => {
    const newAnswers = { ...answers, [step]: value };
    setAnswers(newAnswers);
    localStorage.setItem('quizV2Answers', JSON.stringify(newAnswers));

    // Track answer
    trackQuizAnswer(step, value);

    // Track email capture specifically (assuming step 46 is email based on checkout page)
    if (step === 46 && typeof value === 'string' && value.includes('@')) {
      trackEmailCapture(value);
    }
  };

  const handleNext = (value?: any) => {
    if (value !== undefined) {
      saveAnswer(value);
    }

    // After card 49 (scratch card), go directly to checkout
    if (step === 49) {
      trackQuizComplete(step);
      router.push('/quiz-v2/checkout');
      return;
    }

    // Navigate to next step
    if (step < totalSteps) {
      router.push(`/quiz-v2/${step + 1}`);
    } else {
      // Quiz completed - go to checkout
      trackQuizComplete(step);
      router.push('/quiz-v2/checkout');
    }
  };

  if (isLoading) {
    return (
      <QuizV2Card>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-hypno-accent"></div>
        </div>
      </QuizV2Card>
    );
  }

  if (!questionData) {
    return (
      <QuizV2Card>
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Pergunta não encontrada</h2>
          <button
            onClick={() => router.push('/quiz-v2/1')}
            className="bg-hypno-purple text-white px-6 py-3 rounded-full"
          >
            Voltar ao início
          </button>
        </div>
      </QuizV2Card>
    );
  }

  // Function to get personalized question for date picker based on event selected
  const getEventDateQuestion = () => {
    const eventValue = answers[42]; // Get answer from card 42
    const eventQuestions: Record<string, string> = {
      'ferias': 'Quando as suas férias começam?',
      'casamento': 'Quando é o casamento?',
      'pos-gestacao': 'Qual é o seu prazo para perder peso do bebê?',
      'verao': 'Quando você quer ver os resultados para o verão?',
      'aniversario': 'Quando será a festa de aniversário?',
      'reencontro': 'Quando será o reencontro da turma da escola?',
      'familia': 'Quando será a reunião familiar?',
      'esportivo': 'Quando será o evento esportivo?',
      'outro': 'Quando será a ocasião especial?',
      'sem-evento': 'Quando você quer atingir sua meta?'
    };
    return eventQuestions[eventValue] || 'Quando você quer atingir sua meta?';
  };

  const renderQuestion = () => {
    switch (questionData.type) {
      case 'choice':
        return (
          <QuizV2Choice
            question={questionData.question || ''}
            subtitle={questionData.subtitle}
            description={questionData.description}
            options={questionData.options || []}
            onSelect={handleNext}
          />
        );

      case 'multiple':
        return (
          <QuizV2Multiple
            question={questionData.question || ''}
            subtitle={questionData.subtitle}
            options={questionData.options || []}
            onContinue={handleNext}
            buttonText={questionData.buttonText}
          />
        );

      case 'input':
        return (
          <QuizV2Input
            question={questionData.question || ''}
            subtitle={questionData.subtitle}
            description={questionData.description}
            inputType={questionData.inputType || 'text'}
            placeholder={questionData.placeholder}
            unit={questionData.unit}
            onContinue={handleNext}
            buttonText={questionData.buttonText}
            otherValue={
              step === 9 ? answers[8] : // If on weight card (9), pass height (8)
                step === 10 ? answers[9] : // If on goal weight card (10), pass current weight (9)
                  undefined
            }
            measurementType={
              step === 8 ? 'height' :
                step === 9 ? 'weight' :
                  undefined
            }
            showTerms={questionData.showTerms}
            feedbackType={questionData.feedbackType}
          />
        );

      case 'range':
        return (
          <QuizV2Range
            question={questionData.question || ''}
            description={questionData.description}
            min={questionData.min || 1}
            max={questionData.max || 5}
            minLabel={questionData.minLabel}
            maxLabel={questionData.maxLabel}
            onContinue={handleNext}
            buttonText={questionData.buttonText}
          />
        );

      case 'info':
        return (
          <QuizV2Info
            title={questionData.title}
            content={questionData.content || ''}
            infoType={questionData.infoType}
            onContinue={() => handleNext()}
            buttonText={questionData.buttonText}
            image={questionData.image}
          />
        );

      case 'body-focus':
        return (
          <QuizV2BodyFocus
            question={questionData.question || ''}
            subtitle={questionData.subtitle}
            options={questionData.options || []}
            onContinue={handleNext}
            buttonText={questionData.buttonText}
          />
        );

      case 'wheel':
        return (
          <QuizV2Wheel
            question={questionData.question || ''}
            description={questionData.description}
            options={questionData.options || []}
            onContinue={handleNext}
            buttonText={questionData.buttonText}
          />
        );

      case 'analysis':
        return (
          <QuizV2Analysis
            title={questionData.title || 'Analisando...'}
            steps={questionData.analysisSteps || []}
            onComplete={() => handleNext()}
            autoAdvance={questionData.autoAdvance !== false}
          />
        );

      case 'scratch':
        return (
          <QuizV2Scratch
            title={questionData.title}
            subtitle={questionData.subtitle}
            discountPercent={questionData.discountPercent || 50}
            discountText={questionData.discountText || ''}
            onComplete={(couponCode) => {
              // Save coupon code to localStorage
              const userData = localStorage.getItem('quizV2UserData');
              if (userData) {
                const parsed = JSON.parse(userData);
                parsed.couponCode = couponCode;
                localStorage.setItem('quizV2UserData', JSON.stringify(parsed));
              }
              handleNext();
            }}
            buttonText={questionData.buttonText}
          />
        );

      case 'date':
        return (
          <QuizV2DatePicker
            question={getEventDateQuestion()}
            description={questionData.description}
            onContinue={handleNext}
            onSkip={() => handleNext()}
            buttonText={questionData.buttonText}
          />
        );

      case 'visualization':
        return (
          <QuizV2Visualization
            currentWeight={answers[9] ? parseFloat(answers[9].toString().replace(',', '.')) : undefined}
            targetWeight={answers[10] ? parseFloat(answers[10].toString().replace(',', '.')) : undefined}
            name={answers[47] || answers[48] || 'Visitante'}
            onContinue={() => handleNext()}
            buttonText={questionData.buttonText}
            beforeImage={questionData.image}
            bodyParts={answers[11] || []}
            activityLevel={answers[7]}
          />
        );

      case 'bmi-summary':
        return (
          <QuizV2SummaryBMI
            height={answers[8] ? parseFloat(answers[8]) : 0}
            weight={answers[9] ? parseFloat(answers[9]) : 0}
            bodyParts={answers[11] || []}
            activityLevel={answers[7]}
            onContinue={() => handleNext()}
            buttonText={questionData.buttonText}
            image={questionData.image}
          />
        );

      default:
        return (
          <div className="text-center text-white">
            <p>Tipo de pergunta não suportado: {questionData.type}</p>
          </div>
        );
    }
  };

  return (
    <QuizV2Card
      progress={questionData.progress}
      currentStep={step}
      totalSteps={totalSteps}
      isQuestion={!['info', 'analysis', 'scratch', 'visualization'].includes(questionData.type)}
    >
      {renderQuestion()}
    </QuizV2Card>
  );
}
