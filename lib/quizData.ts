export interface QuizQuestion {
  id: number;
  question?: string;
  subtitle?: string;
  type: "choice" | "input" | "range" | "multiple" | "info";
  options?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  placeholder?: string;
  min?: number;
  max?: number;
  unit?: string;
  content?: string; // For info screens
  image?: string; // For info screens
  testimonial?: {
    name: string;
    text: string;
    image?: string;
  };
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual é a sua idade?",
    type: "choice",
    options: [
      { label: "18-30", value: "18-30" },
      { label: "31-40", value: "31-40" },
      { label: "41-50", value: "41-50" },
      { label: "51-60", value: "51-60" },
      { label: "61-70", value: "61-70" },
      { label: "70+", value: "70+" },
    ],
  },
  {
    id: 2,
    type: "info",
    content: "Mais de 500.000 pessoas escolheram o SoulSync",
    image: "social-proof",
  },
  {
    id: 3,
    question: "Por que você quer perder peso?",
    subtitle: "Você pode selecionar quantos quiser.",
    type: "multiple",
    options: [
      { label: "Aumento da autoestima", value: "autoestima" },
      { label: "Melhor aparência", value: "aparencia" },
      { label: "Movimento mais fácil", value: "movimento" },
      { label: "Aumento da longevidade", value: "longevidade" },
      { label: "Evento específico", value: "evento" },
      { label: "Melhor qualidade de vida", value: "qualidade" },
      { label: "Outro", value: "outro" },
      { label: "Nenhum", value: "nenhum" },
    ],
  },
  {
    id: 4,
    question: "A maioria das pessoas tem dificuldade para perder peso. Você sabe por que isso acontece?",
    type: "choice",
    options: [
      { label: "Sim", value: "sim" },
      { label: "De alguma forma", value: "alguma" },
      { label: "Não", value: "nao" },
    ],
  },
  {
    id: 5,
    type: "info",
    content: "A maioria das dietas e exercícios falham a longo prazo, não por falta de esforço, mas porque ignoram a causa raiz: a conexão mente-corpo.\n\nA hipnoterapia funciona mudando sua mentalidade, desbloqueando a motivação, a crença e o controle necessários para criar mudanças reais e duradouras.",
    image: "meditation",
  },
  {
    id: 6,
    question: "Você foi recomendado por um nutricionista?",
    subtitle: "Um número crescente de nutricionistas está recomendando o SoulSync.",
    type: "choice",
    options: [
      { label: "Sim", value: "sim" },
      { label: "Não", value: "nao" },
    ],
  },
  {
    id: 7,
    question: "Sabemos que as razões para o excesso de peso são únicas para cada pessoa. Quais são as suas?",
    subtitle: "Você pode selecionar quantos quiser.",
    type: "multiple",
    options: [
      { label: "Comer emocionalmente", value: "emocional" },
      { label: "Compulsão alimentar", value: "compulsao" },
      { label: "dieta ioiô", value: "ioio" },
      { label: "Problemas digestivos", value: "digestivos" },
      { label: "Falta de força de vontade", value: "vontade" },
      { label: "Não tenho certeza", value: "certeza" },
    ],
  },
  {
    id: 8,
    question: "Há quanto tempo você vem lutando contra problemas de peso?",
    type: "choice",
    options: [
      { label: "0 a 6 meses", value: "0-6" },
      { label: "6 a 12 meses", value: "6-12" },
      { label: "1 - 5 anos", value: "1-5" },
      { label: "5+ anos", value: "5+" },
    ],
  },
  {
    id: 9,
    question: "Quais são as maiores dificuldades físicas que você sente por causa do seu peso?",
    subtitle: "Você pode selecionar quantos quiser.",
    type: "multiple",
    options: [
      { label: "Falta de ar", value: "ar" },
      { label: "Suando mais do que o normal", value: "suando" },
      { label: "Ronco", value: "ronco" },
      { label: "Problemas para dormir", value: "dormir" },
      { label: "Problemas de pele", value: "pele" },
      { label: "Fadiga", value: "fadiga" },
      { label: "Dor nas costas e articulações", value: "dor" },
      { label: "Não tenho certeza", value: "certeza" },
    ],
  },
  {
    id: 10,
    question: "Como esses sintomas afetam sua vida?",
    subtitle: "Você pode selecionar quantos quiser.",
    type: "multiple",
    options: [
      { label: "Fisicamente desconfortável", value: "desconfortavel" },
      { label: "Nervoso(a) para socializar", value: "nervoso" },
      { label: "Preocupado com viagens", value: "viagens" },
      { label: "Luta com o trabalho", value: "trabalho" },
      { label: "Autoestima negativa", value: "autoestima" },
      { label: "Não tenho certeza", value: "certeza" },
    ],
  },
  {
    id: 11,
    type: "info",
    content: "O SoulSync ajuda a gerir a sua relação com a comida, 'corrigindo' a falta de comunicação entre o cérebro e o estômago.\n\nVamos começar por conhecer melhor você para podermos avaliar se o SoulSync também pode te ajudar.",
    image: "brain-stomach",
  },
  {
    id: 12,
    question: "Quais hábitos alimentares você acha que estão dificultando sua perda de peso?",
    subtitle: "Você pode selecionar quantos quiser.",
    type: "multiple",
    options: [
      { label: "Grandes porções", value: "porcoes" },
      { label: "lanches frequentes", value: "lanches" },
      { label: "Alto consumo de açúcar", value: "acucar" },
      { label: "escolhas alimentares pouco saudáveis", value: "escolhas" },
      { label: "Comer emocionalmente", value: "emocional" },
      { label: "Comer demais", value: "demais" },
      { label: "Outro", value: "outro" },
    ],
  },
  {
    id: 13,
    question: "Quais desejos são mais difíceis de resistir para você?",
    subtitle: "Você pode selecionar quantos quiser.",
    type: "multiple",
    options: [
      { label: "Desejos por doces (chocolate, balas, etc.)", value: "doces" },
      { label: "Desejos salgados (batatas fritas, etc.)", value: "salgados" },
      { label: "Desejos por carboidratos (pão, macarrão, etc.)", value: "carboidratos" },
      { label: "Comida rápida", value: "rapida" },
      { label: "Desejos emocionais (estresse, tédio)", value: "emocionais" },
      { label: "Outro", value: "outro" },
      { label: "Nenhum", value: "nenhum" },
    ],
  },
  {
    id: 14,
    type: "info",
    content: "O ganho de peso vai além da força de vontade. Para muitos, o verdadeiro problema é a desconexão entre o cérebro e o corpo — uma falha de comunicação que confunde fome, desejo e saciedade.\n\nA falta de comunicação entre o estômago e o cérebro é um fator significativo no desenvolvimento do excesso de peso. Compreender e restabelecer essa conexão é fundamental para a perda de peso duradoura e para a melhoria da saúde física e mental.",
    image: "brain-intestine",
  },
  {
    id: 15,
    question: "Qual é o seu nível típico de atividade física?",
    type: "choice",
    options: [
      { label: "Não sou muito ativo – passo a maior parte do tempo sentado ou relaxando.", value: "baixo" },
      { label: "Sou relativamente ativo – me movimento de vez em quando.", value: "relativo" },
      { label: "Eu me mantenho ativo – malho ou caminho algumas vezes por semana.", value: "ativo" },
      { label: "Sou bastante ativo: estou me movimentando ou me exercitando na maioria dos dias.", value: "muito" },
      { label: "Sou super ativo – estou sempre fazendo algo físico.", value: "super" },
    ],
  },
  {
    id: 16,
    question: "Imagine-se daqui a 6 semanas, como você gostaria de se sentir?",
    subtitle: "Você pode selecionar quantos quiser.",
    type: "multiple",
    options: [
      { label: "Fisicamente confortável", value: "confortavel" },
      { label: "Tenho meu peso sob controle.", value: "controle" },
      { label: "Mais saudável no meu corpo", value: "saudavel" },
      { label: "Confiante em mim mesma", value: "confiante" },
      { label: "Não tenho certeza", value: "certeza" },
    ],
  },
  {
    id: 17,
    question: "Insira suas medidas",
    type: "input",
    placeholder: "Altura, Peso, Peso desejado",
  },
  {
    id: 18,
    type: "info",
    content: "A maioria das soluções para perda de peso não tem como alvo a causa real do excesso de peso, como a falta de comunicação entre o cérebro e o estômago.\n\nA hipnoterapia é diferente.\n\nDe acordo com estudos clínicos, a hipnoterapia demonstra ser eficaz para abordar e resolver esse problema de comunicação.",
    image: "weight-journey-graph",
  },
  {
    id: 19,
    question: "O que você gostaria de fazer se estivesse no peso desejado?",
    subtitle: "Você pode selecionar quantos quiser.",
    type: "multiple",
    options: [
      { label: "Aproveitar a vida social/relacionamentos", value: "social" },
      { label: "Durma melhor", value: "dormir" },
      { label: "Viaje com confiança", value: "viajar" },
      { label: "Praticar meu esporte favorito", value: "esporte" },
      { label: "Esteja mais presente no trabalho.", value: "trabalho" },
      { label: "Não tenho certeza", value: "certeza" },
    ],
  },
  {
    id: 20,
    question: "Quanto tempo você poderia dedicar diariamente para lidar com seus problemas de perda de peso?",
    type: "choice",
    options: [
      { label: "15 minutos", value: "15" },
      { label: "15-30 minutos", value: "15-30" },
      { label: "30-60 minutos", value: "30-60" },
      { label: "Mais de 1 hora", value: "60+" },
    ],
  },
  {
    id: 21,
    type: "info",
    content: "O SoulSync pode ajudar você a controlar seu peso em apenas 15 minutos por dia. Você receberá um programa de hipnoterapia personalizado, elaborado por nossa equipe de hipnoterapeutas experientes, para melhorar sua relação com a comida e ajudá-lo a atingir o peso desejado.",
    testimonial: {
      name: "Renia Reenpää",
      text: "Hipnoterapeuta clínica treinado pela ICH e coach de vida certificado, com foco em técnicas de estado de espírito e PNL.",
    },
  },
];

export const getTotalSteps = () => quizQuestions.length + 2; // +2 for email and results
