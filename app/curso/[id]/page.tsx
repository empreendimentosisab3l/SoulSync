'use client';

import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import PreSessionModal from '@/components/PreSessionModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/lib/hooks/useCoursesAPI';

// Lazy load AudioPlayer
const AudioPlayer = lazy(() => import('@/components/AudioPlayer'));

interface CourseSession {
  id: number;
  title: string;
  duration: string;
  thumbnail?: string;
  audioUrl: string;
  section: string;
  playCount?: number; // Contador de vezes que foi ouvida
  requiredPlays?: number; // Número de vezes necessárias (padrão 3)
}

interface Course {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  sessions: CourseSession[];
}

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const { courses, loading: loadingCourses } = useCourses();
  const [activeTab, setActiveTab] = useState<'todas' | 'suas'>('todas');
  const [currentAudio, setCurrentAudio] = useState<CourseSession | null>(null);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);
  const [sessionPlayCounts, setSessionPlayCounts] = useState<{ [key: number]: number }>({});
  const [showPreSessionModal, setShowPreSessionModal] = useState(false);
  const [pendingSession, setPendingSession] = useState<CourseSession | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const courseId = params?.id as string;

  // Memoize course data transformation
  const course = useMemo(() => {
    const apiCourse = courses.find(c => c.id.toString() === courseId);
    if (!apiCourse) return null;

    const sessions: CourseSession[] = [];
    apiCourse.sections.forEach((section) => {
      section.sessions.forEach((session) => {
        sessions.push({
          id: session.id,
          title: session.title,
          duration: session.duration,
          audioUrl: session.audioUrl,
          section: section.name,
          thumbnail: session.thumbnail,
          requiredPlays: 3
        });
      });
    });

    return {
      id: apiCourse.id,
      title: apiCourse.title,
      description: apiCourse.description,
      longDescription: apiCourse.description,
      thumbnail: apiCourse.imageUrl || '/images/course-placeholder.jpg',
      sessions
    } as Course;
  }, [courses, courseId]);


  const loadCompletedSessions = useCallback(() => {
    const completed = JSON.parse(localStorage.getItem('completedSessions') || '[]');
    setCompletedSessions(completed);

    // Carregar contadores de reprodução
    const playCounts = JSON.parse(localStorage.getItem('sessionPlayCounts') || '{}');
    setSessionPlayCounts(playCounts);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (course) {
      loadCompletedSessions();
    }
  }, [isLoading, isAuthenticated, course, router, loadCompletedSessions]);

  const incrementPlayCount = useCallback((sessionId: number) => {
    setSessionPlayCounts(prevCounts => {
      const currentCount = prevCounts[sessionId] || 0;
      const newCount = currentCount + 1;

      const updatedCounts = {
        ...prevCounts,
        [sessionId]: newCount
      };

      localStorage.setItem('sessionPlayCounts', JSON.stringify(updatedCounts));
      return updatedCounts;
    });
  }, []);

  const handleSessionClick = useCallback((session: CourseSession) => {
    // Mostrar modal de pré-sessão antes de iniciar
    setPendingSession(session);
    setShowPreSessionModal(true);
  }, []);

  const handleStartSession = useCallback(() => {
    // Fechar modal de pré-sessão e iniciar áudio
    setShowPreSessionModal(false);
    if (pendingSession) {
      setCurrentAudio(pendingSession);
      setPendingSession(null);
    }
  }, [pendingSession]);

  const handleClosePreSessionModal = useCallback(() => {
    setShowPreSessionModal(false);
    setPendingSession(null);
  }, []);

  // Memoize sessões agrupadas por seção
  const sessionsBySection = useMemo(() => {
    return course?.sessions.reduce((acc, session) => {
      if (!acc[session.section]) {
        acc[session.section] = [];
      }
      acc[session.section].push(session);
      return acc;
    }, {} as { [key: string]: CourseSession[] }) || {};
  }, [course]);

  // Memoize sessões filtradas
  const filteredSections = useMemo(() => {
    if (activeTab === 'suas') {
      return Object.keys(sessionsBySection).reduce((acc, sectionName) => {
        const completedInSection = sessionsBySection[sectionName].filter(s =>
          completedSessions.includes(s.id)
        );
        if (completedInSection.length > 0) {
          acc[sectionName] = completedInSection;
        }
        return acc;
      }, {} as { [key: string]: CourseSession[] });
    }
    return sessionsBySection;
  }, [activeTab, sessionsBySection, completedSessions]);

  if (isLoading || loadingCourses) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Carregando...</h2>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h2>
          <button
            onClick={() => router.push('/membros')}
            className="px-6 py-3 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition-colors active:scale-95"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header com logo e ícones */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">SoulSync</h1>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-500 text-xs sm:text-sm">
              <button className="hidden sm:block hover:text-gray-700 transition-colors">Cursos</button>
              <button className="hidden sm:block hover:text-gray-700 transition-colors">Configurações</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4 sm:mb-6 active:scale-95"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm sm:text-base font-medium">Voltar</span>
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 shadow-sm">
          <div className="flex flex-row gap-4 sm:gap-6">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl sm:rounded-2xl overflow-hidden relative shadow-md">
                {course.thumbnail && course.thumbnail !== '/images/course-placeholder.jpg' ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 80px, 128px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-4xl">
                    🍊
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-3 leading-tight">{course.title}</h1>
              <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2">{course.description}</p>
              <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">{course.longDescription}</p>
              <div className="mt-2 sm:mt-4 flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <span>{course.sessions.length} sessões</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Hipnoterapia guiada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all active:scale-95 ${
              activeTab === 'todas'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab('suas')}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all active:scale-95 ${
              activeTab === 'suas'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Suas
          </button>
        </div>

        {/* Sessions by Section */}
        <div className="space-y-6 sm:space-y-8">
          {Object.keys(filteredSections).map((sectionName) => (
            <section key={sectionName}>
              <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{sectionName}</h2>
              <div className="space-y-2 sm:space-y-3">
                {filteredSections[sectionName].map((session) => {
                  const isCompleted = completedSessions.includes(session.id);
                  const playCount = sessionPlayCounts[session.id] || 0;
                  const requiredPlays = session.requiredPlays || 3;

                  return (
                    <button
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className="w-full bg-white hover:bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden shadow-sm">
                          {session.thumbnail && !imageErrors[session.id] ? (
                            <>
                              <Image
                                src={session.thumbnail}
                                alt={session.title}
                                fill
                                sizes="(max-width: 640px) 48px, 64px"
                                className="object-cover"
                                onError={() => setImageErrors(prev => ({ ...prev, [session.id]: true }))}
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-[1]">
                                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </>
                          ) : (
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {playCount >= requiredPlays && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center z-10 shadow-sm">
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <div className="flex-1 text-left min-w-0">
                          <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-tight line-clamp-2">{session.title}</h3>
                        </div>

                        {/* Play Count */}
                        <div className="text-gray-400 text-xs sm:text-sm font-medium flex-shrink-0">
                          {playCount}/{requiredPlays}
                        </div>

                        {/* Duration - hidden on very small screens */}
                        <div className="text-gray-400 text-xs sm:text-sm hidden xs:block flex-shrink-0">{session.duration}</div>

                        {/* Headphone Icon - hidden on mobile */}
                        <div className="text-gray-300 group-hover:text-teal-500 transition-colors hidden sm:block">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {activeTab === 'suas' && Object.keys(filteredSections).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Você ainda não completou nenhuma sessão deste curso.</p>
          </div>
        )}
      </div>

      {/* Pre-Session Modal */}
      {showPreSessionModal && (
        <PreSessionModal
          onStart={handleStartSession}
          onClose={handleClosePreSessionModal}
        />
      )}

      {/* Audio Player Modal */}
      {currentAudio && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 z-50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <h2 className="text-xl font-bold">Carregando player...</h2>
            </div>
          </div>
        }>
          <AudioPlayer
            audioUrl={currentAudio.audioUrl}
            title={currentAudio.title}
            description={`Duração: ${currentAudio.duration}`}
            sessionId={currentAudio.id}
            onComplete={() => {
              // Incrementar contador quando completar o áudio
              incrementPlayCount(currentAudio.id);
            }}
            onClose={() => {
              setCurrentAudio(null);
              loadCompletedSessions();
            }}
          />
        </Suspense>
      )}
    </main>
  );
}
