export interface UpsellCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  features: string[];
  benefits: {
    title: string;
    description: string;
  }[];
  testimonials: {
    name: string;
    avatar: string;
    text: string;
    rating: number;
  }[];
  checkoutUrl: string;
}

export const upsellCourses: Record<string, UpsellCourse> = {
  'autoestima': {
    id: 'autoestima',
    title: 'Sessão de hipnoterapia para autoestima',
    subtitle: 'Especializado para melhorar',
    description: 'Essa sessão ajuda você a desenvolver uma poderosa autoestima, aumentar sua confiança interna e alcançar seu potencial pessoal de autoestima.',
    price: 80.39,
    originalPrice: 160.99,
    image: '/images/autoestima.jpg',
    features: [
      'Criar uma autoimagem positiva',
      'Melhorar seus relacionamentos',
      'Foco nítido, ação resolutiva',
      'Reduza o Fator',
    ],
    benefits: [
      {
        title: 'Criar uma autoimagem positiva',
        description: 'Receba sessões guiadas por um hipnoterapeuta certificado, que utilizam técnicas comprovadas para aumentar sua autoestima.',
      },
      {
        title: 'Melhorar seus relacionamentos',
        description: 'Obtenha acesso vitalício ao material do curso. Repita as sessões sempre que precisar, em qualquer lugar do mundo, sem custos adicionais.',
      },
      {
        title: 'Foco nítido, ação resolutiva',
        description: 'Não há necessidade de viajar ou ter sessões presenciais. Ouça suas sessões no conforto de sua casa ou em qualquer lugar tranquilo.',
      },
      {
        title: 'Suporte Exclusivo',
        description: 'Acesse o suporte dedicado da equipe do cliente pronto para ajudá-lo quando você precisar. Estamos aqui para a sua jornada e mais tranquila e benéfica possível.',
      },
    ],
    testimonials: [
      {
        name: 'Amanda S.',
        avatar: '👩',
        text: 'This is by far one of my favorite courses! I absolutely adore these audio tracks, They helped me realize that my eating habits were more than just my willpower. I continue to listening to the audio daily.',
        rating: 5,
      },
      {
        name: 'Patricia L.',
        avatar: '👱‍♀️',
        text: 'Estou me sentindo e notoriamente autoconfiante! Já é quase sem que eu perceba que não vejo minha imagem de forma errônea como antes. Ainda estou ouvindo todos os dias, sinto que tenho paixão no que estou procurando.',
        rating: 5,
      },
    ],
    checkoutUrl: 'https://lastlink.com/p/autoestima/checkout-payment',
  },
  'sono': {
    id: 'sono',
    title: 'Sessão de hipnoterapia para distúrbios do sono',
    subtitle: 'Especializado para distúrbios do sono',
    description: 'Uma sessão de hipnoterapia desenhada para ajudar você a dormir melhor através de técnicas de relaxamento e reprogramação do sono profundas e restauradoras com hábitos de sono saudáveis.',
    price: 80.00,
    originalPrice: 160.00,
    image: '/images/sono.jpg',
    features: [
      'Criar uma especialidades',
      'Técnicas comprovadas',
      'Obtenha acesso vitalício',
      'Suporte exclusivo',
    ],
    benefits: [
      {
        title: 'Técnicas comprovadas',
        description: 'Receba sessões guiadas por hipnoterapeuta certificado, usando técnicas cientificamente comprovadas para superar o sono de qualidade e seus hábitos ruins.',
      },
      {
        title: 'Obtenha acesso vitalício',
        description: 'Não há dependência de viajar ou ter sessões presenciais. Ouça algo inovador no conforto da sua casa, mas se não quiserem, os níveis vão iguais ao que de fato vão ao tratamento.',
      },
      {
        title: 'Suporte exclusivo',
        description: 'Acesse o suporte dedicado da equipe do cliente pronto para ajudá-lo quando você precisar. Estamos aqui para a sua jornada e mais tranquila e benéfica possível.',
      },
    ],
    testimonials: [
      {
        name: 'Mark Williams',
        avatar: '👨',
        text: 'I\'ve been free to say that this gave me that really boost my mind once I had my whole life, but feeling like I couldn\'t figure out how to work through my thoughts. This course helped me find things away and I\'m sleeping so soundly!',
        rating: 5,
      },
      {
        name: 'Jane Smith',
        avatar: '👩',
        text: 'Where before I used to lay awake, thinking of all the day\'s and week\'s stresses, now when I lay down to turn in for the night, I use the techniques from this course and before I know it I\'m waking up to a new day.',
        rating: 5,
      },
      {
        name: 'Robert L.',
        avatar: '👴',
        text: 'I can not tell you how had years of things to help me to be able to have more energy and not feel and look so tired. This course has helped me do both and believe if I change it\'s an incredible feeling to wake up feeling good!',
        rating: 5,
      },
      {
        name: 'Whitney Rose',
        avatar: '👱‍♀️',
        text: 'I did not believe hypnotherapy, but it truly helped so much. I loved how I felt after using it and believe if I charge it\'s something outside to notice the feeling about.',
        rating: 5,
      },
    ],
    checkoutUrl: 'https://lastlink.com/p/sono/checkout-payment',
  },
  'fitness': {
    id: 'fitness',
    title: 'Liberte o seu potencial de condicionamento físico',
    subtitle: 'Especializado para motivação fitness',
    description: 'Aumente sua motivação para atividades físicas e mude suas crenças sobre o exercício com essa sessão de hipnoterapia. Ajuda a construir hábitos de exercícios.',
    price: 80.39,
    originalPrice: 160.99,
    image: '/images/fitness.jpg',
    features: [
      'Criar uma especialidades',
      'Técnicas comprovadas',
      'Foco nítido, ação resolutiva',
      'Reduza o Fator',
    ],
    benefits: [
      {
        title: 'Criar uma especialidades',
        description: 'Receba sessões guiadas por hipnoterapeuta certificado que utilizam técnicas comprovadas para aumentar a motivação e disciplina.',
      },
      {
        title: 'Acesso Flexível',
        description: 'Obtenha acesso vitalício ao material do curso. Repita as sessões sempre que precisar em qualquer lugar do mundo, sem custos adicionais.',
      },
      {
        title: 'Foco nítido, ação resolutiva',
        description: 'Não há necessidade de viajar ou ter sessões presenciais. Ouça suas sessões no conforto de sua casa ou em qualquer lugar tranquilo.',
      },
      {
        title: 'Suporte Exclusivo',
        description: 'Acesse o suporte dedicado da equipe do cliente pronto para ajudá-lo quando você precisar. Estamos aqui para a sua jornada e mais tranquila e benéfica possível.',
      },
    ],
    testimonials: [
      {
        name: 'Amanda S.',
        avatar: '👩',
        text: 'This is by far one of my favorite courses! I absolutely adore these audio tracks. They helped me realize that my eating habits were more than just my willpower.',
        rating: 5,
      },
      {
        name: 'Patricia L.',
        avatar: '👱‍♀️',
        text: 'Eu tenho ouvido a sessão por meses, mas não vejo minha imagem de forma errônea como antes. Tenho paixão para continuar com o treino.',
        rating: 5,
      },
    ],
    checkoutUrl: 'https://lastlink.com/p/fitness/checkout-payment',
  },
  'acucar': {
    id: 'acucar',
    title: 'Sessão de hipnoterapia para desintoxicação de açúcar',
    subtitle: 'Especializado para vícios em açúcar',
    description: 'Liberte-se do vício em açúcar com hipnoterapia guiada que reprograma seus desejos e estabelece padrões alimentares saudáveis.',
    price: 80.39,
    originalPrice: 160.99,
    image: '/images/acucar.jpg',
    features: [
      'Reduzir desejos por açúcar',
      'Técnicas comprovadas',
      'Acesso vitalício',
      'Suporte exclusivo',
    ],
    benefits: [
      {
        title: 'Reduzir desejos por açúcar',
        description: 'Reprograme sua mente para reduzir naturalmente os desejos por doces e açúcar.',
      },
      {
        title: 'Técnicas comprovadas',
        description: 'Sessões guiadas por hipnoterapeuta certificado usando métodos comprovados.',
      },
      {
        title: 'Acesso vitalício',
        description: 'Acesso ilimitado ao conteúdo, repita sempre que necessário.',
      },
      {
        title: 'Suporte Exclusivo',
        description: 'Equipe dedicada pronta para ajudar em sua jornada.',
      },
    ],
    testimonials: [
      {
        name: 'Sarah M.',
        avatar: '👩',
        text: 'Incrível! Consegui parar de comer doces todos os dias. Agora tenho controle sobre meus desejos.',
        rating: 5,
      },
    ],
    checkoutUrl: 'https://lastlink.com/p/acucar/checkout-payment',
  },
  'financeira': {
    id: 'financeira',
    title: 'A fórmula da liberdade financeira',
    subtitle: 'Especializado para mentalidade financeira',
    description: 'Transforme sua relação com dinheiro e desbloqueie sua abundância financeira através de hipnoterapia focada em crenças limitantes.',
    price: 80.39,
    originalPrice: 160.99,
    image: '/images/financeira.jpg',
    features: [
      'Mudar crenças sobre dinheiro',
      'Aumentar prosperidade',
      'Técnicas comprovadas',
      'Acesso vitalício',
    ],
    benefits: [
      {
        title: 'Mudar crenças sobre dinheiro',
        description: 'Reprograme crenças limitantes sobre dinheiro e abundância.',
      },
      {
        title: 'Aumentar prosperidade',
        description: 'Desenvolva uma mentalidade de prosperidade e atração de riqueza.',
      },
      {
        title: 'Técnicas comprovadas',
        description: 'Métodos testados por hipnoterapeutas certificados.',
      },
      {
        title: 'Suporte Exclusivo',
        description: 'Equipe dedicada para apoiar sua transformação financeira.',
      },
    ],
    testimonials: [
      {
        name: 'Carlos R.',
        avatar: '👨',
        text: 'Minha relação com dinheiro mudou completamente. Agora vejo oportunidades em vez de limitações.',
        rating: 5,
      },
    ],
    checkoutUrl: 'https://lastlink.com/p/financeira/checkout-payment',
  },
  'procrastinacao': {
    id: 'procrastinacao',
    title: 'Para de procrastinar',
    subtitle: 'Especializado para produtividade',
    description: 'Elimine a procrastinação e aumente sua produtividade com sessões de hipnoterapia focadas em ação e motivação.',
    price: 80.39,
    originalPrice: 160.99,
    image: '/images/procrastinacao.jpg',
    features: [
      'Eliminar procrastinação',
      'Aumentar produtividade',
      'Técnicas de foco',
      'Acesso vitalício',
    ],
    benefits: [
      {
        title: 'Eliminar procrastinação',
        description: 'Reprograme padrões mentais que causam procrastinação.',
      },
      {
        title: 'Aumentar produtividade',
        description: 'Desenvolva hábitos de ação imediata e consistência.',
      },
      {
        title: 'Técnicas de foco',
        description: 'Aprenda a manter foco e concentração em suas tarefas.',
      },
      {
        title: 'Suporte Exclusivo',
        description: 'Equipe dedicada para apoiar sua jornada de produtividade.',
      },
    ],
    testimonials: [
      {
        name: 'João P.',
        avatar: '👨',
        text: 'Consegui finalmente terminar projetos que estava adiando há meses. Recomendo!',
        rating: 5,
      },
    ],
    checkoutUrl: 'https://lastlink.com/p/procrastinacao/checkout-payment',
  },
  'relaxamento': {
    id: 'relaxamento',
    title: 'Sessão de hipnoterapia para relaxamento profundo',
    subtitle: 'Especializado para alívio de estresse',
    description: 'Alcance estados profundos de relaxamento e reduza o estresse diário com técnicas avançadas de hipnoterapia.',
    price: 80.39,
    originalPrice: 160.99,
    image: '/images/relaxamento.jpg',
    features: [
      'Relaxamento profundo',
      'Reduzir estresse',
      'Técnicas de respiração',
      'Acesso vitalício',
    ],
    benefits: [
      {
        title: 'Relaxamento profundo',
        description: 'Alcance estados de relaxamento que você nunca experimentou antes.',
      },
      {
        title: 'Reduzir estresse',
        description: 'Diminua significativamente seus níveis de estresse e ansiedade.',
      },
      {
        title: 'Técnicas de respiração',
        description: 'Aprenda técnicas de respiração para relaxamento imediato.',
      },
      {
        title: 'Suporte Exclusivo',
        description: 'Equipe dedicada para apoiar sua jornada de bem-estar.',
      },
    ],
    testimonials: [
      {
        name: 'Maria L.',
        avatar: '👩',
        text: 'Nunca consegui relaxar tão profundamente. Minha ansiedade diminuiu muito!',
        rating: 5,
      },
    ],
    checkoutUrl: 'https://lastlink.com/p/relaxamento/checkout-payment',
  },
  'adhd': {
    id: 'adhd',
    title: 'Programa de gerenciamento de TDAH',
    subtitle: 'Especializado para TDAH',
    description: 'Desenvolva foco, organização e controle com sessões especializadas para gerenciamento de TDAH através de hipnoterapia.',
    price: 80.39,
    originalPrice: 160.99,
    image: '/images/adhd.jpg',
    features: [
      'Melhorar foco',
      'Aumentar organização',
      'Controlar impulsos',
      'Acesso vitalício',
    ],
    benefits: [
      {
        title: 'Melhorar foco',
        description: 'Desenvolva capacidade de concentração e atenção sustentada.',
      },
      {
        title: 'Aumentar organização',
        description: 'Crie hábitos organizacionais e de planejamento efetivos.',
      },
      {
        title: 'Controlar impulsos',
        description: 'Aprenda técnicas para melhor controle de impulsos e reações.',
      },
      {
        title: 'Suporte Exclusivo',
        description: 'Equipe especializada em TDAH pronta para ajudar.',
      },
    ],
    testimonials: [
      {
        name: 'Pedro S.',
        avatar: '👨',
        text: 'Finalmente consigo me concentrar nas tarefas. Minha vida profissional melhorou muito!',
        rating: 5,
      },
    ],
    checkoutUrl: 'https://lastlink.com/p/adhd/checkout-payment',
  },
};
