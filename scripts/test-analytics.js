// scripts/test-analytics.js
// Script para testar o sistema de analytics com dados simulados

const apiUrl = 'http://localhost:3001/api/track';

async function sendEvent(eventData) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    const result = await response.json();
    console.log(`✓ Evento enviado: ${eventData.event}`, result);
    return result;
  } catch (error) {
    console.error(`✗ Erro ao enviar ${eventData.event}:`, error.message);
  }
}

async function simulateCompleteJourney(journeyNumber, convert = true) {
  const sessionId = `test_session_${journeyNumber}_${Date.now()}`;
  const email = `usuario${journeyNumber}@teste.com`;

  console.log(`\n=== Simulando Jornada ${journeyNumber} ===`);

  // 1. Quiz Started
  await sendEvent({
    event: 'quiz_started',
    quizId: 'hypnozio-weight-loss-quiz',
    sessionId: sessionId,
    metadata: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      screenWidth: 1920,
      screenHeight: 1080,
      language: 'pt-BR',
      referrer: 'https://google.com',
      utmSource: journeyNumber % 3 === 0 ? 'facebook' : journeyNumber % 2 === 0 ? 'instagram' : 'google',
      utmMedium: 'cpc',
      utmCampaign: 'test-campaign',
      device: 'desktop',
      browser: 'Chrome',
      os: 'Windows',
      timestamp: new Date().toISOString()
    }
  });

  // Simular delay entre eventos
  await new Promise(resolve => setTimeout(resolve, 500));

  // 2. Card Views e Answers (simular 10 cards)
  for (let i = 1; i <= 10; i++) {
    await sendEvent({
      event: 'card_viewed',
      quizId: 'hypnozio-weight-loss-quiz',
      sessionId: sessionId,
      cardNumber: i,
      cardName: `Pergunta ${i}`,
      metadata: { timestamp: new Date().toISOString() }
    });

    await new Promise(resolve => setTimeout(resolve, 200));

    await sendEvent({
      event: 'card_answered',
      quizId: 'hypnozio-weight-loss-quiz',
      sessionId: sessionId,
      cardNumber: i,
      cardName: `Pergunta ${i}`,
      answer: `Resposta ${i}`,
      metadata: { timestamp: new Date().toISOString() }
    });

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // 3. Quiz Completed
  await sendEvent({
    event: 'quiz_completed',
    quizId: 'hypnozio-weight-loss-quiz',
    sessionId: sessionId,
    email: email,
    metadata: { timestamp: new Date().toISOString() }
  });

  await new Promise(resolve => setTimeout(resolve, 500));

  // 4. Conversion (apenas alguns convertem)
  if (convert) {
    await sendEvent({
      event: 'conversion',
      quizId: 'hypnozio-weight-loss-quiz',
      sessionId: sessionId,
      email: email,
      amount: 97.00,
      orderId: `order_${journeyNumber}_${Date.now()}`,
      metadata: { timestamp: new Date().toISOString() }
    });
    console.log(`💰 Usuário ${journeyNumber} CONVERTEU!`);
  } else {
    console.log(`📊 Usuário ${journeyNumber} completou mas NÃO converteu`);
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes do sistema de analytics...\n');

  // Simular 10 jornadas completas
  for (let i = 1; i <= 10; i++) {
    // 60% convertem, 40% não convertem
    const shouldConvert = Math.random() > 0.4;
    await simulateCompleteJourney(i, shouldConvert);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ Testes concluídos!');
  console.log('\n📊 Acesse o dashboard em: http://localhost:3001/dashboard');
  console.log('🔑 Login: admin / admin123\n');
}

// Executar testes
runTests().catch(console.error);
