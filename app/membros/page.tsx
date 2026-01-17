'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';
import Onboarding from '@/components/Onboarding';
import CourseCard from '@/components/CourseCard';
import UnavailableModal from '@/components/UnavailableModal';
import { useAuth } from '@/contexts/AuthContext';

interface AudioSession {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  audioUrl: string;
  image?: string;
  isLocked?: boolean;
  isAvailable?: boolean; // Indica se o módulo está disponível (tem conteúdo)
}

// Mapeamento de IDs de sessões para IDs de upsell
const sessionToUpsellMap: Record<number, string> = {
  4: 'autoestima',
  5: 'sono',
  6: 'fitness',
  7: 'acucar',
  8: 'financeira',
  9: 'procrastinacao',
  14: 'relaxamento',
  21: 'adhd',
};

function getQuickReliefSessions(): AudioSession[] {
  return [
    {
      id: 4,
      title: 'Sessão de hipnoterapia para autoestima',
      description: 'Aumente sua autoestima',
      duration: '15 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-4.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359689/soulsync/sessions/Auto_estima.jpg',
      isLocked: true,
      isAvailable: false,
    },
    {
      id: 5,
      title: 'Sessão de hipnoterapia para distúrbios do sono',
      description: 'Durma melhor',
      duration: '20 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-5.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359692/soulsync/sessions/disturbios_do_sono.jpg',
      isLocked: true,
      isAvailable: false,
    },
    {
      id: 6,
      title: 'Liberte o seu potencial de condicionamento físico',
      description: 'Desbloqueie sua motivação fitness',
      duration: '18 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-6.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359691/soulsync/sessions/condicionamento_f%C3%ADsico.jpg',
      isLocked: true,
      isAvailable: false,
    },
    {
      id: 7,
      title: 'Sessão de hipnoterapia para desintoxicação de açúcar',
      description: 'Liberte-se do vício em açúcar',
      duration: '25 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-7.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359690/soulsync/sessions/a%C3%A7ucar.jpg',
      isLocked: true,
      isAvailable: false,
    },
    {
      id: 8,
      title: 'A fórmula da liberdade financeira',
      description: 'Melhore sua relação com dinheiro',
      duration: '22 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-8.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359693/soulsync/sessions/liberdade_financeira.jpg',
      isLocked: true,
      isAvailable: false,
    },
    {
      id: 9,
      title: 'Para de procrastinar',
      description: 'Seja mais produtivo',
      duration: '16 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-9.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359693/soulsync/sessions/pare_de_procrastinar.jpg',
      isLocked: true,
      isAvailable: false,
    },
    {
      id: 10,
      title: 'Liberte-se do Ser',
      description: 'Encontre paz interior',
      duration: '20 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-10.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359698/soulsync/sessions/liberte-se_da_dor.jpg',
      isLocked: false,
      isAvailable: false,
    },
    {
      id: 11,
      title: 'Harmonia para a saúde intestinal',
      description: 'Melhore sua saúde digestiva',
      duration: '18 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-11.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359699/soulsync/sessions/sa%C3%BAde_intestinal.jpg',
      isLocked: false,
      isAvailable: false,
    },
    {
      id: 12,
      title: 'Quebre o Ciclo da Dependência',
      description: 'Conecte-se com seu corpo',
      duration: '17 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-12.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359702/soulsync/sessions/ciclos_da_dependencia.jpg',
      isLocked: false,
      isAvailable: false,
    },
    {
      id: 13,
      title: 'Quebre o Ciclo da Ansiedade',
      description: 'Controle a ansiedade',
      duration: '19 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-13.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359697/soulsync/sessions/p%C3%A2nico.jpg',
      isLocked: false,
      isAvailable: false,
    },
    {
      id: 14,
      title: 'Sessão de hipnoterapia para relaxamento profundo',
      description: 'Alcance relaxamento profundo',
      duration: '17 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-14.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359695/soulsync/sessions/relaxamento_profundo.jpg',
      isLocked: true,
      isAvailable: false,
    },
    {
      id: 15,
      title: 'Respire com Liberdade e Tranquilidade',
      description: 'Exercícios de respiração',
      duration: '14 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-15.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359697/soulsync/sessions/respire.jpg',
      isLocked: false,
      isAvailable: false,
    },
    {
      id: 16,
      title: 'Abrace a Conexão',
      description: 'Abordagem holística',
      duration: '21 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-16.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359701/soulsync/sessions/conex%C3%A3o.jpg',
      isLocked: false,
      isAvailable: false,
    },
    {
      id: 17,
      title: 'Visualize seu futuro',
      description: 'Visualização guiada',
      duration: '16 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-17.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359702/soulsync/sessions/futuro.jpg',
      isLocked: false,
      isAvailable: false,
    },
    {
      id: 18,
      title: 'Quit cannabis for good',
      description: 'Sincronicidade e manifestação',
      duration: '18 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-18.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768360644/soulsync/sessions/Quit_cannabis_for_good.jpg',
      isLocked: false,
      isAvailable: false,
    },
    {
      id: 19,
      title: 'Aumente Sua Produtividade',
      description: 'Seja mais eficiente',
      duration: '15 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-19.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359700/soulsync/sessions/produtividade.jpg',
      isLocked: false,
      isAvailable: false,
    },
    {
      id: 20,
      title: 'Programa de gerenciamento de TDAH',
      description: 'Gestão de TDAH',
      duration: '23 min',
      category: 'alivio',
      audioUrl: '/audios/sessao-21.mp3',
      image: 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1768359696/soulsync/sessions/tdah.jpg',
      isLocked: true,
      isAvailable: false,
    },
  ];
}

function MembersAreaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading, validateToken, logout } = useAuth();
  const [currentAudio, setCurrentAudio] = useState<AudioSession | null>(null);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [mainCourses, setMainCourses] = useState<AudioSession[]>([]);
  const [quickReliefSessions] = useState<AudioSession[]>(getQuickReliefSessions());
  const [hasInitialized, setHasInitialized] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [preloadingAudio, setPreloadingAudio] = useState<string | null>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [unavailableModuleName, setUnavailableModuleName] = useState('');

  useEffect(() => {
    if (!isLoading && !hasInitialized) {
      const token = searchParams ? searchParams.get('token') : null;

      if (token) {
        validateToken(token).then((isValid) => {
          if (isValid) {
            router.replace('/membros');
            loadCompletedSessions();
            checkOnboardingStatus();
            setHasInitialized(true);
          }
        });
      } else if (isAuthenticated) {
        loadCompletedSessions();
        checkOnboardingStatus();
        setHasInitialized(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, hasInitialized]);

  function checkOnboardingStatus() {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }

  function handleOnboardingComplete() {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  }

  function handleTopicSelect(audioUrl: string, title: string) {
    // Abrir o player com o áudio selecionado
    setCurrentAudio({
      id: 999,
      title: title,
      description: 'Sessão de hipnoterapia selecionada',
      duration: '20 min',
      category: 'principal',
      audioUrl: audioUrl,
      isLocked: false,
    });
  }

  function loadCompletedSessions() {
    const completed = JSON.parse(localStorage.getItem('completedSessions') || '[]');
    setCompletedSessions(completed);
  }

  // Fetch courses from API
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();

        if (data.courses && data.courses.length > 0) {
          // Convert API courses to AudioSession format
          const coursesFromAPI: AudioSession[] = data.courses.map((course: any) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            duration: `${course.totalSessions} sessões`,
            category: 'principal',
            audioUrl: '', // Not used for main courses
            isLocked: false,
            image: course.imageUrl, // Adicionar imagem do curso
          }));

          setMainCourses(coursesFromAPI);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Keep empty array on error
      } finally {
        setLoadingCourses(false);
      }
    }

    fetchCourses();
  }, []);

  // Prefetch course pages to reduce loading time
  useEffect(() => {
    if (!loadingCourses && mainCourses.length > 0) {
      // Prefetch all course pages
      mainCourses.forEach((course) => {
        router.prefetch(`/curso/${course.id}`);
      });

      // Prefetch upsell pages
      Object.values(sessionToUpsellMap).forEach((upsellId) => {
        router.prefetch(`/upsell/${upsellId}`);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCourses, mainCourses]);

  // Função para rastrear interesse em módulos não disponíveis
  const trackModuleInterest = (moduleName: string, moduleId: number) => {
    // Salvar no localStorage para análise posterior
    const interestData = JSON.parse(localStorage.getItem('moduleInterest') || '{}');

    if (!interestData[moduleId]) {
      interestData[moduleId] = {
        name: moduleName,
        clicks: 0,
        firstClick: new Date().toISOString(),
        lastClick: new Date().toISOString(),
      };
    }

    interestData[moduleId].clicks += 1;
    interestData[moduleId].lastClick = new Date().toISOString();

    localStorage.setItem('moduleInterest', JSON.stringify(interestData));

    // Enviar para Google Analytics se disponível
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'module_interest', {
        event_category: 'engagement',
        event_label: moduleName,
        module_id: moduleId,
      });
    }

    console.log(`Interesse registrado: ${moduleName} (ID: ${moduleId})`);
  };

  const handleSessionClick = (session: AudioSession) => {
    // Verificar se o módulo está disponível
    if (session.isAvailable === false) {
      // Rastrear interesse no módulo
      trackModuleInterest(session.title, session.id);
      // Mostrar modal de indisponível
      setUnavailableModuleName(session.title);
      setShowUnavailableModal(true);
      return;
    }

    if (session.isLocked) {
      // Se o card estiver bloqueado, redirecionar para página de upsell
      const upsellId = sessionToUpsellMap[session.id];
      if (upsellId) {
        setNavigating(true);
        router.push(`/upsell/${upsellId}`);
      }
    } else {
      // Se for um curso principal (ids 1, 2, 3), navegar para página do curso
      if (session.category === 'principal') {
        setNavigating(true);
        router.push(`/curso/${session.id}`);
      } else {
        // Se for alívio rápido, pré-carregar áudio e abrir player
        if (session.audioUrl) {
          // Iniciar pré-carregamento do áudio
          setPreloadingAudio(session.audioUrl);

          // Criar elemento de áudio invisível para pré-carregar
          if (!preloadAudioRef.current) {
            preloadAudioRef.current = new Audio();
          }

          preloadAudioRef.current.src = session.audioUrl;
          preloadAudioRef.current.preload = 'auto';

          // Esconder indicador quando o áudio puder ser reproduzido
          preloadAudioRef.current.addEventListener('canplaythrough', () => {
            setTimeout(() => {
              setPreloadingAudio(null);
            }, 500); // Pequeno delay para UX mais suave
          }, { once: true });

          // Timeout de segurança para esconder o indicador
          setTimeout(() => {
            setPreloadingAudio(null);
          }, 3000);

          preloadAudioRef.current.load();
        }

        // Abrir player imediatamente
        setCurrentAudio(session);
      }
    }
  };

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Validando seu acesso...</h2>
        </div>
      </div>
    );
  }

  // Tela de acesso negado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SoulSync</h1>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8 text-center">
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Você precisa fazer login ou adquirir um plano para acessar a área de membros.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 sm:py-4 bg-teal-600 text-white rounded-full font-bold text-base sm:text-lg transition-all duration-300 hover:bg-teal-700 active:scale-95 sm:hover:scale-105 shadow-lg"
              >
                Fazer Login
              </button>
              <button
                onClick={() => window.location.href = 'https://lastlink.com/p/CDD3C0290/checkout-payment'}
                className="w-full py-3 sm:py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-bold text-base sm:text-lg transition-all duration-300 hover:bg-gray-50 active:scale-95"
              >
                Adquirir Plano
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar onboarding se necessário
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} onTopicSelect={handleTopicSelect} />;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">SoulSync</h1>

            {/* Navigation Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search - hidden on mobile */}
              <button className="hidden sm:block text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Settings - hidden on mobile */}
              <button className="hidden sm:block text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 transition-colors text-xs sm:text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Main Courses Section */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Todos os cursos disponíveis</h2>
          {loadingCourses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 sm:h-64 bg-gray-100 rounded-2xl sm:rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : mainCourses.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">Nenhum curso disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {mainCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  image={course.image}
                  size="large"
                  isLocked={course.isLocked}
                  onClick={() => handleSessionClick(course)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick Relief Section */}
        <section className="pb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Alívios rápidos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
            {quickReliefSessions.map((session) => (
              <CourseCard
                key={session.id}
                id={session.id}
                title={session.title}
                image={session.image}
                size="small"
                isLocked={session.isLocked}
                onClick={() => handleSessionClick(session)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Audio Player Modal */}
      {currentAudio && (
        <AudioPlayer
          audioUrl={currentAudio.audioUrl}
          title={currentAudio.title}
          description={currentAudio.description}
          sessionId={currentAudio.id}
          onClose={() => {
            setCurrentAudio(null);
            setPreloadingAudio(null);
            if (preloadAudioRef.current) {
              preloadAudioRef.current.src = '';
              preloadAudioRef.current = null;
            }
            loadCompletedSessions();
          }}
        />
      )}

      {/* Loading Overlay */}
      {navigating && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="text-center max-w-xs w-full">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-teal-600 mx-auto mb-3 sm:mb-4"></div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Carregando...</h3>
            <p className="text-sm text-gray-500">Aguarde um momento</p>
          </div>
        </div>
      )}

      {/* Hidden prefetch links */}
      <div className="hidden">
        {mainCourses.map((course) => (
          <Link key={course.id} href={`/curso/${course.id}`} prefetch={true} />
        ))}
        {Object.values(sessionToUpsellMap).map((upsellId) => (
          <Link key={upsellId} href={`/upsell/${upsellId}`} prefetch={true} />
        ))}
      </div>

      {/* Audio Preloading Indicator */}
      {preloadingAudio && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white rounded-full shadow-lg border border-gray-100 px-4 py-2 sm:px-5 sm:py-3 flex items-center gap-2 sm:gap-3 z-40 animate-fadeIn">
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">Preparando áudio...</span>
        </div>
      )}

      {/* Unavailable Module Modal */}
      <UnavailableModal
        isOpen={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
        moduleName={unavailableModuleName}
      />
    </main>
  );
}

export default function MembersArea() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Carregando...</h2>
        </div>
      </div>
    }>
      <MembersAreaContent />
    </Suspense>
  );
}
