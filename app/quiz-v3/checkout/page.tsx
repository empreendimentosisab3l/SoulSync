"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Checkout() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"6months" | "annual">("6months");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 3, seconds: 40 });

  const [formData, setFormData] = useState({
    email: "",
    cardName: "",
    cpf: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const planPrices = {
    "6months": {
      original: 1404.74,
      discount: 1051.80,
      final: 353.94,
      title: "Plano de 6 meses",
      perMonth: 11.00,
    },
    "annual": {
      original: 2809.48,
      discount: 2106.60,
      final: 702.88,
      title: "Plano anual",
      perMonth: 9.50,
    },
  };

  const selectedPlanData = planPrices[selectedPlan];

  const faqs = [
    {
      question: "O que acontece depois que eu faço o pedido?",
      answer: "Após a confirmação do pagamento, você receberá acesso imediato ao programa completo de hipnoterapia personalizado.",
    },
    {
      question: "Como faço o novo curso de Hipnoterapia?",
      answer: "O curso está disponível através do nosso aplicativo e plataforma web, com acesso 24/7 para você praticar quando quiser.",
    },
    {
      question: "A hipnoterapia é segura para você?",
      answer: "Sim! A hipnoterapia é totalmente segura e clinicamente comprovada. Nosso programa foi desenvolvido por hipnoterapeutas certificados.",
    },
  ];

  const handleBack = () => {
    router.push("/quiz-v3/result/5");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement payment processing
    alert("Processando pagamento seguro...");
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1 $2");
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d)/, "$1 / $2");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Timer */}
      <div className="bg-soul-purple text-white py-3 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">SoulSync</h1>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="text-xs mb-1">Apenas R$ {selectedPlanData.perMonth.toFixed(2)} por mês</div>
            <div className="text-sm font-bold">
              Esta oferta é válida para:{" "}
              <span className="bg-white text-soul-purple px-2 py-1 rounded">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>{" "}
              :{" "}
              <span className="bg-white text-soul-purple px-2 py-1 rounded">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
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
          De volta aos planos
        </button>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Experimente o poder da hipnoterapia para emagrecer.
          </h2>
          <p className="text-gray-600">Mais de 158.554 projetos encomendados!</p>
        </div>

        {/* Plan Selector */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Escolha seu plano</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedPlan("6months")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === "6months"
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Escolha seu plano
              </button>
              <button
                onClick={() => setSelectedPlan("annual")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === "annual"
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Economize no método de pagamento mensal
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <span className="text-gray-700">{selectedPlanData.title}</span>
              <span className="text-gray-900 font-semibold">
                R$ {selectedPlanData.original.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <span className="text-green-600">Desconto -75%</span>
              <span className="text-green-600 font-semibold">
                -R$ {selectedPlanData.discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                R$ {selectedPlanData.final.toFixed(2)} *
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Selecione um método de pagamento
          </h3>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 transition-all ${
                paymentMethod === "card"
                  ? "border-soul-purple bg-soul-cream"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="font-medium">Cartão de crédito</span>
            </button>
            <button
              onClick={() => setPaymentMethod("paypal")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 transition-all ${
                paymentMethod === "paypal"
                  ? "border-soul-purple bg-soul-cream"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="font-bold text-blue-600">Pay</span>
              <span className="font-bold text-blue-400">Pal</span>
            </button>
          </div>
        </div>

        {/* Payment Form */}
        {paymentMethod === "card" && (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Endereço de email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="libempreenditeslo@gmail.com"
                    required
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Card Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nome no cartão
                </label>
                <input
                  type="text"
                  value={formData.cardName}
                  onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="João Smith"
                  required
                />
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">CPF</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({ ...formData, cpf: formatCPF(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Número do cartão
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Data de validade
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: formatExpiryDate(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM / AA"
                    maxLength={7}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    CVV/CVC/CSC
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) =>
                      setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="000"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card Logos */}
            <div className="flex justify-center items-center gap-3 my-6">
              <div className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded">
                VISA
              </div>
              <div className="px-3 py-2 bg-gray-700 text-white text-xs font-bold rounded">
                MC
              </div>
              <div className="px-3 py-2 bg-blue-500 text-white text-xs font-bold rounded">
                AMEX
              </div>
              <div className="px-3 py-2 bg-gray-600 text-white text-xs font-bold rounded">
                ELO
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-soul-purple text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-soul-lavender hover:scale-105 mb-4 shadow-lg"
            >
              Pagamento seguro completo
            </button>

            {/* Terms */}
            <p className="text-xs text-center text-gray-600 mb-6">
              Concordo com os{" "}
              <a href="#" className="text-blue-600 underline">
                Termos e Condições
              </a>{" "}
              e a{" "}
              <a href="#" className="text-blue-600 underline">
                Política de Privacidade
              </a>
            </p>
          </form>
        )}

        {/* Important Notice */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              Siga as instruções na tela para concluir sua assinatura de segurança. Depois de inserir a
              senha de autenticação de pagamento, o pagamento estará concluído.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              O preço é válido para o primeiro período de sua assinatura. Posteriormente você será cobrado com a
              assinatura mensal. Os encargos recorrentes continuarão até você cancelá-los através de seu
              aplicativo SoulSync ou pela opção de cancelamento no e-mail.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            Por que os clientes nos adoram?
          </h3>
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
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
                <p className="text-sm text-gray-700 mb-3">
                  "A hipnoterapia fez parada de caso roxo, minha meleca quando eu acordei, saquei
                  durante alimentos emocionais e por que durante perdeu dentro somente 4 dias. Simone
                  foi incrível. O programa era continua e bem confortado na minha família."
                </p>
                <p className="text-xs text-gray-500">- nombre</p>
              </div>
            </div>
          </div>
        </div>

        {/* Media Logos */}
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-600 mb-4">A hipnoterapia foi abordada em:</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="text-gray-400 font-bold text-sm">Bloomberg</div>
            <div className="text-gray-400 font-bold text-sm">BUSINESS INSIDER</div>
            <div className="text-gray-400 font-bold text-sm">yahoo! FINANCE</div>
            <div className="text-gray-400 font-bold text-sm">CBS</div>
          </div>
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
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
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
                Garantia de devolução do dinheiro em 30 dias
              </h4>
              <p className="text-sm text-gray-700">
                Oferecemos garantia de reembolso total aos usuários que tenham pago menos de 30 sessões em até 30
                dias após a compra e não precisaram de nenhuma melhora.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-soul-purple text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-soul-lavender hover:scale-105 mb-4 shadow-lg"
        >
          Obtenha meu plano
        </button>

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
