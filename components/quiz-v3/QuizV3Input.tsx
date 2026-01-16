'use client';

import { useState } from 'react';

interface QuizV3InputProps {
  question: string;
  subtitle?: string;
  description?: string;
  inputType: 'text' | 'email' | 'number';
  placeholder?: string;
  unit?: string;
  onContinue: (value: string) => void;
  buttonText?: string;
  otherValue?: string; // Valor complementar (altura se input for peso, peso se input for altura)
  measurementType?: 'weight' | 'height'; // Tipo do input atual
  showTerms?: boolean; // Mostrar checkbox de termos
  feedbackType?: 'bmi' | 'weight-loss'; // Tipo de feedback dinâmico
}

export default function QuizV3Input({
  question,
  subtitle,
  description,
  inputType,
  placeholder,
  unit,
  onContinue,
  buttonText = "Continuar",
  otherValue,
  measurementType,
  showTerms = false,
  feedbackType
}: QuizV3InputProps) {
  const [value, setValue] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showConsentNotification, setShowConsentNotification] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setShowConsentNotification(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Check for consent notification
    if (showTerms && !termsAccepted && newValue.length >= 3) {
      triggerShake();
    } else {
      setShowConsentNotification(false);
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTermsAccepted(checked);
    if (checked) {
      setShowConsentNotification(false);
    }
  };

  // Calculate BMI if we have both values
  const calculateBMI = (currentVal: string) => {
    if (!otherValue || !measurementType || !currentVal) return null;

    const weight = measurementType === 'weight' ? parseFloat(currentVal) : parseFloat(otherValue);
    const height = measurementType === 'height' ? parseFloat(currentVal) : parseFloat(otherValue);

    if (isNaN(weight) || isNaN(height) || height === 0) return null;

    // Convert height to meters if it's in cm (assuming > 3 meters is unlikely for human height)
    const heightInMeters = height > 3 ? height / 100 : height;

    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi;
  };

  const bmi = calculateBMI(value);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Abaixo do peso', color: 'bg-blue-400', width: '20%' };
    if (bmi < 25) return { label: 'Peso normal', color: 'bg-green-500', width: '40%' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'bg-yellow-500', width: '60%' };
    return { label: 'Obesidade', color: 'bg-red-500', width: '85%' };
  };

  const getBMIFeedback = (bmi: number) => {
    if (bmi < 18.5) return null;

    if (bmi < 25) return {
      subtitle: `O seu IMC é ${bmi.toFixed(1)}, que é considerado normal`,
      text: "Você está começando bem! Usaremos o seu IMC para criar um programa personalizado."
    };

    if (bmi < 30) return {
      subtitle: `O seu IMC é ${bmi.toFixed(1)}, que é considerado sobrepeso`,
      text: "Você tem um pouco de trabalho pela frente, mas é ótimo que esteja dando o primeiro passo. Vamos usar seu IMC para criar um programa de perda de peso para você."
    };

    return {
      subtitle: `O seu IMC é ${bmi.toFixed(1)} e está fora da faixa de peso saudável`,
      text: "Você pode obter muitos benefícios com a perda de peso. Vamos usar seu IMC para criar o programa de perda de peso sob medida."
    };
  };

  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  const bmiFeedback = bmi ? getBMIFeedback(bmi) : null;

  const getWeightLossFeedback = (currentWeight: number, goalWeight: number) => {
    if (!currentWeight || !goalWeight || goalWeight >= currentWeight) return null;

    const loss = currentWeight - goalWeight;
    const percentage = (loss / currentWeight) * 100;

    return {
      subtitle: `💚 Vale a pena: perca ${loss.toFixed(1)}kg (${percentage.toFixed(0)}%) do seu peso`,
      text: "De acordo com pesquisas da Mayo Clinic, pessoas que perdem peso de forma sustentável têm mais do que o dobro de chances de melhorar a saúde."
    };
  };

  const weightLossFeedback = feedbackType === 'weight-loss' && value && otherValue
    ? getWeightLossFeedback(parseFloat(otherValue), parseFloat(value))
    : null;

  const handleContinue = () => {
    if (showTerms && !termsAccepted) {
      triggerShake();
      return;
    }

    if (value.trim()) {
      onContinue(value.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      handleContinue();
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // If clicking on checkbox or label, don't trigger shake
    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"]') || target.closest('label[for="terms"]')) {
      return;
    }

    // If input has 3+ chars, terms required but not accepted -> shake
    if (showTerms && !termsAccepted && value.length >= 3) {
      triggerShake();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-28 sm:pb-32" onClick={handleContainerClick}>
      {/* Question */}
      <div className="text-center space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
          {question}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-600">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto whitespace-pre-line">
            {description}
          </p>
        )}
      </div>

      {/* Input */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type={inputType}
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full bg-white border-2 border-gray-300 focus:border-teal-600 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 text-gray-900 text-lg sm:text-xl placeholder:text-gray-400 outline-none transition-all"
            autoFocus
          />
          {unit && (
            <span className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-gray-400 text-base sm:text-lg">
              {unit}
            </span>
          )}
        </div>

        {/* BMI Visualization */}
        {bmi && bmiCategory && (
          <div className="animate-fade-in space-y-2 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex justify-between items-end mb-1">
              <span className="text-gray-600 text-xs sm:text-sm">Seu IMC estimado:</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{bmi.toFixed(1)}</span>
            </div>

            {/* Bar */}
            <div className="h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden relative">
              {/* Background Zones */}
              <div className="absolute inset-0 flex opacity-20">
                <div className="w-[25%] bg-blue-400"></div>
                <div className="w-[25%] bg-green-500"></div>
                <div className="w-[25%] bg-yellow-500"></div>
                <div className="w-[25%] bg-red-500"></div>
              </div>

              {/* Indicator */}
              <div
                className={`h-full ${bmiCategory.color} transition-all duration-500 ease-out relative`}
                style={{ width: bmiCategory.width }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-lg transform translate-x-1/2"></div>
              </div>
            </div>

            <div className="text-center mt-2">
              <span className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-gray-100 ${bmiCategory.color.replace('bg-', 'text-')}`}>
                {bmiCategory.label}
              </span>
            </div>

            {/* Dynamic Feedback Text */}
            {(bmiFeedback || weightLossFeedback) && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 text-center animate-fade-in">
                <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2">
                  {bmiFeedback?.subtitle || weightLossFeedback?.subtitle}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {bmiFeedback?.text || weightLossFeedback?.text}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Weight Loss Visualization (Only Text) */}
        {weightLossFeedback && !bmi && (
          <div className="animate-fade-in space-y-2 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="text-center animate-fade-in">
              <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2">
                {weightLossFeedback.subtitle}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {weightLossFeedback.text}
              </p>
            </div>
          </div>
        )}

        {/* Terms Checkbox */}
        {showTerms && (
          <div className="mt-4 sm:mt-6 flex items-start gap-3 sm:gap-4 animate-fade-in">
            <div className="relative flex items-center mt-0.5">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="peer h-6 w-6 sm:h-7 sm:w-7 cursor-pointer appearance-none rounded-lg border-2 border-gray-300 bg-white transition-all checked:border-teal-600 checked:bg-teal-600 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
              <svg
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                width="14"
                height="14"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <label htmlFor="terms" className="text-sm sm:text-base text-gray-700 cursor-pointer select-none leading-relaxed">
              Eu concordo que o SoulSync processe meus dados de saúde cadastrados para fornecer serviços e aprimorar minha experiência de usuário. <span className="text-teal-600 underline font-medium">Política de Privacidade</span>.
            </label>
          </div>
        )}

        {/* Consent Notification */}
        {showConsentNotification && (
          <div className={`${isShaking ? 'animate-shake' : ''} bg-red-500 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl flex items-center justify-between shadow-lg mx-auto max-w-md`}>
            <span className="font-medium text-xs sm:text-sm">É necessário o seu consentimento para continuar.</span>
            <button
              onClick={() => setShowConsentNotification(false)}
              className="text-white/80 hover:text-white ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {/* Continue Button - Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-50 flex justify-center">
          <div className="w-full max-w-md">
            <button
              onClick={handleContinue}
              disabled={!value.trim()}
              className={`w-full py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 shadow-lg ${!value.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-600 text-white active:scale-95 sm:hover:scale-105 hover:bg-teal-700'
                }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}
