'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, ArrowRight, Check, Lock, Star } from 'lucide-react';
import { pageview, trackQuizV3CheckoutView, trackQuizV3PurchaseIntent, trackQuizV3FreeTrialStart } from '@/lib/analytics';

interface UserData {
  name?: string;
  email?: string;
  weight?: number;
  height?: number;
  targetWeight?: number;
  couponCode?: string;
}

export default function QuizV3Checkout() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [currentBmi, setCurrentBmi] = useState<number | undefined>(undefined);
  const [targetBmi, setTargetBmi] = useState<number | undefined>(undefined);
  const [weightLoss, setWeightLoss] = useState<number | undefined>(undefined);
  const [openFaq, setOpenFaq] = useState<number | null>(0); // Primeiro FAQ aberto por padrão
  const [eventType, setEventType] = useState<string>(''); // Evento escolhido no card 41
  const [eventDate, setEventDate] = useState<string>(''); // Data do evento do card 42
  const [couponCode, setCouponCode] = useState<string>('HYPNO50'); // Código do cupom dinâmico

  useEffect(() => {
    // Track checkout page view
    pageview('/quiz-v3/checkout');
    trackQuizV3CheckoutView();

    // Load user data from localStorage
    const answers = localStorage.getItem('quizV3Answers');
    const userDataStr = localStorage.getItem('userDataV3');

    if (answers) {
      const parsed = JSON.parse(answers);
      // V3 Step mapping:
      // Height -> 17
      // Weight -> 18
      // Target Weight -> 19
      const height = parsed['17'] ? parseFloat(parsed['17']) : undefined;
      const weight = parsed['18'] ? parseFloat(parsed['18'].toString().replace(',', '.')) : undefined;
      const targetWeight = parsed['19'] ? parseFloat(parsed['19'].toString().replace(',', '.')) : undefined;

      // Get event
      const event = parsed['41'] || '';
      setEventType(event);

      // Get event date
      const date = parsed['42'] || '';
      setEventDate(date);

      setUserData({
        name: parsed['name'] || parsed['1'] || 'Cliente',
        email: parsed['email'] || '',
        weight,
        height,
        targetWeight
      });

      // Generate coupon code based on name
      const name = parsed['name'] || parsed['1'];
      if (name) {
        const cleanName = name.split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        setCouponCode(`${cleanName}50`);
      }

      // Calculate BMI
      if (weight && height) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        setCurrentBmi(Math.round(bmi * 10) / 10);

        if (targetWeight) {
          const targetBmiCalc = targetWeight / (heightInMeters * heightInMeters);
          setTargetBmi(Math.round(targetBmiCalc * 10) / 10);
          setWeightLoss(Math.round((weight - targetWeight) * 10) / 10);
        }
      }
    }

    if (userDataStr) {
      const parsed = JSON.parse(userDataStr);
      setUserData(prev => ({ ...prev, ...parsed }));
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  // Calculate estimated body fat percentage based on BMI
  const getBodyFatEstimate = (bmi: number) => {
    // Simple estimation formula (not medical accuracy, just for visualization)
    if (bmi < 18.5) return 15;
    if (bmi < 25) return 20;
    if (bmi < 30) return 28;
    if (bmi < 35) return 35;
    return 40;
  };

  const currentBodyFat = currentBmi ? getBodyFatEstimate(currentBmi) : undefined;
  const targetBodyFat = targetBmi ? getBodyFatEstimate(targetBmi) : undefined;

  // Get personalized text based on event
  const getEventText = () => {
    const eventTexts: Record<string, string> = {
      'ferias': 'para suas férias',
      'casamento': 'para o casamento',
      'pos-gestacao': 'para perder o peso da gestação',
      'verao': 'para o verão',
      'aniversario': 'para a festa de aniversário',
      'reencontro': 'para o reencontro da turma',
      'familia': 'para a reunião de família',
      'esportivo': 'para o evento esportivo',
      'outro': 'para a ocasião especial',
      'sem-evento': ''
    };
    return eventTexts[eventType] || '';
  };

  const handleCheckout = () => {
    // Track purchase intent
    trackQuizV3PurchaseIntent('4 semanas', 39);

    // Prepare user data for checkout
    const checkoutUrl = new URL('https://checkout.payt.com.br/32addda23f51e6c2b5607e9d1b66a366'); // Link do produto de R$ 14,97

    if (userData.name) checkoutUrl.searchParams.set('name', userData.name);
    if (userData.email) checkoutUrl.searchParams.set('email', userData.email);
    // if (userData.phone) checkoutUrl.searchParams.set('phone', userData.phone);

    // Redirect to PayT
    window.location.href = checkoutUrl.toString();
  };

  const faqs = [
    {
      question: "O que acontece depois que eu faço o pedido?",
      answer: "Após você fazer seu pedido, começamos a trabalhar! Com base nas respostas que você deu no questionário, criaremos um programa personalizado de acordo com suas necessidades.",
    },
    {
      question: "Como posso cancelar minha assinatura?",
      answer: "Os cancelamentos são tratados diretamente com a Apple e podem ser solicitados seguindo as instruções aqui. Caso ainda tenha alguma dúvida sobre como cancelar sua assinatura, entre em contato conosco pelo e-mail contato@soulsync.com.",
    },
    {
      question: "É seguro usar a auto-hipnose?",
      answer: "A auto-hipnoterapia é um procedimento completamente seguro.",
    },
    {
      question: "O que acontece se eu adormecer durante a sessão?",
      answer: "É perfeitamente normal e seguro adormecer durante uma sessão de hipnose. Na verdade, isso comprova que você entrou em uma fase de relaxamento profundo, na qual a hipnose é mais eficaz. Caso isso aconteça com você e você queira rever sua sessão de sono, poderá fazê-lo selecionando o dia anterior no aplicativo SoulSync.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header com Timer e CTA */}
      <div className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="relative bg-red-50 border border-red-100 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <div className="bg-red-100 p-1.5 rounded-lg">
                  <Timer className="w-4 h-4 text-red-600 animate-pulse" />
                </div>
                <div>
                  <p className="text-red-900/60 text-[10px] uppercase tracking-wider font-semibold">Oferta expira em</p>
                  <div className="text-lg font-bold text-red-600 font-mono leading-none">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-teal-600 text-white px-6 py-2.5 rounded-full font-bold text-sm sm:text-base hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20"
          >
            RECEBER MEU PLANO
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Título Principal com Nome Dinâmico */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            <span>Com base</span>
            <br />
            <span>nas suas respostas,</span>
            <br />
            <span>você pode </span>
            <span className="text-teal-600">atingir</span>
            <br />
            <span className="text-teal-600">
              {weightLoss ? `${Math.round(weightLoss * 0.85)}kg` : '85%'} da sua meta
            </span>
            {getEventText() && (
              <>
                <br />
                <span className="text-teal-600">
                  {getEventText()}
                </span>
              </>
            )}
            <br />
            <span>em 4 semanas.</span>
          </h1>
          {userData.name && (
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Eis o que prevemos com base em mais de 24.000 usuários com IMC e hábitos alimentares semelhantes.
            </p>
          )}
        </div>

        {/* Card de Transformação - Antes/Depois */}
        <div className="mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 overflow-hidden">

            <div className="flex gap-2 mb-6">
              <div className="flex-1 bg-gray-100 rounded-2xl px-6 py-3 text-center text-gray-600 font-semibold">
                Agora
              </div>
              <div className="flex-1 bg-teal-600 rounded-2xl px-6 py-3 text-center text-white font-semibold shadow-md shadow-teal-600/20">
                Meta
              </div>
            </div>

            {/* Comparação Visual */}
            <div className="relative mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-inner">
                <img
                  src="/images/before-after.png"
                  alt="Transformação antes e depois"
                  className="w-full h-auto object-cover opacity-90"
                />

                {/* Seta Central */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10">
                  <div className="bg-teal-600 rounded-full p-2">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Comparativos */}
            <div className="grid grid-cols-2 gap-8 px-2">
              {/* ANTES */}
              <div className="space-y-6">
                <div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Peso</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.weight ? `${userData.weight} kg` : '-- kg'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Gordura corporal</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {currentBodyFat ? `${currentBodyFat}%+` : '--%'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Nível de energia</div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-full bg-red-400 rounded-full"></div>
                    <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                    <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                    <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* DEPOIS */}
              <div className="space-y-6">
                <div>
                  <div className="text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">Objetivo de peso</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {userData.targetWeight ? `${userData.targetWeight} kg` : '-- kg'}
                  </div>
                </div>
                <div>
                  <div className="text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">Gordura corporal</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {targetBodyFat ? `${targetBodyFat - 6}-${targetBodyFat}%` : '--%'}
                  </div>
                </div>
                <div>
                  <div className="text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">Nível de energia</div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-full bg-teal-500 rounded-full"></div>
                    <div className="h-2 w-full bg-teal-500 rounded-full"></div>
                    <div className="h-2 w-full bg-teal-500 rounded-full"></div>
                    <div className="h-2 w-full bg-teal-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cupom de Desconto - Ticket Style */}
        <div className="bg-white rounded-3xl p-1 mb-10 shadow-lg border border-teal-100">
          <div className="bg-teal-50 rounded-[22px] border border-teal-100 overflow-hidden relative">

            {/* Top Part: Title */}
            <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-2xl">
                🎉
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Seu código promocional foi aplicado!
              </h3>
            </div>

            {/* Separator Line with Semicircles (Rips) */}
            <div className="relative h-6 w-full my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-teal-200"></div>
              </div>
              {/* Left Rip - Matches white wrapper background */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full -translate-x-1/2 border-r border-teal-100 shadow-[inset_-2px_0_3px_-2px_rgba(0,0,0,0.05)]"></div>
              {/* Right Rip - Matches white wrapper background */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full translate-x-1/2 border-l border-teal-100 shadow-[inset_2px_0_3px_-2px_rgba(0,0,0,0.05)]"></div>
            </div>

            {/* Bottom Part: Code & Timer */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pb-8 pt-4 px-6">

              <div className="bg-white border-2 border-dashed border-teal-300 rounded-xl px-8 py-4 flex items-center gap-3 shadow-sm">
                <span className="text-teal-500 text-xl">🏷️</span>
                <span className="text-2xl font-bold text-teal-700 tracking-wider">{couponCode}</span>
              </div>

              <div className="bg-teal-100/50 px-6 py-3 rounded-xl border border-teal-100/50 text-center">
                <div className="text-xs text-teal-600 font-bold uppercase tracking-wide mb-1 opacity-70">Expira em</div>
                <div className="text-3xl font-bold text-teal-600 font-mono leading-none tracking-tight">{formatTime(timeLeft)}</div>
              </div>

            </div>
          </div>
        </div>

        {/* Card de Bônus - Acelerador */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-teal-200 transition-all">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">
                🚀
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Acelerador de perda de peso</h3>
                <p className="text-gray-500 text-sm">Acelere seus resultados com nosso curso</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">Grátis</div>
              <div className="text-gray-400 line-through text-sm">R$ 199</div>
            </div>
          </div>
        </div>

        {/* Bloco de Seleção de Planos */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Adquira seu Plano Personalizado
            </h2>
            <p className="text-teal-600 font-medium mt-1">
              + Acelerador de Perda de Peso incluso
            </p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Plano 1 Mês - Selecionado */}
            <div onClick={handleCheckout} className="bg-white border-2 border-teal-600 rounded-3xl p-6 cursor-pointer shadow-xl shadow-teal-600/5 relative transform scale-[1.02] transition-transform">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Mais Popular
              </div>

              <div className="flex items-center justify-between mb-4 mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-[6px] border-teal-600 bg-white"></div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">4 SEMANAS</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 line-through">R$ 99,90</span>
                      <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">R$ 14,97</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">R$ 0,50</div>
                  <div className="text-sm text-gray-500">por dia</div>
                </div>
              </div>

              <div className="bg-teal-50 rounded-xl p-3 flex items-center gap-3 text-sm text-teal-900 font-medium">
                <span className="text-lg">🎁</span>
                Receba um presente surpresa!
              </div>
            </div>
          </div>

          {/* Prova Social */}
          <div className="mt-8 max-w-2xl mx-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-4 items-start">
            <div className="bg-blue-100 text-blue-600 rounded-full p-1.5 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900 block mb-1">Eficácia Comprovada</p>
              <p className="text-gray-600 mb-2">Quem completa o plano de 4 semanas tem 3x mais chances de manter o peso ideal a longo prazo*</p>
              <p className="text-xs text-gray-400">
                * Dados de pesquisa de 2023 com usuários do SoulSync
              </p>
            </div>
          </div>
        </div>

        {/* Giant CTA */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1 text-sm font-medium text-gray-600">
              <div className="flex text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="ml-2">Junte-se a 187.432 pessoas</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-teal-600 text-white py-5 rounded-2xl font-bold text-xl shadow-lg shadow-teal-600/30 hover:bg-teal-700 hover:scale-[1.01] transition-all"
          >
            COMEÇAR AGORA
            <span className="block text-sm font-normal text-teal-100 mt-1 opacity-90">Acesso imediato • R$ 0,50/dia</span>
          </button>

          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Compra Segura
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3 h-3" /> Garantia de 30 dias
            </span>
          </div>

          {/* Free Trial Button */}
          <button
            onClick={() => {
              trackQuizV3FreeTrialStart();
              localStorage.removeItem('hasSeenOnboarding');
              const testToken = 'test-free-trial-' + Date.now();
              const testUser = {
                name: userData.name || 'Usuário Teste',
                email: userData.email || 'teste@soulsync.com',
                planType: 'free-trial'
              };
              localStorage.setItem('accessToken', testToken);
              localStorage.setItem('userData', JSON.stringify(testUser));
              localStorage.setItem('isFreeTrial', 'true');
              router.push(`/membros?token=${testToken}`);
            }}
            className="w-full mt-4 py-4 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <span>🎁</span> Teste Grátis por 7 Dias
          </button>

          {/* Card de Presente Secreto (V3 Light Theme) */}
          <div className="bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-2xl p-6 mt-6 shadow-lg border border-teal-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-teal-200 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>

            <h3 className="text-gray-900 font-bold text-lg mb-4 relative z-10 text-center sm:text-left">
              Incluso no seu plano:
            </h3>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-teal-100 text-center relative z-10 shadow-sm">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-white to-teal-50 rounded-2xl flex items-center justify-center border border-teal-100 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl drop-shadow-sm">🎁</span>
                </div>
              </div>

              <h4 className="text-2xl font-bold text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text mb-2">
                presente secreto
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
                A equipe do SoulSync quer apoiar sua relação com a comida e sua transformação, por isso preparamos uma surpresa para você!
              </p>
            </div>
          </div>
        </div>

        {/* Benefícios Detalhados (V2 Layout Adapted) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            O que você recebe
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            Baseado nas suas respostas, criamos um plano personalizado de hipnoterapia especialmente para você.
            O programa define objetivos individuais e um programa adaptado para alcançar seus resultados nas primeiras semanas.
          </p>

          <div className="space-y-8 max-w-3xl mx-auto">
            {/* Item 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                <Check className="w-6 h-6" />
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 flex-1 border border-gray-100">
                <div className="text-gray-900 font-bold text-xl mb-2">
                  Sessões de hipnose personalizadas
                </div>
                <div className="text-teal-600 font-medium mb-3 border-b border-gray-200 pb-2 inline-block">
                  Baseadas nas suas dores e objetivos
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>30+ sessões de áudio (15-25 min cada)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Técnicas de visualização avançada</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                <Check className="w-6 h-6" />
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 flex-1 border border-gray-100">
                <div className="text-gray-900 font-bold text-xl mb-2">
                  Reprogramação mental profunda
                </div>
                <div className="text-teal-600 font-medium mb-3 border-b border-gray-200 pb-2 inline-block">
                  Elimine a causa raiz do problema
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Sugestões pós-hipnóticas poderosas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Elimine desejos incontroláveis</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                <Check className="w-6 h-6" />
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 flex-1 border border-gray-100">
                <div className="text-gray-900 font-bold text-xl mb-2">
                  Meditações anti-ansiedade
                </div>
                <p className="text-gray-600 leading-relaxed">
                  15+ meditações guiadas para controlar a ansiedade e o estresse que levam à compulsão alimentar
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                <Check className="w-6 h-6" />
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 flex-1 border border-gray-100">
                <div className="text-gray-900 font-bold text-xl mb-2">
                  Técnicas de autocontrole
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Protocolo de 60 segundos para usar em momentos de desejo incontrolável
                </p>
              </div>
            </div>

            {/* Item 5 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                <Check className="w-6 h-6" />
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 flex-1 border border-gray-100">
                <div className="text-gray-900 font-bold text-xl mb-2">
                  Acompanhamento de progresso
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Gráficos visuais e celebração de marcos para manter a motivação
                </p>
              </div>
            </div>



          </div>

          {/* Bônus Inside Features */}
          <div className="mt-10 bg-gradient-to-br from-teal-600 to-indigo-600 rounded-2xl p-6 text-white text-center sm:text-left sm:flex items-center gap-6 shadow-lg">
            <div className="text-4xl mb-4 sm:mb-0 bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto sm:mx-0">
              🎁
            </div>
            <div>
              <h4 className="border-b border-white/20 pb-1 mb-1 inline-block text-teal-100 text-sm font-semibold uppercase tracking-wider">Bônus Exclusivo</h4>
              <h3 className="font-bold text-xl mb-1">Acelerador Mental de 7 Dias</h3>
              <p className="text-teal-100 text-sm mb-2">Protocolo intensivo para iniciar sua transformação com resultados visíveis.</p>
              <p className="text-white/90 text-sm font-medium">(Valor: R$ 97,00) - GRÁTIS</p>
            </div>
          </div>
        </div>

        {/* Bloco de Autoridade */}
        <div className="text-center mb-12">
          <p className="text-base sm:text-lg font-bold text-gray-400 uppercase tracking-widest mb-6">Conforme apresentado em</p>
          <img
            src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763608547/soulsync/authority/featured-in-logos.png"
            alt="Media Logos"
            className="h-14 sm:h-20 object-contain mx-auto opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* CLONED FROM V2: Card #1 Walking App */}
        <div className="relative bg-white rounded-3xl p-8 mb-8 max-w-2xl mx-auto border border-gray-200 shadow-xl overflow-hidden">
          {/* Efeito de brilho no fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-50 to-transparent blur-3xl"></div>

          <div className="relative flex flex-col items-center text-center">
            {/* Imagem do badge */}
            <div className="bg-teal-50 rounded-2xl p-4 mb-6">
              <img
                src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763605594/soulsync/social-proof/walking-app-badge.png"
                alt="#1 Walking app"
                className="w-64 h-auto"
              />
            </div>

            {/* Texto principal */}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Comece a perder peso agora mesmo
            </h2>

            {/* Subtexto */}
            <p className="text-gray-500 text-sm mb-6">
              *AppMagic, 2022, downloads para Android e iOS
            </p>

            {/* Botão CTA */}
            <button
              onClick={handleCheckout}
              className="bg-teal-600 text-white px-12 py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-teal-600/30 transition-all duration-300 shadow-lg"
            >
              RECEBER O MEU PLANO
            </button>
          </div>
        </div>

        {/* Método de Pagamento - Expanded V2 Clone */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl max-w-2xl mx-auto border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Método de pagamento
          </h2>
          <p className="text-gray-500 text-center mb-6">
            O SoulSync usará suas informações de pagamento para simplificar os futuros pagamentos.
          </p>

          <div className="border border-teal-200 rounded-2xl p-6 mb-4 bg-teal-50/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-teal-600 bg-teal-600 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
                <span className="font-bold text-gray-900 text-lg">PIX / Cartão de Crédito</span>
              </div>
              <div className="flex gap-2 text-2xl">
                💳
              </div>
            </div>

            <div className="space-y-3 ml-8 mb-6">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Opção de pagamento rápida e prática</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Mantém suas informações financeiras seguras com criptografia de ponta a ponta.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Usamos a avançada proteção antifraudes oferecida pelo nosso processador de pagamentos.</span>
              </div>
            </div>

            <div className="flex items-start gap-2 ml-8 mb-6 relative z-10">
              <input type="checkbox" className="mt-1 w-4 h-4 text-teal-600 rounded" id="consent" />
              <label htmlFor="consent" className="text-sm text-gray-500 font-medium">
                Eu permito explicitamente que o SoulSync armazene minhas informações de pagamento para simplificar as futuras transações
              </label>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Lock className="w-5 h-5" />
              Confirmar compra
            </button>

            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-500">PAGAMENTO SEGURO</span>
                <span className="text-xs text-gray-400">SSL/TLS Encryption</span>
              </div>
            </div>

            {/* Bandeiras */}
            <div className="mt-4 flex items-center justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">VISA</div>
              <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">MC</div>
              <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">AMEX</div>
              <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">PIX</div>
            </div>

          </div>

          {/* Info Footer */}
          <div className="space-y-4 text-sm text-gray-500 px-4">
            <p>Você pode ficar com nosso curso introdutório de perda de peso, mesmo se decidir que o SoulSync não combina com você.</p>
            <p>Você precisará de um iPhone ou um smartphone Android para usar o aplicativo SoulSync.</p>
          </div>
        </div>

        {/* Card de Garantia de 30 Dias */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 mb-8 max-w-2xl mx-auto border border-gray-200 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0 order-first sm:order-last">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
                <img
                  src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1768476408/soulsync/seals/garantia-30-dias.png"
                  alt="Selo de Garantia 30 dias"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Garantia de devolução
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Estamos confiantes com a qualidade do nosso serviço e seus resultados. Então, se você quiser dar o primeiro passo para alcançar seus objetivos, experimente o SoulSync! Se você não gostar dos resultados, basta nos informar dentro de 30 dias após a compra, e nós providenciaremos um reembolso total.
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Saiba mais sobre os limites aplicáveis na nossa{' '}
                <a href="#" className="text-teal-600 underline hover:text-teal-700 transition-colors">
                  Política de Cancelamento e Reembolso
                </a>.
              </p>
            </div>
          </div>
        </div>

        {/* Depoimentos */}
        <div className="bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-3xl p-8 mb-8 shadow-xl max-w-2xl mx-auto border border-teal-100">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex text-yellow-400 text-xl">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <span className="text-gray-900 font-bold">4.6/5</span>
              <span className="text-gray-500 text-sm">(mais de 1000 avaliações)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Por que <span className="text-teal-600">os usuários</span>
            </h2>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              adoram o <span className="text-teal-600">SoulSync?</span>
            </h2>
          </div>

          <div className="space-y-6">
            {/* Depoimento 1 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609993/soulsync/testimonials/testimonial-1.webp" alt="Jasmim Z." className="w-full h-auto" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                  <div className="text-gray-400 text-sm">27 de junho</div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">SoulSync transformou meu corpo de maneiras que eu jamais imaginei. Recomendo para todas as mulheres que buscam algo diferente e que realmente funciona!</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-bold">Jasmim Z.</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> VERIFICADO
                  </div>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609994/soulsync/testimonials/testimonial-2.webp" alt="José S." className="w-full h-auto" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                  <div className="text-gray-400 text-sm">24 de junho</div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">Finalmente parei de comer compulsivamente e comecei a me exercitar. SoulSync foi a única coisa que funcionou para mim.</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-bold">José S.</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> VERIFICADO
                  </div>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609995/soulsync/testimonials/testimonial-3.webp" alt="Simona K." className="w-full h-auto" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                  <div className="text-gray-400 text-sm">19 de junho</div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">Experiência fenomenal. O aplicativo SoulSync é o principal motivo da minha mudança. Ser saudável agora é muito fácil, acontece naturalmente.</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-bold">Simona K.</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> VERIFICADO
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleCheckout}
              className="w-full max-w-md bg-teal-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-teal-700 hover:shadow-lg transition-all"
            >
              Comprar agora!
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg max-w-2xl mx-auto border border-gray-200">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">As pessoas nos perguntam:</h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg">{faq.question}</span>
                  <span className={`text-teal-600 text-2xl transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mb-12 max-w-2xl mx-auto text-center">
          <button
            onClick={handleCheckout}
            className="w-full bg-teal-600 text-white py-6 rounded-full font-bold text-2xl hover:bg-teal-700 shadow-xl shadow-teal-600/20 transition-all hover:scale-[1.02]"
          >
            🚀 RECEBER O MEU PLANO - R$ 0,50/dia
          </button>
          <p className="text-gray-400 text-sm mt-4">Acesso instantâneo ao programa completo</p>
        </div>

        {/* Trust Signals */}
        <div className="bg-white rounded-3xl p-8 mb-12 shadow-xl max-w-2xl mx-auto border border-gray-200">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600">
                <Check className="w-6 h-6" />
              </div>
              <div className="text-gray-900 font-bold mb-1">Garantia 30 dias</div>
              <div className="text-gray-500 text-sm">Reembolso total</div>
            </div>
            <div>
              <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600">
                <Lock className="w-6 h-6" />
              </div>
              <div className="text-gray-900 font-bold mb-1">Acesso imediato</div>
              <div className="text-gray-500 text-sm">Programa completo</div>
            </div>
            <div>
              <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600">
                <Check className="w-6 h-6" />
              </div>
              <div className="text-gray-900 font-bold mb-1">Suporte dedicado</div>
              <div className="text-gray-500 text-sm">Via chat</div>
            </div>
            <div>
              <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600">
                <Lock className="w-6 h-6" />
              </div>
              <div className="text-gray-900 font-bold mb-1">Pagamento seguro</div>
              <div className="text-gray-500 text-sm">100% criptografado</div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center text-gray-400 text-sm pb-10 space-y-4">
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-gray-600">Política de Privacidade</a>
            <a href="#" className="hover:text-gray-600">Política de Reembolso</a>
            <a href="#" className="hover:text-gray-600">Termos de Uso</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Pagamento seguro garantido</span>
          </div>
          <div className="flex items-center justify-center gap-4 opacity-70">
            <span className="font-bold text-xs uppercase">Visa</span>
            <span className="font-bold text-xs uppercase">Mastercard</span>
            <span className="font-bold text-xs uppercase">Amex</span>
            <span className="font-bold text-xs uppercase">Pix</span>
          </div>
        </div>

      </div>
    </div>
  );
}
