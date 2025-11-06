"use client";

import { useRouter } from "next/navigation";

export default function Result4() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/quiz/result/5");
  };

  const handleBack = () => {
    router.push("/quiz/result/3");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900 text-center">SoulSync</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              TAXA DE SUCESSO DE <span className="text-green-600">93%</span>
            </h2>
          </div>

          {/* Description Card */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-sm text-gray-700 space-y-4">
            <p className="font-semibold text-center text-gray-900">
              Comprovado pela ciência, verificado pelos usuários.
            </p>

            <p>
              O SoulSync foi desenvolvido com os melhores especialistas em hipnoterapia, cada um contribuindo com sua experiência única para garantir a eficácia de cada sessão.
            </p>

            <p>
              Pesquisas indicam que a hipnose demonstra uma{" "}
              <strong>taxa de sucesso notável</strong> de até 93%, superando tanto as abordagens comportamentais quanto as psicoterapêuticas.
            </p>

            <p>
              Descubra o poder transformador da hipnoterapia sem restrições ou riscos.{" "}
              <strong>
                As primeiras pessoas alcançaram seus objetivos com a hipnoterapia — convidamos você a ser uma delas!
              </strong>
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="bg-white border-2 border-purple-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-purple-200 flex-shrink-0 overflow-hidden">
                <img
                  src="/api/placeholder/80/80"
                  alt="Renia Reenpää"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center"><svg class="w-10 h-10 text-purple-700" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg></div>';
                    }
                  }}
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Renia Reenpää</h4>
                <p className="text-xs text-gray-500 mb-3">Chefe do Programa</p>
                <p className="text-sm text-gray-700">
                  Hipnoterapeuta clínica treinado pela ICH e coach de vida certificado, com foco em técnicas de estado de espírito e PNL.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-blue-700 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105"
          >
            Próxima
          </button>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
            <svg
              className="w-6 h-6 text-purple-700 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-gray-700">
              Desfrute com os melhores especialistas em hipnoterapia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
