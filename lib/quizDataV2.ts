/**
 * Quiz V2 - Hipnoterapia para Emagrecimento
 * 50 Cards baseados em pesquisa de mercado e provas científicas
 * Paleta Premium Dark: #1A1A2E, #6A4C93, #00D9FF
 */

export type QuizV2QuestionType =
  | "choice"        // Seleção única
  | "multiple"      // Seleção múltipla
  | "range"         // Escala (1-5)
  | "input"         // Input de texto/número
  | "info"          // Card educacional/prova social
  | "body-focus"    // Seleção de partes do corpo
  | "wheel"         // Roleta de prazo
  | "analysis"      // Análise dinâmica com IA
  | "scratch"       // Raspadinha de desconto
  | "date"          // Seletor de data personalizado
  | "visualization"; // Visualização antes/depois

export interface QuizV2Option {
  label: string;
  value: string;
  icon?: string;
  image?: string;
}

export interface QuizV2AnalysisStep {
  label: string;
  duration: number; // em milissegundos
}

export interface QuizV2Question {
  id: number;
  type: QuizV2QuestionType;
  title?: string;
  subtitle?: string;
  description?: string;
  question?: string;
  options?: QuizV2Option[];

  // Para cards do tipo info
  infoType?: "testimonial" | "educational" | "social-proof" | "comparison";
  content?: string;
  image?: string; // URL da imagem (opcional)

  // Para inputs
  inputType?: "text" | "email" | "number";
  placeholder?: string;
  unit?: string;

  // Para range
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;

  // Para analysis
  analysisSteps?: QuizV2AnalysisStep[];
  autoAdvance?: boolean;

  // Para scratch (raspadinha)
  discountPercent?: number;
  discountText?: string;

  // Metadados
  buttonText?: string;
  progress?: number; // Progresso visual (0-100)
  showTerms?: boolean; // Mostrar checkbox de termos
  feedbackType?: 'bmi' | 'weight-loss'; // Tipo de feedback dinâmico
}

export const quizV2Data: QuizV2Question[] = [
  // CARD 01: LANDING PAGE
  {
    id: 1,
    type: "info",
    infoType: "social-proof",
    title: "A PERDA DE PESO COMEÇA NO SEU CÉREBRO",
    subtitle: "Junte-se a 187.432 pessoas que eliminaram os desejos incontroláveis em poucas noites com hipnoterapia.",
    content: "⭐⭐⭐⭐⭐ 98% taxa de satisfação\n\n• \"Perdi 12kg sem dieta rígida! 😊\" - Tina, 47\n• \"Perdi 9,5kg & 14% de gordura!\" - Samantha, 53\n• \"Parei de comer por emoções sem esforço\" - Maya, 43",
    buttonText: "COMEÇAR MEU PLANO PERSONALIZADO",
    progress: 0
  },

  // CARD 02: SELEÇÃO DE GÊNERO
  {
    id: 2,
    type: "choice",
    question: "Para começar, selecione seu gênero:",
    options: [
      { label: "♀ FEMININO", value: "feminino", icon: "♀" },
      { label: "♂ MASCULINO", value: "masculino", icon: "♂" },
      { label: "Prefiro não informar", value: "outro" }
    ],
    progress: 2
  },

  // CARD 03: ENCAMINHAMENTO PROFISSIONAL
  {
    id: 3,
    type: "choice",
    question: "Você foi encaminhado(a) por um(a) nutricionista ou terapeuta cognitivo-comportamental?",
    description: "A hipnose é um método cientificamente comprovado para resolver problemas relacionados à nutrição e questões psicológicas.",
    options: [
      { label: "Sim", value: "sim" },
      { label: "Não", value: "nao" }
    ],
    progress: 4
  },

  // CARD 04: TENTATIVAS ANTERIORES
  {
    id: 4,
    type: "choice",
    question: "Você já tentou perder peso antes?",
    options: [
      { label: "Sim, várias vezes e nada funcionou", value: "varias-falhou" },
      { label: "Sim, perdi peso mas voltei a ganhar", value: "efeito-sanfona" },
      { label: "Sim, algumas vezes", value: "algumas" },
      { label: "Esta é minha primeira tentativa", value: "primeira" }
    ],
    progress: 6
  },

  // CARD 05: O QUE NÃO FUNCIONOU
  {
    id: 5,
    type: "multiple",
    question: "O que não funcionou nas suas tentativas anteriores?",
    subtitle: "Selecione todas as opções aplicáveis:",
    options: [
      { label: "Dietas muito restritivas", value: "dietas-restritivas" },
      { label: "Exercícios muito intensos", value: "exercicios-intensos" },
      { label: "Falta de tempo", value: "falta-tempo" },
      { label: "Falta de motivação", value: "falta-motivacao" },
      { label: "Desejos incontroláveis por comida", value: "desejos" },
      { label: "Comer emocional (ansiedade, estresse)", value: "comer-emocional" },
      { label: "Efeito sanfona", value: "efeito-sanfona" },
      { label: "Muito complicado", value: "complicado" }
    ],
    progress: 8
  },

  // CARD 06: ALTURA (AGORA PRIMEIRO)
  {
    id: 6,
    type: "input",
    question: "Qual é a sua altura?",
    inputType: "number",
    unit: "cm",
    placeholder: "170",
    showTerms: true, // Checkbox de termos
    progress: 10
  },

  // CARD 07: PESO ATUAL (AGORA SEGUNDO)
  {
    id: 7,
    type: "input",
    question: "Qual é o seu peso atual?",
    inputType: "number",
    unit: "kg",
    placeholder: "75",
    description: "🔒 Não se preocupe, isso é completamente privado",
    progress: 12
  },

  // CARD 08: PESO DESEJADO
  {
    id: 8,
    type: "input",
    question: "Qual é o seu peso desejado?",
    inputType: "number",
    unit: "kg",
    placeholder: "65",
    feedbackType: "weight-loss", // Feedback de perda de peso
    progress: 14
  },

  // CARD 09: FAIXA ETÁRIA
  {
    id: 9,
    type: "choice",
    question: "Qual é a sua faixa etária?",
    options: [
      { label: "18-25", value: "18-25" },
      { label: "26-35", value: "26-35" },
      { label: "36-45", value: "36-45" },
      { label: "46-55", value: "46-55" },
      { label: "56+", value: "56+" }
    ],
    progress: 16
  },

  // CARD 10: MOTIVAÇÃO PRINCIPAL
  {
    id: 10,
    type: "choice",
    question: "Por que você quer perder peso?",
    options: [
      { label: "Melhorar minha saúde (pressão, diabetes, etc)", value: "saude" },
      { label: "Aumentar minha autoestima e confiança", value: "autoestima" },
      { label: "Ter mais energia para o dia a dia", value: "energia" },
      { label: "Me sentir melhor no meu corpo", value: "bem-estar" },
      { label: "Melhorar meus relacionamentos", value: "relacionamentos" },
      { label: "Evento importante (casamento, viagem)", value: "evento" },
      { label: "Outro motivo", value: "outro" }
    ],
    progress: 18
  },

  // CARD 11: PARTES DO CORPO
  {
    id: 11,
    type: "body-focus",
    question: "Em que partes do seu corpo você deseja se concentrar?",
    subtitle: "Selecione todas as opções aplicáveis:",
    options: [
      { label: "Pernas", value: "pernas", image: "legs" },
      { label: "Barriga", value: "barriga", image: "belly" },
      { label: "Braços", value: "bracos", image: "arms" },
      { label: "Bumbum", value: "bumbum", image: "glutes" },
      { label: "Rosto e pescoço", value: "rosto", image: "face" },
      { label: "Costas", value: "costas", image: "back" }
    ],
    progress: 20
  },

  // CARD 12: PROVA SOCIAL #1
  {
    id: 12,
    type: "info",
    infoType: "testimonial",
    title: "🏆 Mais de 180.000 transformações",
    content: "\"Pessoas como você já perderam em média 9,2kg com nosso programa de hipnoterapia\"\n\n{{IMAGE}}\n\n\"Eu adoro esse aplicativo! Perdi 9,5kg & 14% gordura!\"\n⭐⭐⭐⭐⭐ - Samantha, 53",
    image: "https://res.cloudinary.com/dw1p11dgq/image/upload/v1763512245/soulsync/testimonials/review-photo-3.png",
    buttonText: "Continuar",
    progress: 22
  },

  // CARD 13: NÍVEL DE ATIVIDADE FÍSICA
  {
    id: 13,
    type: "choice",
    question: "Qual é o seu nível de atividade física atual?",
    options: [
      { label: "Sedentário (pouco/nenhum exercício)", value: "sedentario" },
      { label: "Levemente ativo (1-2x/semana)", value: "leve" },
      { label: "Moderadamente ativo (3-4x/semana)", value: "moderado" },
      { label: "Muito ativo (5-6x/semana)", value: "muito-ativo" },
      { label: "Extremamente ativo (diariamente)", value: "extremo" }
    ],
    progress: 24
  },

  // CARD 14: ALIMENTAÇÃO ATUAL
  {
    id: 14,
    type: "choice",
    question: "Como você descreveria sua alimentação atual?",
    options: [
      { label: "Muito saudável", value: "muito-saudavel" },
      { label: "Geralmente saudável", value: "geralmente-saudavel" },
      { label: "Meio a meio", value: "meio-a-meio" },
      { label: "Não muito saudável", value: "pouco-saudavel" },
      { label: "Precisa de muita melhora", value: "precisa-melhora" }
    ],
    progress: 26
  },

  // CARD 15: REFEIÇÕES POR DIA
  {
    id: 15,
    type: "choice",
    question: "Quantas refeições você faz por dia?",
    subtitle: "Geralmente, quantas refeições ou lanches você come diariamente?",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4+", value: "4+" }
    ],
    progress: 28
  },

  // CARD 16: DIFICULDADES FÍSICAS
  {
    id: 16,
    type: "multiple",
    question: "Quais dificuldades físicas você sente por causa do seu peso?",
    subtitle: "Selecione quantas quiser:",
    options: [
      { label: "Falta de ar ao se movimentar", value: "falta-ar" },
      { label: "Suando mais do que o normal", value: "suor" },
      { label: "Ronco ou apneia do sono", value: "apneia" },
      { label: "Problemas para dormir bem", value: "sono" },
      { label: "Fadiga constante", value: "fadiga" },
      { label: "Dor nas costas/joelhos", value: "dor" },
      { label: "Problemas digestivos", value: "digestao" },
      { label: "Nenhuma das anteriores", value: "nenhuma" }
    ],
    progress: 30
  },

  // CARD 17: HÁBITOS ALIMENTARES RUINS
  {
    id: 17,
    type: "multiple",
    question: "Com quais hábitos você se identifica?",
    subtitle: "Selecione todos que se aplicam:",
    options: [
      { label: "Comer por ansiedade/estresse/emoções", value: "emocional" },
      { label: "Comer tarde da noite", value: "noite" },
      { label: "Desejos incontroláveis por doces", value: "doces" },
      { label: "Pular refeições e depois comer demais", value: "pular-refeicoes" },
      { label: "Porções muito grandes", value: "porcoes-grandes" },
      { label: "Lanchar constantemente", value: "lanchar" },
      { label: "Comer rápido demais", value: "rapido" },
      { label: "Não consigo parar mesmo saciado", value: "nao-para" }
    ],
    progress: 32
  },

  // CARD 18: IDENTIFICAÇÃO EMOCIONAL - ESCALA
  {
    id: 18,
    type: "range",
    question: "Você se identifica com esta afirmação?",
    description: "\"Mesmo depois de me saciar, eu costumo limpar o prato\"",
    min: 1,
    max: 5,
    minLabel: "De jeito nenhum",
    maxLabel: "Totalmente",
    progress: 34
  },

  // CARD 19: CARD EDUCACIONAL #1
  {
    id: 19,
    type: "info",
    infoType: "educational",
    content: "{{IMAGE}}\n\n\"87% das dietas falham porque focam apenas no QUE comer, não no PORQUÊ você come.\"\n\nSeus hábitos alimentares são controlados por padrões mentais inconscientes criados ao longo dos anos.\n\nNossa hipnoterapia reprograma esses padrões na RAIZ, eliminando desejos e criando novos hábitos automaticamente.",
    image: "https://res.cloudinary.com/dw1p11dgq/image/upload/v1763516372/soulsync/quiz-v2/question-19-illustration.jpg",
    buttonText: "Entendi!",
    progress: 36
  },

  // CARD 20: OBSTÁCULOS PRINCIPAIS
  {
    id: 20,
    type: "choice",
    question: "O que mais te impede de emagrecer?",
    options: [
      { label: "Falta de tempo", value: "tempo" },
      { label: "Falta de motivação", value: "motivacao" },
      { label: "Não sei por onde começar", value: "nao-sei" },
      { label: "Tentei tudo e nada funciona", value: "nada-funciona" },
      { label: "Ambiente não favorável", value: "ambiente" },
      { label: "Ansiedade/estresse", value: "ansiedade" },
      { label: "Não consigo controlar fome e desejos", value: "desejos" }
    ],
    progress: 38
  },

  // CARD 21: QUEBRA DE OBJEÇÃO #1
  {
    id: 21,
    type: "info",
    infoType: "comparison",
    title: "Como o SoulSync pode te ajudar?",
    content: "{{IMAGE}}\n\nNossas sessões de hipnoterapia personalizadas eliminam as principais causas do seu ganho de peso:\n\n✓ Chega de desejos por comida\n✓ Hábitos alimentares ruins bloqueados\n✓ Elimine as crenças limitantes\n✓ Restaure a conexão entre seu intestino e cérebro\n\nBasta abrir o aplicativo SoulSync e ouvir uma sessão de hipnose relaxante antes de dormir.\n\nÉ seguro, sem esforço e comprovado cientificamente.\n\nEstudos de pesquisa médica e dados de usuários do SoulSync sugerem que a hipnose é perfeitamente segura e permite alcançar resultados de perda de peso melhores e mais duradouros.",
    image: "https://res.cloudinary.com/dw1p11dgq/image/upload/v1763518810/soulsync/quiz-v2/question-21-premium.jpg",
    buttonText: "Entendi",
    progress: 40
  },

  // CARD 22: QUALIDADE DO SONO
  {
    id: 22,
    type: "choice",
    question: "Como é a qualidade do seu sono?",
    options: [
      { label: "Excelente (7-9h, acordo descansado)", value: "excelente" },
      { label: "Boa (6-7h, geralmente descansado)", value: "boa" },
      { label: "Regular (menos de 6h)", value: "regular" },
      { label: "Ruim (insônia, acordo várias vezes)", value: "ruim" }
    ],
    progress: 42
  },

  // CARD 23: HIDRATAÇÃO
  {
    id: 23,
    type: "choice",
    question: "Quanta água você bebe por dia?",
    options: [
      { label: "Menos de 1 litro", value: "menos-1" },
      { label: "1-2 litros", value: "1-2" },
      { label: "2-3 litros", value: "2-3" },
      { label: "Mais de 3 litros", value: "mais-3" },
      { label: "Não tenho certeza", value: "nao-sei" }
    ],
    progress: 44
  },

  // CARD 24: NÍVEL DE ESTRESSE
  {
    id: 24,
    type: "choice",
    question: "Qual é o seu nível de estresse no dia a dia?",
    options: [
      { label: "Baixo (calmo na maior parte do tempo)", value: "baixo" },
      { label: "Moderado (às vezes estressado)", value: "moderado" },
      { label: "Alto (frequentemente estressado)", value: "alto" },
      { label: "Muito alto (constantemente sob pressão)", value: "muito-alto" }
    ],
    progress: 46
  },

  // CARD 25: CONDIÇÕES DE SAÚDE
  {
    id: 25,
    type: "multiple",
    question: "Você ganhou peso devido a algum dos acontecimentos abaixo?",
    subtitle: "Selecione todos que se aplicam:",
    options: [
      { label: "Casamento ou relacionamento", value: "casamento" },
      { label: "Lesões ou mobilidade reduzida", value: "lesoes" },
      { label: "Agenda atarefada", value: "agenda" },
      { label: "Metabolismo mais lento (idade)", value: "metabolismo" },
      { label: "Estresse crônico ou ansiedade", value: "estresse" },
      { label: "Novo medicamento", value: "medicamento" },
      { label: "Gravidez", value: "gravidez" },
      { label: "Alterações hormonais (menopausa)", value: "hormonios" },
      { label: "Nenhuma das anteriores", value: "nenhuma" }
    ],
    progress: 48
  },

  // CARD 26: QUEBRA DE OBJEÇÃO #2 (NOVO)
  {
    id: 26,
    type: "info",
    infoType: "comparison",
    title: "Você NÃO precisa...",
    content: "❌ Passar fome com dietas restritivas\n❌ Se matar na academia\n❌ Contar calorias obsessivamente\n❌ Tomar pílulas ou suplementos caros\n\n✅ Com o SoulSync, você apenas:\n1. Ouve 15min por dia\n2. Relaxa e dorme melhor\n3. Deixa seu cérebro fazer o trabalho pesado",
    buttonText: "Eu quero isso!",
    progress: 49
  },

  // CARD 27: DISPONIBILIDADE DE TEMPO
  {
    id: 27,
    type: "choice",
    question: "Quanto tempo você tem disponível por dia para cuidar da sua saúde?",
    subtitle: "(Exercícios, preparo de refeições, autocuidado)",
    options: [
      { label: "Menos de 15 minutos", value: "menos-15" },
      { label: "15-30 minutos", value: "15-30" },
      { label: "30-60 minutos", value: "30-60" },
      { label: "Mais de 1 hora", value: "mais-1h" }
    ],
    progress: 50
  },

  // CARD 28: ROTINA DE TRABALHO
  {
    id: 28,
    type: "choice",
    question: "Como é sua rotina de trabalho?",
    options: [
      { label: "Trabalho em casa (home office)", value: "home-office" },
      { label: "Trabalho presencial", value: "presencial" },
      { label: "Trabalho híbrido", value: "hibrido" },
      { label: "Trabalho em turnos variados", value: "turnos" },
      { label: "Não trabalho / Aposentado(a)", value: "nao-trabalho" }
    ],
    progress: 52
  },

  // CARD 29: COM QUEM MORA
  {
    id: 29,
    type: "choice",
    question: "Com quem você mora?",
    options: [
      { label: "Sozinho(a)", value: "sozinho" },
      { label: "Com parceiro(a)", value: "parceiro" },
      { label: "Com família (filhos)", value: "familia" },
      { label: "Com colegas", value: "colegas" },
      { label: "Outro", value: "outro" }
    ],
    progress: 54
  },

  // CARD 30: PROVA SOCIAL #2
  {
    id: 30,
    type: "info",
    infoType: "testimonial",
    content: "\"Perdi 11kg em 9 semanas sem me privar! A hipnose eliminou meus desejos por doces COMPLETAMENTE. Pela primeira vez, alimentação saudável não parece sacrifício. 😊\"\n\n⭐⭐⭐⭐⭐\n- Ana Paula, 34 anos",
    buttonText: "Continuar",
    progress: 56
  },

  // CARD 31: RESTRIÇÕES ALIMENTARES
  {
    id: 31,
    type: "multiple",
    question: "Você tem alguma restrição alimentar?",
    subtitle: "Selecione todas que se aplicam:",
    options: [
      { label: "Vegetariano(a)", value: "vegetariano" },
      { label: "Vegano(a)", value: "vegano" },
      { label: "Sem glúten", value: "sem-gluten" },
      { label: "Sem lactose", value: "sem-lactose" },
      { label: "Diabetes", value: "diabetes" },
      { label: "Alergias específicas", value: "alergias" },
      { label: "Nenhuma", value: "nenhuma" }
    ],
    progress: 58
  },

  // CARD 32: PREFERÊNCIA DE ABORDAGEM
  {
    id: 32,
    type: "choice",
    question: "Qual abordagem você prefere para emagrecer?",
    options: [
      { label: "Foco em mudança de mentalidade e hábitos", value: "mentalidade" },
      { label: "Foco em alimentação saudável", value: "alimentacao" },
      { label: "Foco em exercícios físicos", value: "exercicios" },
      { label: "Equilíbrio entre todos os aspectos", value: "equilibrio" }
    ],
    progress: 60
  },

  // CARD 33: SUPLEMENTOS
  {
    id: 33,
    type: "choice",
    question: "Você toma ou já tomou suplementos para emagrecimento?",
    options: [
      { label: "Sim, tomo regularmente", value: "sim-regular" },
      { label: "Já tomei no passado", value: "passado" },
      { label: "Tenho interesse, mas nunca tomei", value: "interesse" },
      { label: "Não tenho interesse", value: "sem-interesse" }
    ],
    progress: 62
  },

  // CARD 34: INTRODUÇÃO DA URGÊNCIA
  {
    id: 34,
    type: "info",
    infoType: "educational",
    title: "⚠️ ATENÇÃO",
    content: "Com base no seu perfil, você pode estar em risco de desenvolver:\n\n• Diabetes tipo 2\n• Hipertensão (pressão alta)\n• Doenças cardiovasculares\n• Problemas articulares crônicos\n• Apneia do sono\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nMAS temos uma boa notícia...\n\n━━━━━━━━━━━━━━━━━━━━━━",
    buttonText: "Continuar",
    progress: 64
  },

  // CARD 35: TESE PRINCIPAL
  {
    id: 35,
    type: "info",
    infoType: "educational",
    title: "A TRANSFORMAÇÃO DO CORPO COMEÇA NA SUA MENTE",
    content: "Métodos tradicionais como dietas e exercícios físicos muitas vezes não produzem resultados duradouros.\n\nO aplicativo SoulSync ataca a causa raiz do ganho de peso e a elimina. É a solução mais fácil para emagrecer.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n\"Reprogramamos os padrões mentais inconscientes que sabotam seus esforços, criando mudanças automáticas e permanentes.\"",
    buttonText: "Como funciona?",
    progress: 66
  },

  // CARD 36: COMO FUNCIONA - 4 BENEFÍCIOS
  {
    id: 36,
    type: "info",
    infoType: "educational",
    title: "Como a hipnoterapia te ajuda:",
    content: "✓ Chega de desejos por comida\n   Reprograma padrões mentais que causam compulsão\n\n✓ Hábitos alimentares ruins bloqueados\n   Elimina gatilhos de comer emocional\n\n✓ Elimina as crenças limitantes\n   Remove bloqueios mentais que impedem sucesso\n\n✓ Restaura conexão intestino-cérebro\n   Melhora sinais de saciedade e fome natural",
    buttonText: "Continuar",
    progress: 68
  },

  // CARD 37: PROVA CIENTÍFICA
  {
    id: 37,
    type: "info",
    infoType: "educational",
    title: "🔬 COMPROVADO PELA CIÊNCIA",
    content: "📚 Journal of Consulting and Clinical Psychology (2014)\n\nPacientes que utilizaram hipnoterapia para perda de peso perderam DUAS VEZES MAIS peso do que aqueles que seguiram apenas dieta e exercício.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n📚 International Journal of Clinical and Experimental Hypnosis (2018)\n\nHipnose demonstrou eficácia significativa na redução de peso, especialmente quando combinada com terapia cognitivo-comportamental.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n*Fontes: Kirsch, I. (1996). Journal of Consulting and Clinical Psychology. | Milling, L. S. et al. (2018).*",
    buttonText: "Impressionante!",
    progress: 70
  },

  // CARD 38: QUEBRA DE OBJEÇÃO #2 - COMPARAÇÃO
  {
    id: 38,
    type: "info",
    infoType: "comparison",
    title: "Por que isso é diferente?",
    content: "❌ Dietas Tradicionais:\n   • Restritivas e difíceis de seguir\n   • Exigem força de vontade constante\n   • Resultados temporários (efeito sanfona)\n   • Foco apenas no que comer\n\n✅ Hipnoterapia SoulSync:\n   • Flexível e personalizada\n   • Mudanças automáticas (sem esforço)\n   • Resultados duradouros (sem sanfona)\n   • Muda sua relação com comida na RAIZ",
    buttonText: "Quero isso!",
    progress: 72
  },

  // CARD 39: ANTECIPAÇÃO DO PLANO
  {
    id: 39,
    type: "info",
    infoType: "educational",
    title: "Seu plano personalizado incluirá:",
    content: "✓ Sessões de hipnose personalizadas\n✓ Áudios para reprogramação mental (15-20min)\n✓ Técnicas de autocontrole\n✓ Meditações anti-ansiedade\n✓ Acompanhamento de progresso\n✓ Comunidade exclusiva\n\n🎁 BÔNUS: Guia de Início Rápido\n   Protocolo dos primeiros 7 dias\n\n\"Vamos criar o SEU plano personalizado agora...\"",
    buttonText: "Criar meu plano",
    progress: 74
  },

  // CARD 40: VISUALIZAÇÃO #1 - SENTIMENTO
  {
    id: 40,
    type: "choice",
    question: "Como você se sentirá quando atingir sua meta de peso?",
    options: [
      { label: "Confiante e poderoso(a)", value: "confiante" },
      { label: "Feliz e realizado(a)", value: "feliz" },
      { label: "Saudável e energizado(a)", value: "saudavel" },
      { label: "Livre e leve", value: "livre" },
      { label: "Orgulhoso(a) de mim mesmo(a)", value: "orgulhoso" }
    ],
    progress: 76
  },

  // CARD 41: VISUALIZAÇÃO #2 - MUDANÇAS NA VIDA
  {
    id: 41,
    type: "multiple",
    question: "O que mudará na sua vida quando você emagrecer?",
    subtitle: "Selecione todos que você deseja:",
    options: [
      { label: "Mais confiança nos relacionamentos", value: "relacionamentos" },
      { label: "Melhor desempenho no trabalho", value: "trabalho" },
      { label: "Mais energia para família/amigos", value: "energia" },
      { label: "Novas oportunidades", value: "oportunidades" },
      { label: "Saúde melhorada", value: "saude" },
      { label: "Usar roupas que sempre quis", value: "roupas" },
      { label: "Sentir-me bem em fotos", value: "fotos" }
    ],
    progress: 78
  },

  // CARD 42: EVENTO ESPECÍFICO
  {
    id: 42,
    type: "choice",
    question: "Há algum evento específico que te motiva a perder peso agora?",
    options: [
      { label: "Férias", value: "ferias", icon: "🌴" },
      { label: "Casamento", value: "casamento", icon: "💍" },
      { label: "Perder o peso da gestação", value: "pos-gestacao", icon: "🤰" },
      { label: "Verão", value: "verao", icon: "👙" },
      { label: "Festa de aniversário", value: "aniversario", icon: "🥳" },
      { label: "Reencontro da turma", value: "reencontro", icon: "🎓" },
      { label: "Reunião de família", value: "familia", icon: "🏠" },
      { label: "Evento esportivo", value: "esportivo", icon: "🏅" },
      { label: "Outra ocasião", value: "outro", icon: "😎" },
      { label: "Eu só quero mudar e me sentir o máximo!", value: "sem-evento", icon: "👗" }
    ],
    progress: 79
  },

  // CARD 43: DATA DO EVENTO (PERSONALIZADA)
  {
    id: 43,
    type: "date",
    // A pergunta será personalizada dinamicamente baseada na resposta do card 41
    question: "Quando você quer atingir sua meta?",
    description: "Vamos lembrar disso durante a sua jornada.",
    buttonText: "Avançar",
    progress: 81
  },

  // CARD 44: NÍVEL DE COMPROMISSO
  {
    id: 44,
    type: "choice",
    question: "Você está pronto(a) para começar sua transformação?",
    options: [
      { label: "Sim, estou 100% comprometido(a)!", value: "sim-100" },
      { label: "Sim, mas tenho algumas dúvidas", value: "sim-duvidas" },
      { label: "Ainda estou decidindo", value: "decidindo" }
    ],
    progress: 82
  },

  // CARD 45: ANÁLISE COMPLETA COM IA
  {
    id: 45,
    type: "analysis",
    title: "Analisando seu perfil e criando plano personalizado...",
    analysisSteps: [
      { label: "Analisando perfil e hábitos...", duration: 1000 },
      { label: "Identificando gatilhos emocionais...", duration: 1200 },
      { label: "Personalizando sessões de hipnoterapia...", duration: 1000 },
      { label: "Calculando estimativa de resultados...", duration: 800 },
      { label: "Finalizando seu programa exclusivo...", duration: 800 }
    ],
    autoAdvance: true,
    progress: 84
  },

  // CARD 46: COLETA DE EMAIL
  {
    id: 46,
    type: "input",
    question: "🎉 Seu plano está quase pronto!",
    subtitle: "Para onde podemos enviar seu plano personalizado de hipnoterapia?",
    inputType: "email",
    placeholder: "seu@email.com",
    description: "🔒 Seus dados estão seguros e protegidos",
    buttonText: "VER MEU PLANO PERSONALIZADO",
    progress: 88
  },

  // CARD 47: COLETA DE NOME
  {
    id: 47,
    type: "input",
    question: "Para personalizar ainda mais seu plano...",
    subtitle: "Qual é o seu nome?",
    inputType: "text",
    placeholder: "Nome",
    progress: 90
  },

  // CARD 48: RESULTADO PERSONALIZADO
  {
    id: 48,
    type: "visualization",
    title: "Aqui está seu plano!",
    buttonText: "Ver meu plano completo",
    progress: 91
  },

  // CARD 49: RASPADINHA DE DESCONTO
  {
    id: 49,
    type: "scratch",
    title: "Raspe para revelar seu desconto especial!",
    subtitle: "Queremos que você comece sua jornada com uma agradável surpresa.",
    discountPercent: 50,
    discountText: "no seu Plano de Hipnoterapia para Emagrecimento",
    buttonText: "Continuar",
    progress: 93
  },

  // CARD 50: BENEFÍCIOS DETALHADOS
  {
    id: 50,
    type: "info",
    infoType: "educational",
    title: "Seu Plano de Hipnoterapia Inclui:",
    content: "✅ Sessões de hipnose personalizadas\n   • 30+ sessões de áudio (15-25 min cada)\n\n✅ Reprogramação mental profunda\n   • Técnicas de visualização\n   • Sugestões pós-hipnóticas\n\n✅ Meditações anti-ansiedade\n   • 15+ meditações guiadas\n\n✅ Técnicas de autocontrole\n   • Protocolo de 60 segundos\n\n✅ Acompanhamento de progresso\n   • Gráficos visuais\n   • Celebração de marcos\n\n✅ Comunidade exclusiva\n   • Grupos de apoio\n   • Desafios semanais\n\n✅ Acesso vitalício\n   • Pague uma vez, use para sempre\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n🎁 BÔNUS EXCLUSIVO: Acelerador Mental\n   Protocolo intensivo dos primeiros 7 dias\n   (Valor: R$ 97,00) - GRÁTIS",
    buttonText: "Quero começar agora",
    progress: 94
  },

  // CARD 51: PROVA SOCIAL MASSIVA
  {
    id: 51,
    type: "info",
    infoType: "social-proof",
    title: "Junte-se a 187.432 pessoas que já transformaram suas vidas",
    content: "\"Perdi 14kg em 10 semanas sem dieta! A hipnose ELIMINOU meus desejos por doces. 🙏\"\n⭐⭐⭐⭐⭐ - Mariana Silva, 38\n\n\"11,5kg a menos e zero esforço. Ouço antes de dormir e minha mente faz o resto! 💪\"\n⭐⭐⭐⭐⭐ - João Pereira, 42\n\n\"Depois de 5 dietas falhadas, finalmente funciona! Perdi 9kg e mantive! 😊\"\n⭐⭐⭐⭐⭐ - Ana Costa, 29\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n⭐⭐⭐⭐⭐ 4.9 de 5\nBaseado em 42.891 avaliações verificadas",
    buttonText: "Garantir minha vaga",
    progress: 96
  },

  // CARD 52: OFERTA FINAL
  {
    id: 52,
    type: "info",
    infoType: "social-proof",
    title: "🎁 OFERTA EXCLUSIVA",
    content: "PLANO COMPLETO DE HIPNOTERAPIA\n(Acesso Vitalício)\n\n❌ De: R$ 597,00\n✅ HOJE: R$ 297,00\n   💳 ou 12x de R$ 29,40\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Garantia incondicional de 30 dias\n✅ Acesso imediato ao programa completo\n✅ Suporte dedicado via chat\n🔒 Pagamento 100% seguro e criptografado",
    buttonText: "🚀 COMEÇAR AGORA - R$ 297,00",
    progress: 100
  }
];

export function getQuizV2Question(id: number): QuizV2Question | undefined {
  return quizV2Data.find(q => q.id === id);
}

export function getTotalQuizV2Questions(): number {
  return quizV2Data.length;
}
