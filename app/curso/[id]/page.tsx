'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AudioPlayer from '@/components/AudioPlayer';
import PreSessionModal from '@/components/PreSessionModal';
import { useAuth } from '@/contexts/AuthContext';

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
  const [activeTab, setActiveTab] = useState<'todas' | 'suas'>('todas');
  const [currentAudio, setCurrentAudio] = useState<CourseSession | null>(null);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);
  const [sessionPlayCounts, setSessionPlayCounts] = useState<{ [key: number]: number }>({});
  const [showPreSessionModal, setShowPreSessionModal] = useState(false);
  const [pendingSession, setPendingSession] = useState<CourseSession | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesData, setCoursesData] = useState<{ [key: string]: Course }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const courseId = params?.id as string;
  // Usar apenas dados dinâmicos da API
  const course = coursesData[courseId];

  useEffect(() => {
    // Carregar cursos da API
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();

        if (data.courses) {
          // Converter array em objeto indexado por ID
          const coursesMap: { [key: string]: Course } = {};
          data.courses.forEach((course: any) => {
            // Converter sections para o formato esperado
            const sessions: CourseSession[] = [];
            course.sections.forEach((section: any) => {
              section.sessions.forEach((session: any) => {
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

            coursesMap[course.id.toString()] = {
              id: course.id,
              title: course.title,
              description: course.description,
              longDescription: course.description,
              thumbnail: course.imageUrl || '/images/course-placeholder.jpg',
              sessions
            };
          });

          setCoursesData(coursesMap);
        }
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      } finally {
        setLoadingCourses(false);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (course) {
      loadCompletedSessions();
    }
  }, [isLoading, isAuthenticated, course]);

  function loadCompletedSessions() {
    const completed = JSON.parse(localStorage.getItem('completedSessions') || '[]');
    setCompletedSessions(completed);

    // Carregar contadores de reprodução
    const playCounts = JSON.parse(localStorage.getItem('sessionPlayCounts') || '{}');
    setSessionPlayCounts(playCounts);
  }

  function incrementPlayCount(sessionId: number) {
    const currentCount = sessionPlayCounts[sessionId] || 0;
    const newCount = currentCount + 1;

    const updatedCounts = {
      ...sessionPlayCounts,
      [sessionId]: newCount
    };

    setSessionPlayCounts(updatedCounts);
    localStorage.setItem('sessionPlayCounts', JSON.stringify(updatedCounts));
  }

  const handleSessionClick = (session: CourseSession) => {
    // Mostrar modal de pré-sessão antes de iniciar
    setPendingSession(session);
    setShowPreSessionModal(true);
  };

  const handleStartSession = () => {
    // Fechar modal de pré-sessão e iniciar áudio
    setShowPreSessionModal(false);
    if (pendingSession) {
      setCurrentAudio(pendingSession);
      setPendingSession(null);
    }
  };

  const handleClosePreSessionModal = () => {
    setShowPreSessionModal(false);
    setPendingSession(null);
  };

  // Agrupar sessões por seção
  const sessionsBySection = course?.sessions.reduce((acc, session) => {
    if (!acc[session.section]) {
      acc[session.section] = [];
    }
    acc[session.section].push(session);
    return acc;
  }, {} as { [key: string]: CourseSession[] }) || {};

  // Filtrar sessões completadas se tab "suas" estiver ativa
  const filteredSections = activeTab === 'suas'
    ? Object.keys(sessionsBySection).reduce((acc, sectionName) => {
        const completedInSection = sessionsBySection[sectionName].filter(s =>
          completedSessions.includes(s.id)
        );
        if (completedInSection.length > 0) {
          acc[sectionName] = completedInSection;
        }
        return acc;
      }, {} as { [key: string]: CourseSession[] })
    : sessionsBySection;

  if (isLoading || loadingCourses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Carregando...</h2>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">Curso não encontrado</h2>
          <button
            onClick={() => router.push('/membros')}
            className="mt-4 px-6 py-3 bg-white text-teal-700 rounded-full font-semibold"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800">
      {/* Header com logo e ícones */}
      <header className="bg-teal-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">SoulSync</h1>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <button className="hover:text-white transition-colors">Cursos</button>
              <button className="hover:text-white transition-colors">Configurações</button>
              <button className="hover:text-white transition-colors">Pt-Br</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Botão Voltar */}
        <button
          onClick={() => router.push('/membros')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        {/* Course Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl overflow-hidden">
                {course.thumbnail && course.thumbnail !== '/images/course-placeholder.jpg' ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                    🍊
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-3">{course.title}</h1>
              <p className="text-white/90 mb-2">{course.description}</p>
              <p className="text-white/70 text-sm">{course.longDescription}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-white/60">
                <span>{course.sessions.length} sessões</span>
                <span>•</span>
                <span>Hipnoterapia guiada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === 'todas'
                ? 'bg-white text-teal-700'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab('suas')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === 'suas'
                ? 'bg-white text-teal-700'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Suas
          </button>
        </div>

        {/* Sessions by Section */}
        <div className="space-y-8">
          {Object.keys(filteredSections).map((sectionName) => (
            <section key={sectionName}>
              <h2 className="text-xl font-bold text-white mb-4">{sectionName}</h2>
              <div className="space-y-2">
                {filteredSections[sectionName].map((session) => {
                  const isCompleted = completedSessions.includes(session.id);
                  const playCount = sessionPlayCounts[session.id] || 0;
                  const requiredPlays = session.requiredPlays || 3;

                  return (
                    <button
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                          {session.thumbnail && !imageErrors[session.id] ? (
                            <>
                              <img
                                src={session.thumbnail}
                                alt={session.title}
                                className="w-full h-full object-cover"
                                onError={() => setImageErrors(prev => ({ ...prev, [session.id]: true }))}
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </>
                          ) : (
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {playCount >= requiredPlays && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center z-10">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <div className="flex-1 text-left">
                          <h3 className="text-white font-semibold">{session.title}</h3>
                        </div>

                        {/* Play Count */}
                        <div className="text-white/60 text-sm font-medium">
                          {playCount}/{requiredPlays}
                        </div>

                        {/* Duration */}
                        <div className="text-white/60 text-sm">{session.duration}</div>

                        {/* Headphone Icon */}
                        <div className="text-white/40 group-hover:text-white/80 transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="text-center py-12 text-white/60">
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
      )}
    </main>
  );
}
