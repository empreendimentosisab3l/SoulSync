'use client';

import { useParams, useRouter } from 'next/navigation';
import { upsellCourses } from '@/lib/upsellCourses';
import { useState } from 'react';

export default function UpsellPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const course = upsellCourses[courseId];
  const [showPaymentOnce, setShowPaymentOnce] = useState(true);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-3xl font-bold mb-4">Curso não encontrado</h1>
          <button
            onClick={() => router.push('/membros')}
            className="px-6 py-3 bg-white text-teal-700 rounded-full font-semibold hover:bg-gray-100"
          >
            Voltar para Membros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800">
      {/* Header */}
      <header className="bg-teal-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/membros')}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">SoulSync</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section with Image and Price */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl mb-8">
          <div className="grid md:grid-cols-2 gap-6 p-8">
            {/* Left: Image */}
            <div className="relative">
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                OFERTA ESPECIAL
              </div>
              <div className="aspect-square bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl overflow-hidden">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🎧
                  </div>
                )}
              </div>
            </div>

            {/* Right: Title and Price */}
            <div className="flex flex-col justify-center">
              <p className="text-teal-700 text-sm font-semibold uppercase tracking-wide mb-2">
                {course.subtitle}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-teal-700">
                    R${course.price.toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    R${course.originalPrice.toFixed(2)}
                  </span>
                </div>
                {showPaymentOnce && (
                  <p className="text-sm text-gray-600">Pague apenas uma vez!</p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = course.checkoutUrl}
                  className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  SIM! QUERO ESSA OFERTA ESPECIAL
                </button>
                <button
                  onClick={() => router.push('/membros')}
                  className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Não tenho interesse
                </button>
              </div>

              {/* Guarantee Badge */}
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Sem risco e sem assinatura. Sem taxas ocultas. Sem contratos.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-teal-800/50 backdrop-blur-sm rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Veja o que está esperando por você:
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {course.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-teal-100 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        {course.testimonials && course.testimonials.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              O que nossos clientes dizem sobre este curso
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {course.testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-2xl flex-shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="flex gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pronto para começar sua transformação?
          </h2>
          <p className="text-gray-600 mb-6">
            Junte-se a milhares de pessoas que já transformaram suas vidas com nossas sessões de hipnoterapia.
          </p>
          <button
            onClick={() => window.location.href = course.checkoutUrl}
            className="px-12 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] mb-4"
          >
            SIM! QUERO ESSA OFERTA ESPECIAL
          </button>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Pagamento 100% seguro e protegido</span>
          </div>
        </div>
      </div>
    </div>
  );
}
