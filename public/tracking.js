/**
 * QuizTracker - Sistema de tracking para quizzes
 *
 * USO:
 * 1. Importar no início do quiz
 * 2. Inicializar: const tracker = new QuizTracker('quiz_v1')
 * 3. Chamar métodos em cada evento
 */

class QuizTracker {
  constructor(quizId, apiEndpoint = '/api/track') {
    this.quizId = quizId;
    this.apiEndpoint = apiEndpoint;
    this.sessionId = this.getOrCreateSessionId();
    this.startTime = Date.now();
    this.currentCard = 0;
    this.cardStartTime = Date.now();
    this.events = []; // Queue para retry

    // Auto-inicializar
    this.init();
  }

  /**
   * Inicialização automática
   */
  async init() {
    await this.trackStart();
    this.setupAbandonDetection();
    this.setupBeforeUnload();
  }

  /**
   * Gerar ou recuperar session ID único
   */
  getOrCreateSessionId() {
    const storageKey = 'quiz_session_id';
    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
      sessionId = this.generateUUID();
      sessionStorage.setItem(storageKey, sessionId);
    }

    return sessionId;
  }

  /**
   * Gerar UUID v4
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Coletar dados do dispositivo
   */
  getDeviceInfo() {
    return {
      device: this.detectDevice(),
      browser: this.detectBrowser(),
      os: this.detectOS(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height
    };
  }

  /**
   * Coletar parâmetros UTM
   */
  getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
      utmContent: params.get('utm_content'),
      utmTerm: params.get('utm_term')
    };
  }

  /**
   * Detectar tipo de dispositivo
   */
  detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  /**
   * Detectar navegador
   */
  detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome') && !ua.includes('Edge')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    return 'Other';
  }

  /**
   * Detectar sistema operacional
   */
  detectOS() {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'MacOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Other';
  }

  /**
   * EVENT 1: Início do quiz
   */
  async trackStart() {
    const deviceInfo = this.getDeviceInfo();
    const utmParams = this.getUTMParams();

    await this.sendEvent({
      event: 'quiz_started',
      quizId: this.quizId,
      sessionId: this.sessionId,
      ...deviceInfo,
      ...utmParams,
      timestamp: Date.now()
    });
  }

  /**
   * EVENT 2: Card visualizado
   */
  async trackCardView(cardNumber, cardName = '') {
    // Salvar tempo do card anterior
    if (this.currentCard > 0) {
      const timeSpent = Math.floor((Date.now() - this.cardStartTime) / 1000);
      await this.sendEvent({
        event: 'card_completed',
        sessionId: this.sessionId,
        cardNumber: this.currentCard,
        timeSpent,
        timestamp: Date.now()
      });
    }

    // Novo card
    this.currentCard = cardNumber;
    this.cardStartTime = Date.now();

    await this.sendEvent({
      event: 'card_viewed',
      sessionId: this.sessionId,
      cardNumber,
      cardName,
      timestamp: Date.now()
    });
  }

  /**
   * EVENT 3: Resposta dada
   */
  async trackAnswer(cardNumber, cardName, answer) {
    const timeSpent = Math.floor((Date.now() - this.cardStartTime) / 1000);

    await this.sendEvent({
      event: 'card_answered',
      sessionId: this.sessionId,
      cardNumber,
      cardName,
      answer: typeof answer === 'object' ? JSON.stringify(answer) : String(answer),
      timeSpent,
      timestamp: Date.now()
    });
  }

  /**
   * EVENT 4: Email coletado
   */
  async trackEmail(email) {
    await this.sendEvent({
      event: 'email_collected',
      sessionId: this.sessionId,
      email,
      cardNumber: this.currentCard,
      timestamp: Date.now()
    });
  }

  /**
   * EVENT 5: Nome coletado
   */
  async trackName(name) {
    await this.sendEvent({
      event: 'name_collected',
      sessionId: this.sessionId,
      name,
      cardNumber: this.currentCard,
      timestamp: Date.now()
    });
  }

  /**
   * EVENT 6: Quiz completado
   */
  async trackComplete() {
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);

    await this.sendEvent({
      event: 'quiz_completed',
      sessionId: this.sessionId,
      totalTime,
      timestamp: Date.now()
    });
  }

  /**
   * EVENT 7: Oferta visualizada
   */
  async trackOfferView() {
    await this.sendEvent({
      event: 'offer_viewed',
      sessionId: this.sessionId,
      cardNumber: this.currentCard,
      timestamp: Date.now()
    });
  }

  /**
   * EVENT 8: Conversão/Compra
   */
  async trackConversion(amount, coupon = null, paymentMethod = null) {
    await this.sendEvent({
      event: 'conversion',
      sessionId: this.sessionId,
      amount: Number(amount),
      coupon,
      paymentMethod,
      timestamp: Date.now()
    });
  }

  /**
   * EVENT 9: Abandono
   */
  async trackAbandon() {
    const timeInQuiz = Math.floor((Date.now() - this.startTime) / 1000);

    await this.sendEvent({
      event: 'quiz_abandoned',
      sessionId: this.sessionId,
      lastCard: this.currentCard,
      timeInQuiz,
      timestamp: Date.now()
    });
  }

  /**
   * Enviar evento para o backend
   */
  async sendEvent(data) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Tracking error:', error);

      // Adicionar à fila para retry
      this.events.push(data);

      // Tentar reenviar depois
      setTimeout(() => this.retryFailedEvents(), 5000);
    }
  }

  /**
   * Retentar eventos que falharam
   */
  async retryFailedEvents() {
    if (this.events.length === 0) return;

    const eventsToRetry = [...this.events];
    this.events = [];

    for (const event of eventsToRetry) {
      await this.sendEvent(event);
    }
  }

  /**
   * Detectar abandono após 30 segundos de inatividade
   */
  setupAbandonDetection() {
    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.trackAbandon();
      }, 30000); // 30 segundos
    };

    // Reset no movimento/interação
    const events = ['mousemove', 'touchstart', 'click', 'scroll', 'keypress'];
    events.forEach(eventName => {
      document.addEventListener(eventName, resetTimeout, { passive: true });
    });

    resetTimeout();
  }

  /**
   * Detectar quando usuário está saindo da página
   */
  setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      // Usar sendBeacon para garantir envio antes de sair
      const data = {
        event: 'page_exit',
        sessionId: this.sessionId,
        lastCard: this.currentCard,
        timeInQuiz: Math.floor((Date.now() - this.startTime) / 1000),
        timestamp: Date.now()
      };

      navigator.sendBeacon(
        this.apiEndpoint,
        JSON.stringify(data)
      );
    });
  }
}

// Export para uso
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuizTracker;
}
