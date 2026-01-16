"use client";

interface QuizInfoProps {
  content: string;
  title?: string;
  image?: string;
  testimonial?: {
    name: string;
    text: string;
    image?: string;
  };
  rating?: {
    score: number;
    text: string;
  };
}

export default function QuizInfo({ content, title, image, testimonial, rating }: QuizInfoProps) {
  const renderImage = () => {
    if (!image) return null;

    if (image.startsWith('http')) {
      return (
        <div className="w-full max-w-md mx-auto rounded-3xl overflow-hidden my-8">
          <img
            src={image}
            alt={title || "Quiz illustration"}
            className="w-full h-auto object-cover"
          />
        </div>
      );
    }

    // Placeholder images based on type
    const imageContent: Record<string, React.ReactElement> = {
      "social-proof": (
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-teal-200 border-4 border-teal-500 flex items-center justify-center">
              <svg className="w-16 h-16 text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-teal-100 border-2 border-teal-300"></div>
          <div className="absolute top-12 right-0 w-10 h-10 rounded-full bg-teal-100 border-2 border-teal-300"></div>
          <div className="absolute bottom-0 left-12 w-14 h-14 rounded-full bg-teal-100 border-2 border-teal-300"></div>
          <div className="absolute bottom-12 right-12 w-8 h-8 rounded-full bg-teal-100 border-2 border-teal-300"></div>
        </div>
      ),
      meditation: (
        <div className="w-full max-w-md mx-auto aspect-[4/3] bg-gradient-to-br from-teal-100 to-pink-100 rounded-3xl flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-white/50 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
      ),
      "brain-stomach": (
        <div className="w-full max-w-md mx-auto aspect-[3/4] bg-gradient-to-b from-teal-900 to-teal-700 rounded-3xl flex items-center justify-center p-8">
          <div className="space-y-8">
            <div className="w-24 h-24 mx-auto bg-orange-400 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex justify-center">
              <div className="w-1 h-16 bg-orange-400"></div>
            </div>
            <div className="w-24 h-24 mx-auto bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-4xl">🫃</span>
            </div>
          </div>
        </div>
      ),
      "brain-intestine": (
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="w-32 h-32 bg-pink-200 rounded-full flex items-center justify-center">
              <span className="text-6xl">🧠</span>
            </div>
            <div className="flex gap-4">
              <div className="w-1 h-12 bg-orange-400 rounded"></div>
              <div className="w-1 h-12 bg-orange-400 rounded"></div>
            </div>
            <div className="w-32 h-32 bg-pink-200 rounded-full flex items-center justify-center">
              <span className="text-6xl">🍔</span>
            </div>
          </div>
        </div>
      ),
      "weight-journey-graph": (
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-6">
          <h3 className="text-center font-bold text-gray-800 mb-4">Jornada de perda de peso esperada</h3>
          <svg viewBox="0 0 300 200" className="w-full">
            {/* Axes */}
            <line x1="30" y1="180" x2="280" y2="180" stroke="#ccc" strokeWidth="2" />
            <line x1="30" y1="20" x2="30" y2="180" stroke="#ccc" strokeWidth="2" />

            {/* Hypnozio line (smooth decline) */}
            <path
              d="M 30 40 Q 100 50, 155 100 T 280 160"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />

            {/* Normal weight loss line (yo-yo) */}
            <path
              d="M 30 40 L 80 80 L 130 60 L 180 120 L 230 100 L 280 140"
              stroke="#ef4444"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,8"
            />

            {/* Labels */}
            <text x="70" y="195" fontSize="12" fill="#666">1 mês</text>
            <text x="140" y="195" fontSize="12" fill="#666">2 meses</text>
            <text x="210" y="195" fontSize="12" fill="#666">3 meses</text>
          </svg>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-green-500"></div>
              <span className="text-gray-600">Jornada de emagrecimento com SoulSync</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-red-500" style={{ borderTop: "2px dashed" }}></div>
              <span className="text-gray-600">Jornada usual de perda de peso</span>
            </div>
          </div>
        </div>
      ),
      "brain-gut-connection": (
        <div className="w-full max-w-md mx-auto aspect-[3/4] bg-[#0f0a2a] rounded-3xl flex items-center justify-center p-8 relative overflow-hidden">
          {/* Silhouette approximation */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <svg viewBox="0 0 100 200" className="h-full w-auto fill-indigo-900">
              <path d="M50 0 C 70 0 80 15 80 30 C 80 40 70 50 85 60 C 95 65 95 90 90 120 C 85 150 80 180 70 200 L 30 200 C 20 180 15 150 10 120 C 5 90 5 65 15 60 C 30 50 20 40 20 30 C 20 15 30 0 50 0" />
            </svg>
          </div>

          <div className="space-y-12 relative z-10 flex flex-col items-center">
            {/* Brain */}
            <div className="w-24 h-24 bg-pink-200/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-pink-300/30 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <span className="text-5xl">🧠</span>
            </div>

            {/* Connection Arrows */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-0.5 h-16 bg-gradient-to-b from-teal-400 to-teal-600"></div>
              <svg className="w-6 h-6 text-teal-400 -mt-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Gut */}
            <div className="w-24 h-24 bg-orange-200/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-orange-300/30 shadow-[0_0_30px_rgba(251,146,60,0.3)]">
              <span className="text-5xl">🥨</span>
            </div>
          </div>
        </div>
      ),
    };

    return (
      <div className="my-8">
        {imageContent[image] || (
          <div className="w-full max-w-md mx-auto aspect-square bg-teal-100 rounded-3xl flex items-center justify-center">
            <span className="text-6xl">🎯</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Image */}
      {renderImage()}

      {/* Rating */}
      {rating && (
        <div className="flex flex-col items-start gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(rating.score) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
          <p className="text-xs sm:text-sm font-medium text-gray-400">{rating.text}</p>
        </div>
      )}

      {/* Content */}
      <div className="text-center space-y-3 sm:space-y-4">
        {title && (
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {title}
          </h2>
        )}
        {content.split('\n\n').map((paragraph, index, array) => {
          // Check if paragraph is a source/footnote (starts with "Fonte:" or "*")
          const isFootnote = paragraph.trim().startsWith("Fonte:") || paragraph.trim().startsWith("*");
          const isFirst = index === 0;
          const isLast = index === array.length - 1;

          return (
            <p
              key={index}
              className={`leading-relaxed whitespace-pre-line ${
                isFootnote
                  ? "text-xs sm:text-sm text-gray-500 italic mt-6 sm:mt-8"
                  : isFirst
                    ? "text-lg sm:text-xl font-bold text-gray-900"
                    : isLast
                      ? "text-sm sm:text-base text-gray-400"
                      : "text-base sm:text-lg text-gray-700"
              }`}
            >
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Testimonial */}
      {testimonial && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-teal-100 italic">
          <p className="text-base sm:text-lg text-gray-800 mb-2 font-medium">
            {testimonial.text}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-bold">
            - {testimonial.name}
          </p>
        </div>
      )}
    </div>
  );
}
