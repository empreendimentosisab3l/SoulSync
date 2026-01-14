'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import ExitConfirmationModal from './ExitConfirmationModal';

// Importar Lottie dinamicamente para evitar SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  description: string;
  onClose: () => void;
  sessionId: number;
  onComplete?: () => void;
}

function AudioPlayer({ audioUrl, title, description, onClose, sessionId, onComplete }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [lottieData, setLottieData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canPlay, setCanPlay] = useState(false);
  const [autoPlayAttempted, setAutoPlayAttempted] = useState(false);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Carregar animação Lottie
  useEffect(() => {
    fetch('/animations/siri.json')
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(err => console.error('Erro ao carregar animação:', err));
  }, []);

  // Configurar análise de áudio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setupAudioAnalyzer = () => {
      if (audioContextRef.current) return;

      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;

        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyzerRef.current = analyzer;
      } catch (err) {
        console.error('Erro ao configurar AudioContext:', err);
      }
    };

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleCanPlay = () => {
      setCanPlay(true);
      setIsLoading(false);

      // Tentar auto-play assim que tiver buffer suficiente
      if (!autoPlayAttempted) {
        setAutoPlayAttempted(true);
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            // Auto-play bloqueado pelo navegador, usuário precisa clicar
            console.log('Auto-play bloqueado, aguardando interação do usuário');
            setIsPlaying(false);
            setIsLoading(false);
          });
      }
    };
    const handleLoadStart = () => {
      setIsLoading(true);
    };
    const handleWaiting = () => {
      setIsLoading(true);
    };
    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setupAudioAnalyzer();
      startAudioAnalysis();
    };
    const handlePause = () => {
      setIsPlaying(false);
      stopAudioAnalysis();
    };
    const handleEnded = () => {
      setIsPlaying(false);
      stopAudioAnalysis();

      // Marcar sessão como completada
      const completed = JSON.parse(localStorage.getItem('completedSessions') || '[]');
      if (!completed.includes(sessionId)) {
        completed.push(sessionId);
        localStorage.setItem('completedSessions', JSON.stringify(completed));
      }

      // Chamar callback de conclusão se fornecido
      if (onComplete) {
        onComplete();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      stopAudioAnalysis();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAudioAnalysis = () => {
    const analyzer = analyzerRef.current;
    if (!analyzer) return;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const analyze = () => {
      analyzer.getByteFrequencyData(dataArray);

      // Calcular nível médio de áudio (0-1)
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      const normalizedLevel = average / 255;

      setAudioLevel(normalizedLevel);
      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  };

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAudioLevel(0);
  };

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao reproduzir áudio:', error);
        setIsLoading(false);
      }
    }
  }, [isPlaying]);

  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleCloseAttempt = useCallback(() => {
    if (isPlaying) {
      togglePlay();
    }
    setShowExitConfirmation(true);
  }, [isPlaying, togglePlay]);

  const handleContinue = useCallback(() => {
    setShowExitConfirmation(false);
    if (!isPlaying && audioRef.current) {
      togglePlay();
    }
  }, [isPlaying, togglePlay]);

  const handleExit = useCallback(() => {
    setShowExitConfirmation(false);
    onClose();
  }, [onClose]);

  // Calcular porcentagem de progresso
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        {/* Botão Voltar */}
        <button
          onClick={handleCloseAttempt}
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo */}
        <h1 className="text-2xl font-bold text-white">SoulSync</h1>

        {/* Espaço vazio para centralizar logo */}
        <div className="w-8"></div>
      </div>

      {/* Conteúdo centralizado */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Animação Lottie Pulsante */}
        <div className="w-full max-w-md mb-8 px-4">
          <div className="relative flex items-center justify-center">
            {/* Animação Lottie */}
            {lottieData && (
              <div
                className="transition-transform duration-100 ease-out w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]"
                style={{
                  transform: `scale(${1 + audioLevel * 0.3})`,
                  filter: `brightness(${1 + audioLevel * 0.5})`
                }}
              >
                <Lottie
                  animationData={lottieData}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: 'auto' }}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice',
                    imagePreserveAspectRatio: 'xMidYMid slice'
                  }}
                />
              </div>
            )}

            {/* Círculo pulsante de fundo */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `scale(${1 + audioLevel * 0.5})`,
                opacity: audioLevel * 0.3,
                transition: 'all 0.1s ease-out'
              }}
            >
              <div className="w-full h-full max-w-[320px] max-h-[320px] sm:max-w-[360px] sm:max-h-[360px] md:max-w-[400px] md:max-h-[400px] rounded-full bg-white/20 blur-3xl"></div>
            </div>
          </div>

          {/* Título */}
          <div className="mt-6 md:mt-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center leading-tight px-2">
              {title}
            </h2>
            {isLoading && !isPlaying && (
              <p className="text-white/70 text-sm text-center mt-2">
                Carregando áudio...
              </p>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="w-full max-w-md space-y-6">
          {/* Botão Play/Pause */}
          <div className="flex justify-center">
            <button
              onClick={togglePlay}
              disabled={isLoading && !isPlaying}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && !isPlaying ? (
                // Loading Spinner
                <div className="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                // Pause Icon
                <svg className="w-8 h-8 text-teal-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                // Play Icon
                <svg className="w-8 h-8 text-teal-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Barra de progresso */}
          <div className="space-y-2">
            {/* Barra */}
            <div className="relative h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Tempos */}
            <div className="flex justify-between text-white/80 text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element (hidden) */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        crossOrigin="anonymous"
      />

      {/* Exit Confirmation Modal */}
      {showExitConfirmation && (
        <ExitConfirmationModal
          onContinue={handleContinue}
          onExit={handleExit}
        />
      )}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(AudioPlayer);
