"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Result5() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("plan2");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      id: "plan1",
      title: "Assinatura Anual",
      subtitle: "Em até 12x de",
      price: "R$ 15,96",
      fullPrice: "R$ 149,90 à vista",
      popular: false,
    },
    {
      id: "plan2",
      title: "Assinatura Semestral",
      subtitle: "Em até 6x de",
      price: "R$ 17,14",
      fullPrice: "R$ 89,90 à vista",
      popular: true,
    },
    {
      id: "plan3",
      title: "Assinatura Trimestral",
      subtitle: "Em até 3x de",
      price: "R$ 21,58",
      fullPrice: "",
      popular: false,
    },
  ];

  const benefits = [
    "Acesso vitalício à totalidade de materiais didáticos interativos",
    "Seu programa de hipnoterapia personalizado",
    "Curso de estilo de vida saudável de 6 semanas em um único plano",
    "Conteúdo diagonar sem qualquer custo adicional",
    "Suporte em cartas 24 horas por dia, 7 dias por semana",
  ];

  const faqs = [
    {
      question: "O que acontece depois que eu faço o pagamento?",
      answer: "Após confirmar o pagamento, você terá acesso imediato ao programa completo e poderá começar sua jornada de transformação.",
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar quando quiser. Além disso, oferecemos 90 dias de garantia total de devolução do dinheiro.",
    },
    {
      question: "A hipnoterapia é segura para mim?",
      answer: "Sim! A hipnoterapia é totalmente segura e clinicamente comprovada. Nosso programa foi desenvolvido por especialistas certificados.",
    },
  ];

  const handleBack = () => {
    router.push("/quiz-v3/result/4");
  };

  const handleCheckout = () => {
    window.location.href = "https://lastlink.com/p/CDD3C0290/checkout-payment";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-soul-cream border-b border-soul-sand py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-soul-purple">SoulSync</h1>
          <div className="flex items-center gap-2">
            <div className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              ⭐ 4.8/5
            </div>
            <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              🛡️ Garantia
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
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

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Olá!</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Com base nos seus respostas você é um candidato ideal para nossa solução de <strong>hipnoterapia</strong> Especial de 3 Meses para transformar sua percepção de comida.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nosso programa de hipnoterapia cientificamente fundamentado que descobriu que ajudar por perder o peso de forma permanente.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Embarque no programa hoje e sinta a diferença em apenas semanas. Comprometa-se com 15 minutos de hipnoterapia por dia. Inclua os 2 meses do programa de 4 semanas, feche e você ira adiantar!
          </p>
        </div>

        {/* Plan Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Selecione seu plano
          </h3>

          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MAIS POPULAR
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.id
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{plan.title}</h4>
                      <p className="text-sm text-gray-600">{plan.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{plan.price}</p>
                    {plan.fullPrice && <p className="text-sm text-gray-600">{plan.fullPrice}</p>}
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full py-4 bg-soul-purple text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-soul-lavender hover:scale-105 mb-4 shadow-lg"
        >
          Pague agora
        </button>

        {/* Payment Methods */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="text-sm text-gray-500 px-3 py-1 border border-gray-300 rounded">VISA</div>
          <div className="text-sm text-gray-500 px-3 py-1 border border-gray-300 rounded">Mastercard</div>
          <div className="text-sm text-gray-500 px-3 py-1 border border-gray-300 rounded">AMEX</div>
          <div className="text-sm text-gray-500 px-3 py-1 border border-gray-300 rounded">Elo</div>
        </div>

        {/* Benefits List */}
        <div className="mb-8 bg-gray-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Todos os planos incluem</h3>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonials Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            Por que os clientes nos adoram?
          </h3>
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              "A hipnoterapia mudou completamente minha relação com a comida. Perdi 12kg em 3 meses sem sofrimento. Recomendo!"
            </p>
            <p className="text-xs text-gray-500">- Maria S., São Paulo</p>
          </div>
        </div>

        {/* Media Logos */}
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-600 mb-4">A hipnoterapia foi abordada em:</p>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="text-gray-400 font-bold text-lg">Forbes</div>
            <div className="text-gray-400 font-bold text-lg">BBC</div>
            <div className="text-gray-400 font-bold text-lg">CNN</div>
            <div className="text-gray-400 font-bold text-lg">TIME</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Como funciona?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Escolha seu plano</h4>
                <p className="text-sm text-gray-600">Selecione o plano ideal para você.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Comece sua jornada</h4>
                <p className="text-sm text-gray-600">Acesse seu programa personalizado imediatamente.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Pratique 15 minutos por dia</h4>
                <p className="text-sm text-gray-600">Dedique apenas 15 minutos diários.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Veja resultados em semanas</h4>
                <p className="text-sm text-gray-600">Transforme sua vida com uma técnica comprovada.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="mb-8 bg-gray-100 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ainda não tem certeza? Ouça suas perspectivas</h3>
          <div className="aspect-video bg-gray-300 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Assista ao depoimento de perspectivas</p>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            As pessoas costumam nos perguntar:
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                Garantia de devolução 100% do dinheiro após 90 dias
              </h4>
              <p className="text-sm text-gray-700">
                Se você não estiver satisfeito com os resultados em 90 dias, devolvemos 100% do seu investimento. Sem perguntas, sem complicações.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <button
          onClick={handleCheckout}
          className="w-full py-4 bg-soul-purple text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-soul-lavender hover:scale-105 mb-4 shadow-lg"
        >
          Pague agora
        </button>

        {/* Payment Methods */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="text-sm text-gray-500 px-3 py-1 border border-gray-300 rounded">VISA</div>
          <div className="text-sm text-gray-500 px-3 py-1 border border-gray-300 rounded">Mastercard</div>
          <div className="text-sm text-gray-500 px-3 py-1 border border-gray-300 rounded">AMEX</div>
          <div className="text-sm text-gray-500 px-3 py-1 border border-gray-300 rounded">Elo</div>
        </div>

        {/* Security Badge */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🔒 Pagamento 100% seguro e criptografado
          </p>
        </div>
      </div>
    </div>
  );
}
