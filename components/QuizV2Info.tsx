'use client';

interface QuizV2InfoProps {
  title?: string;
  content: string;
  infoType?: "testimonial" | "educational" | "social-proof" | "comparison";
  onContinue: () => void;
  buttonText?: string;
  image?: string; // URL da imagem (opcional)
}

export default function QuizV2Info({
  title,
  content,
  infoType = "educational",
  onContinue,
  buttonText = "Continuar",
  image
}: QuizV2InfoProps) {
  const getIcon = () => {
    switch (infoType) {
      case "testimonial":
        return "⭐";
      case "educational":
        return "💡";
      case "social-proof":
        return "🏆";
      case "comparison":
        return ""; // Sem ícone para tipo comparison
      default:
        return "";
    }
  };

  const getBorderColor = () => {
    switch (infoType) {
      case "testimonial":
      case "social-proof":
        return "border-hypno-accent/50";
      case "educational":
        return "border-hypno-purple/50";
      case "comparison":
        return "border-green-500/50";
      default:
        return "border-hypno-purple/30";
    }
  };

  const renderContentLines = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Handle bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('✓') || line.trim().startsWith('✗')) {
        const isPositive = line.trim().startsWith('✓');
        const isNegative = line.trim().startsWith('✗');
        return (
          <div
            key={index}
            className={`flex items-start gap-3 mb-3 ${isPositive ? 'text-white' : isNegative ? 'text-red-400/80' : ''
              }`}
          >
            <span className={`text-xl mt-0.5 ${isPositive ? 'text-hypno-accent' : ''}`}>
              {line.trim()[0]}
            </span>
            <span className="flex-1">{line.trim().substring(1).trim()}</span>
          </div>
        );
      }

      // Handle dividers
      if (line.trim().startsWith('━━━')) {
        return (
          <div key={index} className="my-4 border-t border-hypno-purple/30" />
        );
      }

      // Handle stars (ratings)
      if (line.includes('⭐')) {
        return (
          <div key={index} className="text-center text-2xl my-2">
            {line}
          </div>
        );
      }

      // Regular text
      return line.trim() ? (
        <p key={index} className="mb-3">
          {line}
        </p>
      ) : (
        <div key={index} className="h-2" />
      );
    });
  };

  // Renderizar conteúdo com possibilidade de inserir imagem no meio
  const renderContent = () => {
    // Se há imagem e marcador {{IMAGE}} no conteúdo, dividir
    if (image && content.includes('{{IMAGE}}')) {
      const parts = content.split('{{IMAGE}}');
      return (
        <>
          {renderContentLines(parts[0])}
          <div className="flex justify-center my-6">
            <img
              src={image}
              alt="Foto de transformação"
              className="rounded-2xl w-full max-w-md object-cover shadow-lg"
            />
          </div>
          {parts[1] && renderContentLines(parts[1])}
        </>
      );
    }

    // Caso contrário, renderizar conteúdo normalmente
    return renderContentLines(content);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      {/* Content Card */}
      <div className="space-y-6">
        {/* Icon - only show if there's a title */}
        {getIcon() && title && (
          <div className="text-center">
            <span className="text-6xl">{getIcon()}</span>
          </div>
        )}

        {/* Title */}
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center leading-tight">
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="text-white/80 text-lg leading-relaxed whitespace-pre-line">
          {renderContent()}
        </div>
      </div>

      {/* Continue Button - Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-50 flex justify-center">
        <div className="w-full max-w-md">
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-hypno-purple to-hypno-accent text-white py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-hypno-accent/50 transition-all duration-300"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
