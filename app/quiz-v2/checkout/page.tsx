'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Timer } from 'lucide-react';
import { pageview, trackCheckoutView, trackPurchaseIntent, trackFreeTrialStart } from '@/lib/analytics';

interface UserData {
  name?: string;
  email?: string;
  weight?: number;
  height?: number;
  targetWeight?: number;
  couponCode?: string;
}

export default function QuizV2Checkout() {
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
    pageview('/quiz-v2/checkout');
    trackCheckoutView();

    // Load user data from localStorage
    const answers = localStorage.getItem('quizV2Answers');
    const userDataStr = localStorage.getItem('quizV2UserData');

    if (answers) {
      const parsed = JSON.parse(answers);
      const height = parsed['8'] ? parseFloat(parsed['8']) : undefined;
      const weight = parsed['9'] ? parseFloat(parsed['9'].toString().replace(',', '.')) : undefined;
      const targetWeight = parsed['10'] ? parseFloat(parsed['10'].toString().replace(',', '.')) : undefined;

      // Get event from card 41
      const event = parsed['41'] || '';
      setEventType(event);

      // Get event date from card 42
      const date = parsed['42'] || '';
      setEventDate(date);

      setUserData({
        name: parsed['47'] || 'Cliente',
        email: parsed['46'] || '',
        weight,
        height,
        targetWeight
      });

      // Generate coupon code based on name
      const name = parsed['47'];
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
    trackPurchaseIntent('4 semanas', 39);

    // TODO: Integração com pagamento (LastLink)
    alert('Integração com pagamento será implementada aqui!');
  };

  return (
    <div className="min-h-screen bg-hypno-bg">
      {/* Header com Timer e CTA */}
      <div className="bg-hypno-dark/80 backdrop-blur-sm sticky top-0 z-50 border-b border-hypno-purple/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
              <div className="relative bg-hypno-dark border border-red-500/30 rounded-xl px-4 py-2 flex items-center gap-3">
                <div className="bg-red-500/10 p-2 rounded-lg">
                  <Timer className="w-5 h-5 text-red-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Oferta expira em</p>
                  <div className="text-xl font-bold text-white font-mono leading-none">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-gradient-to-r from-hypno-purple to-hypno-accent text-white px-8 py-3 rounded-full font-bold hover:scale-105 hover:shadow-hypno-accent/50 transition-all shadow-lg"
          >
            RECEBER O MEU PLANO
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Título Principal com Nome Dinâmico */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            {userData.name && (
              <>
                <span className="text-white">{userData.name}, com base</span>
                <br />
                <span className="text-white">nas suas respostas,</span>
                <br />
                <span className="text-white">você pode </span>
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">atingir</span>
                <br />
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                  {weightLoss ? `${Math.round(weightLoss * 0.85)}kg` : '85%'} da sua meta
                </span>
                {getEventText() && (
                  <>
                    <br />
                    <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                      {getEventText()}
                    </span>
                  </>
                )}
                <br />
                <span className="text-white">em 4 semanas.</span>
              </>
            )}
            {!userData.name && (
              <span>Seu plano de hipnoterapia está pronto!</span>
            )}
          </h1>
          {userData.name && (
            <p className="text-white/70 text-sm max-w-2xl mx-auto">
              Eis o que prevemos com base em mais de 24.000 usuários com IMC e hábitos alimentares semelhantes.
            </p>
          )}
        </div>

        {/* Card de Transformação - Antes/Depois */}
        <div className="mb-8">
          <div className="relative bg-gradient-to-br from-hypno-accent/20 via-hypno-dark/90 to-hypno-purple/30 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto border-2 border-hypno-accent/40 overflow-hidden">
            {/* Efeito de brilho no fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hypno-accent/10 to-transparent blur-3xl"></div>

            {/* Conteúdo relativo */}
            <div className="relative">
              {/* Tabs Agora/Meta */}
              <div className="flex gap-2 mb-6">
                <div className="flex-1 bg-hypno-dark/60 rounded-2xl px-6 py-3 text-center border border-white/20">
                  <span className="text-white/90 font-semibold text-lg">Agora</span>
                </div>
                <div className="flex-1 bg-gradient-to-r from-hypno-purple to-hypno-accent rounded-2xl px-6 py-3 text-center shadow-md shadow-hypno-accent/30">
                  <span className="text-white font-semibold text-lg">Meta</span>
                </div>
              </div>

              {/* Comparação Visual */}
              <div className="relative mb-6">
                {/* Imagem de Antes/Depois */}
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src="/images/before-after.png"
                    alt="Transformação antes e depois"
                    className="w-full h-auto object-cover"
                  />

                  {/* Overlay gradiente - lado esquerdo (antes) mais acinzentado */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 opacity-30 via-transparent to-transparent pointer-events-none"></div>

                  {/* Overlay gradiente - lado direito (depois) com azul vibrante */}
                  <div className="absolute inset-0 bg-gradient-to-l from-hypno-accent opacity-25 via-hypno-accent to-transparent pointer-events-none"></div>

                  {/* Seta Cyan Sobreposta com efeito de brilho */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 bg-hypno-accent rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-hypno-purple to-hypno-accent rounded-full p-3 shadow-lg shadow-hypno-accent/50">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Comparativos */}
            <div className="relative grid grid-cols-2 gap-4">
              {/* ANTES - Dados */}
              <div className="space-y-4">
                <div>
                  <div className="text-white/60 font-semibold mb-1">Peso</div>
                  <div className="text-2xl font-bold text-white">
                    {userData.weight ? `${userData.weight} kg` : '-- kg'}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 font-semibold mb-1">Gordura corporal</div>
                  <div className="text-2xl font-bold text-white">
                    {currentBodyFat ? `${currentBodyFat}%+` : '--%'}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 font-semibold mb-1">Nível de energia</div>
                  <div className="flex gap-1">
                    <div className="w-8 h-2 bg-red-400 rounded-full"></div>
                    <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                    <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                    <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* DEPOIS - Dados */}
              <div className="space-y-4">
                <div>
                  <div className="text-hypno-accent font-semibold mb-1">Objetivo de peso</div>
                  <div className="text-2xl font-bold text-hypno-accent">
                    {userData.targetWeight ? `${userData.targetWeight} kg` : '-- kg'}
                  </div>
                </div>
                <div>
                  <div className="text-hypno-accent font-semibold mb-1">Gordura corporal</div>
                  <div className="text-2xl font-bold text-hypno-accent">
                    {targetBodyFat ? `${targetBodyFat - 6}-${targetBodyFat}%` : '--%'}
                  </div>
                </div>
                <div>
                  <div className="text-hypno-accent font-semibold mb-1">Nível de energia</div>
                  <div className="flex gap-1">
                    <div className="w-8 h-2 bg-hypno-accent rounded-full"></div>
                    <div className="w-8 h-2 bg-hypno-accent rounded-full"></div>
                    <div className="w-8 h-2 bg-hypno-accent rounded-full"></div>
                    <div className="w-8 h-2 bg-hypno-accent rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cupom de Desconto com Timer */}
        <div className="relative bg-hypno-dark/80 backdrop-blur-sm rounded-3xl overflow-hidden mb-8 max-w-2xl mx-auto border border-hypno-accent/30">
          {/* Header com ícone e título */}
          <div className="flex items-center justify-center gap-3 pt-6 pb-5 px-6">
            <div className="w-7 h-7 bg-hypno-accent rounded-md flex items-center justify-center transform rotate-45">
              <svg className="w-4 h-4 text-hypno-dark transform -rotate-45" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Seu código promocional foi aplicado!
            </h3>
          </div>

          {/* Linha pontilhada horizontal com semicírculos */}
          <div className="relative">
            <div className="border-t-2 border-dashed border-white/20"></div>
            {/* Semicírculo esquerdo */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-hypno-bg rounded-full -translate-x-1/2"></div>
            {/* Semicírculo direito */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-hypno-bg rounded-full translate-x-1/2"></div>
          </div>

          {/* Conteúdo: Código e Timer */}
          <div className="flex items-center justify-between px-8 py-6 bg-hypno-dark/60">
            {/* Código do cupom */}
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-hypno-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-lg font-medium text-white">{couponCode}</span>
            </div>

            {/* Timer */}
            <div className="text-center bg-hypno-purple/40 px-8 py-3 rounded-lg border border-hypno-accent/30">
              <div className="text-4xl font-bold text-hypno-accent leading-none mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                <span>minutos</span>
                <span>:</span>
                <span>segundos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Bônus - Acelerador de perda de peso */}
        <div className="bg-hypno-dark/80 backdrop-blur-sm border-2 border-hypno-accent rounded-2xl overflow-hidden mb-8 max-w-2xl mx-auto shadow-lg">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <h3 className="font-bold text-white text-lg">Acelerador de perda de peso</h3>
                <p className="text-white/60 text-sm">Acelere seus resultados com nosso curso</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-hypno-accent">R$ 0</div>
              <div className="text-white/40 line-through text-sm">R$ 199</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-hypno-purple to-hypno-accent text-white text-center py-3 font-bold">
            EXPIRA EM: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Bloco de Seleção de Planos */}
        <div className="mb-8 max-w-2xl mx-auto">
          {/* Título */}
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-2">
            Adquira seu Plano Personalizado
          </h2>
          <h3 className="text-center text-2xl sm:text-3xl font-bold text-hypno-accent mb-2">
            + Acelerador de Perda de Peso
          </h3>
          <p className="text-center text-white/80 font-semibold mb-6">
            antes que seja tarde demais!
          </p>

          {/* Opções de Planos */}
          <div className="space-y-4 mb-6">


            {/* Plano 1 Mês - Selecionado */}
            <div className="bg-hypno-dark/60 border-2 border-hypno-accent rounded-2xl p-5 cursor-pointer shadow-lg shadow-hypno-accent/20 relative">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-hypno-purple to-hypno-accent text-white px-4 py-1 rounded-full text-xs font-bold">
                MAIS POPULAR
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-hypno-accent bg-hypno-accent flex items-center justify-center">
                    <div className="w-3 h-3 bg-hypno-dark rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-bold text-white">4 SEMANAS</div>
                    <div className="text-sm">
                      <span className="text-white/40 line-through">R$ 99</span>
                      <span className="ml-2 font-bold text-hypno-accent">R$ 39</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-hypno-accent">R$ 1,30</div>
                  <div className="text-sm text-white/60">por dia</div>
                </div>
              </div>
              {/* Badge de presente surpresa */}
              <div className="ml-10 bg-gradient-to-r from-hypno-purple to-hypno-accent text-white px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-bold">
                <span>🎁</span>
                <span>Receba um presente surpresa!</span>
              </div>
            </div>


          </div>

          {/* Prova Social */}
          <div className="bg-hypno-purple/30 border-l-4 border-hypno-accent p-4 mb-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👍</span>
              <div>
                <p className="text-white font-semibold mb-1">
                  Quem completa o plano de 4 semanas tem 3x mais chances de manter o peso ideal a longo prazo*
                </p>
                <p className="text-white/60 text-xs">
                  * Dados de pesquisa de 2023 com usuários do SoulSync
                </p>
              </div>
            </div>
          </div>

          {/* Botão CTA */}
          {/* Giant CTA */}
          <div className="space-y-4 mb-8">
            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 text-xs text-white/80">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                <span>Junte-se a 187.432 pessoas</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="group relative w-full bg-gradient-to-r from-hypno-purple to-hypno-accent text-white py-6 rounded-2xl font-bold text-2xl hover:scale-[1.02] hover:shadow-2xl hover:shadow-hypno-accent/60 transition-all duration-300 shadow-lg shadow-hypno-accent/40 overflow-hidden animate-pulse-slow"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 skew-x-12 -translate-x-full"></div>
              <span className="relative z-10 flex flex-col items-center leading-tight">
                <span>COMEÇAR AGORA</span>
                <span className="text-sm font-normal opacity-90">Acesso imediato • R$ 1,30/dia</span>
              </span>
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Compra Segura</span>
              <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Garantia de 30 dias</span>
            </div>

            {/* Free Trial Button */}
            <button
              onClick={() => {
                // Track free trial start
                trackFreeTrialStart();

                // Limpar onboarding para sempre mostrar
                localStorage.removeItem('hasSeenOnboarding');

                // Criar token de teste válido
                const testToken = 'test-free-trial-' + Date.now();

                // Criar dados de usuário de teste
                const testUser = {
                  name: userData.name || 'Usuário Teste',
                  email: userData.email || 'teste@soulsync.com',
                  planType: 'free-trial'
                };

                // Salvar token e dados do usuário
                localStorage.setItem('accessToken', testToken);
                localStorage.setItem('userData', JSON.stringify(testUser));
                localStorage.setItem('isFreeTrial', 'true');

                // Redirecionar para membros com o token como parâmetro
                router.push(`/membros?token=${testToken}`);
              }}
              className="w-full py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg border-2 border-white/20 mt-4"
            >
              🎁 Teste Grátis por 7 Dias
            </button>
          </div>

          {/* Card de Presente Secreto - Aparece quando seleciona 3 meses */}
          <div className="bg-gradient-to-br from-hypno-purple via-hypno-dark to-hypno-purple/80 rounded-2xl p-6 mt-6 border-2 border-hypno-accent/50 shadow-lg shadow-hypno-accent/20">
            <h3 className="text-white font-bold text-lg mb-4">
              Incluso no seu plano:
            </h3>
            <div className="bg-hypno-dark/60 backdrop-blur-sm rounded-xl p-6 border-2 border-hypno-accent/40 text-center">
              {/* Ícone de presente com efeito brilhante */}
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-hypno-accent to-hypno-purple rounded-2xl blur-xl opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-hypno-dark to-hypno-purple rounded-2xl p-6 border-2 border-hypno-accent/50">
                  <span className="text-6xl">🎁</span>
                </div>
              </div>

              <h4 className="text-2xl font-bold text-hypno-accent mb-2">
                presente secreto
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                A equipe do SoulSync quer apoiar sua relação com a comida e sua transformação, por isso preparamos uma surpresa para você!
              </p>
            </div>
          </div>
        </div>

        {/* Benefícios Detalhados */}
        <div className="bg-hypno-dark/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl max-w-2xl mx-auto border border-hypno-purple/30">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            O que você recebe
          </h2>
          <p className="text-white/70 text-center mb-8">
            Baseado nas suas respostas, criamos um plano personalizado de hipnoterapia especialmente para você.
            O programa define objetivos individuais e um programa adaptado para alcançar seus resultados nas primeiras semanas.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-hypno-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-hypno-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-lg mb-1">
                  Sessões de hipnose personalizadas
                </div>
                <div className="text-white/70 text-sm space-y-1">
                  <div className="border-b border-white/10 pb-1 mb-1 text-hypno-accent">Baseadas nas suas dores e objetivos</div>
                  <div className="flex items-center gap-2">
                    <span className="text-hypno-accent">•</span>
                    <span>30+ sessões de áudio (15-25 min cada)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-hypno-accent">•</span>
                    <span>Técnicas de visualização avançada</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-hypno-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-hypno-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-lg mb-1">
                  Reprogramação mental profunda
                </div>
                <div className="text-white/70 text-sm space-y-1">
                  <div className="border-b border-white/10 pb-1 mb-1 text-hypno-accent">Elimine a causa raiz do problema</div>
                  <div className="flex items-center gap-2">
                    <span className="text-hypno-accent">•</span>
                    <span>Sugestões pós-hipnóticas poderosas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-hypno-accent">•</span>
                    <span>Elimine desejos incontroláveis</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-hypno-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-hypno-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-lg mb-1">
                  Meditações anti-ansiedade
                </div>
                <div className="text-white/70">
                  15+ meditações guiadas para controlar a ansiedade e o estresse que levam à compulsão alimentar
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-hypno-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-hypno-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-lg mb-1">
                  Técnicas de autocontrole
                </div>
                <div className="text-white/70">
                  Protocolo de 60 segundos para usar em momentos de desejo incontrolável
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-hypno-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-hypno-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-lg mb-1">
                  Acompanhamento de progresso
                </div>
                <div className="text-white/70">
                  Gráficos visuais e celebração de marcos para manter a motivação
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-hypno-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-hypno-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-lg mb-1">
                  Comunidade exclusiva
                </div>
                <div className="text-white/70">
                  Grupos de apoio e desafios semanais para maximizar seus resultados
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-hypno-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-hypno-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-lg mb-1">
                  Acesso vitalício
                </div>
                <div className="text-white/70">
                  Pague uma vez, use para sempre. Sem mensalidades ou renovações
                </div>
              </div>
            </div>
          </div>

          {/* Bônus */}
          <div className="mt-8 p-6 bg-hypno-purple/40 border-2 border-hypno-accent rounded-2xl">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🎁</span>
              <div>
                <div className="text-hypno-accent font-bold text-xl mb-2">
                  BÔNUS EXCLUSIVO: Acelerador Mental
                </div>
                <div className="text-white/90 mb-1">
                  Protocolo intensivo dos primeiros 7 dias para acelerar seus resultados
                </div>
                <div className="text-white/60 text-sm">
                  (Valor: R$ 97,00) - GRÁTIS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco de Autoridade - Conforme apresentado em */}
        <div className="bg-gradient-to-br from-hypno-purple/40 via-hypno-dark/80 to-hypno-purple/40 backdrop-blur-sm rounded-3xl p-8 mb-8 max-w-2xl mx-auto border-2 border-hypno-accent/30 shadow-lg shadow-hypno-accent/20">
          <h2 className="text-2xl sm:text-3xl font-bold text-hypno-accent text-center mb-6">
            Conforme apresentado em
          </h2>
          <div className="flex items-center justify-center bg-white rounded-2xl p-6">
            <img
              src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763608547/soulsync/authority/featured-in-logos.png"
              alt="Conforme apresentado em USA Today, Forbes, WSJ, New York Post, Mashable"
              className="w-full max-w-3xl h-auto brightness-110"
            />
          </div>
        </div>

        {/* Card #1 Walking App */}
        <div className="relative bg-gradient-to-br from-hypno-accent/20 via-hypno-dark/90 to-hypno-purple/30 backdrop-blur-sm rounded-3xl p-8 mb-8 max-w-2xl mx-auto border-2 border-hypno-accent shadow-2xl shadow-hypno-accent/30 overflow-hidden">
          {/* Efeito de brilho no fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hypno-accent/10 to-transparent blur-3xl"></div>

          <div className="relative flex flex-col items-center text-center">
            {/* Imagem do badge */}
            <div className="bg-gradient-to-br from-hypno-accent/20 to-hypno-purple/20 rounded-2xl p-4 mb-6">
              <img
                src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763605594/soulsync/social-proof/walking-app-badge.png"
                alt="#1 Walking app"
                className="w-64 h-auto"
              />
            </div>

            {/* Texto principal */}
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-hypno-accent to-white bg-clip-text text-transparent mb-3">
              Comece a perder peso agora mesmo
            </h2>

            {/* Subtexto */}
            <p className="text-white/80 text-sm mb-6">
              *AppMagic, 2022, downloads para Android e iOS
            </p>

            {/* Botão CTA */}
            <button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-hypno-purple to-hypno-accent text-white px-12 py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-hypno-accent/60 transition-all duration-300 shadow-lg shadow-hypno-accent/40"
            >
              RECEBER O MEU PLANO
            </button>
          </div>
        </div>

        {/* Bloco de Método de Pagamento e Segurança */}
        <div className="bg-hypno-dark/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl max-w-2xl mx-auto border border-hypno-purple/30">
          <h2 className="text-2xl font-bold text-white mb-3 text-center">
            Método de pagamento
          </h2>
          <p className="text-white/70 text-center mb-6">
            O SoulSync usará suas informações de pagamento para simplificar os futuros pagamentos.
          </p>

          {/* Opção PayPal/PIX */}
          <div className="border-2 border-hypno-accent rounded-2xl p-6 mb-4 bg-hypno-purple/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-hypno-accent bg-hypno-accent flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-hypno-dark rounded-full"></div>
                </div>
                <span className="font-bold text-white text-lg">PIX / Cartão de Crédito</span>
              </div>
              <div className="flex gap-2">
                <span className="text-2xl">💳</span>
              </div>
            </div>

            <div className="space-y-3 ml-8 mb-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-hypno-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white/80">Opção de pagamento rápida e prática</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-hypno-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white/80">Mantém suas informações financeiras seguras com criptografia de ponta a ponta.</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-hypno-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white/80">Usamos a avançada proteção antifraudes oferecida pelo nosso processador de pagamentos.</span>
              </div>
            </div>

            <div className="flex items-start gap-2 ml-8 mb-4">
              <input type="checkbox" className="mt-1" id="consent" />
              <label htmlFor="consent" className="text-sm text-white/70">
                Eu permito explicitamente que o SoulSync armazene minhas informações de pagamento para simplificar as futuras transações
              </label>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-hypno-purple to-hypno-accent text-white py-4 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-xl hover:shadow-hypno-accent/50 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Confirmar compra
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-white/80 font-semibold mb-2">
                Suas informações de pagamento estão seguras com criptografia SSL/TLS.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-hypno-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold text-white/80">SECURE</span>
                </div>
                <span className="text-xs text-white/60">SSL/TLS Encryption</span>
              </div>
            </div>

            {/* Bandeiras de Cartão */}
            <div className="mt-6 flex items-center justify-center gap-3 opacity-80">
              <img
                src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763606902/soulsync/payment-methods/visa.svg"
                alt="Visa"
                className="h-5 w-auto"
              />
              <img
                src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763606903/soulsync/payment-methods/mastercard.svg"
                alt="Mastercard"
                className="h-5 w-auto"
              />
              <img
                src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763606905/soulsync/payment-methods/maestro.svg"
                alt="Maestro"
                className="h-5 w-auto"
              />
              <img
                src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763606906/soulsync/payment-methods/amex.svg"
                alt="American Express"
                className="h-5 w-auto"
              />
            </div>
          </div>



          {/* Informações Adicionais */}
          <div className="space-y-4 text-sm text-white/70">
            <p>
              Você pode ficar com nosso curso introdutório de perda de peso, mesmo se decidir que o SoulSync não combina com você.
            </p>
            <p>
              Você precisará de um iPhone ou um smartphone Android para usar o aplicativo SoulSync.
            </p>
            <div>
              <p className="font-bold text-white mb-1">Pagamento seguro</p>
              <p>
                Todas as informações são criptografadas e transmitidas sem o risco de usar um protocolo SSL.
              </p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Precisa de ajuda?</p>
              <p>
                Fale conosco{' '}
                <a href="#" className="text-hypno-accent underline hover:text-hypno-accent/80">
                  aqui
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Card de Garantia de 30 Dias */}
        <div className="bg-hypno-dark/60 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 mb-8 max-w-2xl mx-auto border border-white/10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Badge 30 dias - Mobile: No topo, Desktop: À direita */}
            <div className="flex-shrink-0 order-first sm:order-last">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                {/* Selo de garantia */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Estrela de fundo */}
                  <path
                    d="M50 5 L58 35 L88 35 L64 52 L72 82 L50 65 L28 82 L36 52 L12 35 L42 35 Z"
                    className="fill-hypno-accent animate-pulse"
                  />
                  {/* Círculo central */}
                  <circle cx="50" cy="50" r="28" className="fill-hypno-dark" />
                  <circle cx="50" cy="50" r="26" fill="none" className="stroke-hypno-accent" strokeWidth="2" strokeDasharray="3,3" />

                  {/* Texto */}
                  <text x="50" y="42" textAnchor="middle" className="fill-hypno-accent" fontSize="10" fontWeight="bold">
                    SEU PLANO
                  </text>
                  <text x="50" y="55" textAnchor="middle" className="fill-hypno-accent" fontSize="20" fontWeight="bold">
                    ESTÁ
                  </text>
                  <text x="50" y="65" textAnchor="middle" className="fill-hypno-accent" fontSize="10" fontWeight="bold">
                    PRONTO
                  </text>
                  <text x="50" y="75" textAnchor="middle" className="fill-hypno-accent" fontSize="7">
                    REEMBOLSO
                  </text>
                </svg>
              </div>
            </div>

            {/* Texto - Mobile: Abaixo do badge, Desktop: À esquerda */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                Garantia de devolução
              </h2>
              <p className="text-sm sm:text-base text-white/70 mb-3 sm:mb-4 leading-relaxed">
                Estamos confiantes com a qualidade do nosso serviço e seus resultados. Então, se você quiser dar o primeiro passo para alcançar seus objetivos, experimente o SoulSync! Se você não gostar dos resultados, basta nos informar dentro de 30 dias após a compra, e nós providenciaremos um reembolso total. Note que você precisará provar que seguiu o programa.
              </p>
              <p className="text-xs sm:text-sm text-white/70">
                Saiba mais sobre os limites aplicáveis na nossa{' '}
                <a href="#" className="text-hypno-accent underline hover:text-hypno-accent/80 transition-colors">
                  Política de Cancelamento e Reembolso
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Bloco de Depoimentos com Fotos Antes/Depois */}
        <div className="bg-gradient-to-br from-hypno-purple/50 via-hypno-dark to-hypno-purple/50 rounded-3xl p-8 mb-8 shadow-2xl max-w-2xl mx-auto border-2 border-hypno-accent/30">
          {/* Header com Avaliação */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
              <span className="text-white font-bold">4.6/5</span>
              <span className="text-hypno-accent/80 text-sm">(mais de 1000 avaliações)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Por que <span className="text-transparent bg-gradient-to-r from-hypno-accent to-white bg-clip-text">os usuários</span>
            </h2>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              adoram o aplicativo <span className="text-transparent bg-gradient-to-r from-hypno-accent to-white bg-clip-text">SoulSync?</span>
            </h2>
          </div>

          {/* Grid de Depoimentos */}
          <div className="space-y-6">
            {/* Depoimento 1 - Jasmim Z. */}
            <div className="bg-hypno-dark/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-hypno-accent/30">
              <div className="p-6">
                {/* Imagem Antes/Depois */}
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609993/soulsync/testimonials/testimonial-1.webp"
                    alt="Transformação de Jasmim Z."
                    className="w-full h-auto"
                  />
                </div>

                {/* Rating e Data */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
                  <div className="text-purple-300 text-sm">27 de junho</div>
                </div>

                {/* Depoimento */}
                <p className="text-white leading-relaxed mb-4">
                  SoulSync transformou meu corpo de maneiras que eu jamais imaginei. Recomendo para todas as mulheres que buscam algo diferente e que realmente funciona!
                </p>

                {/* Nome e Badge */}
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold">Jasmim Z.</p>
                  <div className="flex items-center gap-1 text-xs text-purple-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>USUÁRIO VERIFICADO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Depoimento 2 - José S. */}
            <div className="bg-hypno-dark/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-hypno-accent/30">
              <div className="p-6">
                {/* Imagem Antes/Depois */}
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609994/soulsync/testimonials/testimonial-2.webp"
                    alt="Transformação de José S."
                    className="w-full h-auto"
                  />
                </div>

                {/* Rating e Data */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
                  <div className="text-purple-300 text-sm">24 de junho</div>
                </div>

                {/* Depoimento */}
                <p className="text-white leading-relaxed mb-4">
                  Finalmente parei de comer compulsivamente e comecei a me exercitar. SoulSync foi a única coisa que funcionou para mim.
                </p>

                {/* Nome e Badge */}
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold">José S.</p>
                  <div className="flex items-center gap-1 text-xs text-purple-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>USUÁRIO VERIFICADO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Depoimento 3 - Simona K. */}
            <div className="bg-hypno-dark/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-hypno-accent/30">
              <div className="p-6">
                {/* Imagem Antes/Depois */}
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609995/soulsync/testimonials/testimonial-3.webp"
                    alt="Transformação de Simona K."
                    className="w-full h-auto"
                  />
                </div>

                {/* Rating e Data */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
                  <div className="text-purple-300 text-sm">19 de junho</div>
                </div>

                {/* Depoimento */}
                <p className="text-white leading-relaxed mb-4">
                  Experiência fenomenal. O aplicativo SoulSync é o principal motivo da minha mudança. Ser saudável agora é muito fácil, acontece naturalmente.
                </p>

                {/* Nome e Badge */}
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold">Simona K.</p>
                  <div className="flex items-center gap-1 text-xs text-purple-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>USUÁRIO VERIFICADO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão CTA no final */}
          <div className="mt-8 text-center">
            <button
              onClick={handleCheckout}
              className="w-full max-w-md bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-5 rounded-2xl font-bold text-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg"
            >
              Comprar agora!
            </button>
          </div>
        </div>

        {/* FAQ - Perguntas Frequentes */}
        <div className="bg-gradient-to-br from-hypno-purple/50 via-hypno-dark to-hypno-purple/50 rounded-3xl p-8 mb-8 shadow-2xl max-w-2xl mx-auto border-2 border-hypno-accent/30">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            As pessoas nos perguntam:
          </h2>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-hypno-dark/60 backdrop-blur-sm rounded-2xl border border-hypno-accent/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-hypno-accent/10 transition-colors"
              >
                <span className="text-white font-bold text-lg">
                  O que acontece depois que eu faço o pedido?
                </span>
                <span className="text-hypno-accent text-2xl flex-shrink-0 ml-4">
                  {openFaq === 0 ? '−' : '+'}
                </span>
              </button>
              {openFaq === 0 && (
                <div className="px-6 pb-6">
                  <p className="text-white/80 leading-relaxed">
                    Após você fazer seu pedido, começamos a trabalhar! Com base nas respostas que você deu no questionário, criaremos um programa personalizado de acordo com suas necessidades.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-hypno-dark/60 backdrop-blur-sm rounded-2xl border border-hypno-accent/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-hypno-accent/10 transition-colors"
              >
                <span className="text-white font-bold text-lg">
                  Como posso cancelar minha assinatura?
                </span>
                <span className="text-hypno-accent text-2xl flex-shrink-0 ml-4">
                  {openFaq === 1 ? '−' : '+'}
                </span>
              </button>
              {openFaq === 1 && (
                <div className="px-6 pb-6">
                  <p className="text-white/80 leading-relaxed">
                    Os cancelamentos são tratados diretamente com a Apple e podem ser solicitados seguindo as instruções aqui. Caso ainda tenha alguma dúvida sobre como cancelar sua assinatura, entre em contato conosco pelo e-mail contato@soulsync.com.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-hypno-dark/60 backdrop-blur-sm rounded-2xl border border-hypno-accent/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-hypno-accent/10 transition-colors"
              >
                <span className="text-white font-bold text-lg">
                  É seguro usar a auto-hipnose?
                </span>
                <span className="text-hypno-accent text-2xl flex-shrink-0 ml-4">
                  {openFaq === 2 ? '−' : '+'}
                </span>
              </button>
              {openFaq === 2 && (
                <div className="px-6 pb-6">
                  <p className="text-white/80 leading-relaxed">
                    A auto-hipnoterapia é um procedimento completamente seguro.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-hypno-dark/60 backdrop-blur-sm rounded-2xl border border-hypno-accent/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-hypno-accent/10 transition-colors"
              >
                <span className="text-white font-bold text-lg">
                  O que acontece se eu adormecer durante a sessão?
                </span>
                <span className="text-hypno-accent text-2xl flex-shrink-0 ml-4">
                  {openFaq === 3 ? '−' : '+'}
                </span>
              </button>
              {openFaq === 3 && (
                <div className="px-6 pb-6">
                  <p className="text-white/80 leading-relaxed mb-4">
                    É perfeitamente normal e seguro adormecer durante uma sessão de hipnose. Na verdade, isso comprova que você entrou em uma fase de relaxamento profundo, na qual a hipnose é mais eficaz.
                  </p>
                  <p className="text-white/80 leading-relaxed">
                    Caso isso aconteça com você e você queira rever sua sessão de sono, poderá fazê-lo selecionando o dia anterior no aplicativo SoulSync.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Principal */}
        <div className="mb-8 max-w-2xl mx-auto">
          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-hypno-purple to-hypno-accent text-white py-6 rounded-full font-bold text-2xl hover:scale-105 hover:shadow-2xl hover:shadow-hypno-accent/50 transition-all duration-300 shadow-lg"
          >
            🚀 RECEBER O MEU PLANO - R$ 39,00
          </button>
          <p className="text-white/60 text-center mt-4 text-sm">
            Acesso instantâneo ao programa completo
          </p>
        </div>

        {/* Trust Signals */}
        <div className="bg-hypno-dark/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl max-w-2xl mx-auto border border-hypno-purple/30">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-16 h-16 bg-hypno-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-hypno-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-white font-semibold mb-1">Garantia 30 dias</div>
              <div className="text-white/60 text-sm">Reembolso total</div>
            </div>

            <div>
              <div className="w-16 h-16 bg-hypno-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-hypno-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-white font-semibold mb-1">Acesso imediato</div>
              <div className="text-white/60 text-sm">Programa completo</div>
            </div>

            <div>
              <div className="w-16 h-16 bg-hypno-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-hypno-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <div className="text-white font-semibold mb-1">Suporte dedicado</div>
              <div className="text-white/60 text-sm">Via chat</div>
            </div>

            <div>
              <div className="w-16 h-16 bg-hypno-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-hypno-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-white font-semibold mb-1">Pagamento seguro</div>
              <div className="text-white/60 text-sm">100% criptografado</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm space-y-4 pb-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Política de Reembolso</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Pagamento seguro garantido</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-xs">Visa</span>
            <span className="text-xs">Mastercard</span>
            <span className="text-xs">American Express</span>
            <span className="text-xs">PIX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
