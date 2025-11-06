import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface AccessData {
  token: string;
  email: string;
  name: string;
  planType: string;
}

export async function sendAccessEmail(accessData: AccessData) {
  try {
    const accessLink = `${process.env.NEXT_PUBLIC_BASE_URL}/membros?token=${accessData.token}`;

    const { data, error } = await resend.emails.send({
      from: 'SoulSync <onboarding@resend.dev>', // Você vai trocar por seu domínio
      to: accessData.email,
      subject: '🎉 Bem-vindo ao SoulSync - Seu Acesso Está Liberado!',
      html: getEmailTemplate(accessData.name, accessLink, accessData.planType),
    });

    if (error) {
      console.error('❌ Erro ao enviar email:', error);
      return { success: false, error };
    }

    console.log('✅ Email enviado com sucesso para:', accessData.email);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error };
  }
}

function getEmailTemplate(name: string, accessLink: string, planType: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao SoulSync</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #9B8BC4 0%, #5B4B8A 100%); padding: 40px 20px;">

  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">

    <!-- Header com gradiente -->
    <div style="background: linear-gradient(135deg, #E8C4B8 0%, #D4A5A5 50%, #9B8BC4 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        🌟 SoulSync
      </h1>
      <p style="margin: 10px 0 0 0; color: white; font-size: 16px; opacity: 0.95;">
        Reprograme sua mente. Renasça em leveza.
      </p>
    </div>

    <!-- Conteúdo -->
    <div style="padding: 40px 30px;">

      <h2 style="color: #5B4B8A; font-size: 24px; margin: 0 0 20px 0;">
        Olá, ${name}! 👋
      </h2>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Parabéns por dar esse passo transformador em sua jornada! 🎉
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        Seu acesso ao <strong>SoulSync</strong> foi liberado com sucesso. Agora você tem acesso completo às <strong>8 sessões de hipnoterapia</strong> que vão te ajudar a reprogramar sua mente e alcançar seus objetivos de emagrecimento.
      </p>

      <!-- Plano escolhido -->
      <div style="background: linear-gradient(135deg, #F5F3ED 0%, #E8E4DC 100%); border-left: 4px solid #9B8BC4; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <p style="margin: 0; color: #5B4B8A; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
          Seu Plano
        </p>
        <p style="margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: bold;">
          ${planType}
        </p>
      </div>

      <!-- Botão de acesso -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="${accessLink}" style="display: inline-block; background: linear-gradient(135deg, #5B4B8A 0%, #9B8BC4 100%); color: white; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(91, 75, 138, 0.4); transition: transform 0.2s;">
          🚀 ACESSAR ÁREA DE MEMBROS
        </a>
      </div>

      <!-- Instruções -->
      <div style="background: #f8f9fa; border-radius: 10px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #5B4B8A; font-size: 18px; margin: 0 0 15px 0;">
          📚 Como Aproveitar ao Máximo:
        </h3>
        <ul style="color: #555; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Ouça <strong>1 sessão por dia</strong>, preferencialmente no mesmo horário</li>
          <li>Escolha um local tranquilo e sem interrupções</li>
          <li>Use fones de ouvido para melhor experiência</li>
          <li>Mantenha-se consistente para melhores resultados</li>
          <li>Acompanhe seu progresso no dashboard</li>
        </ul>
      </div>

      <!-- Sessões disponíveis -->
      <div style="margin: 30px 0;">
        <h3 style="color: #5B4B8A; font-size: 18px; margin: 0 0 20px 0;">
          🎧 Suas Sessões:
        </h3>
        <div style="display: grid; gap: 10px;">
          <div style="padding: 12px; background: white; border: 1px solid #E8E4DC; border-radius: 8px; font-size: 14px; color: #333;">
            ✨ <strong>Dia 1:</strong> Introdução à Hipnoterapia
          </div>
          <div style="padding: 12px; background: white; border: 1px solid #E8E4DC; border-radius: 8px; font-size: 14px; color: #333;">
            🥗 <strong>Dia 2:</strong> Reprogramando Sua Relação com a Comida
          </div>
          <div style="padding: 12px; background: white; border: 1px solid #E8E4DC; border-radius: 8px; font-size: 14px; color: #333;">
            💚 <strong>Dia 3:</strong> Liberando Bloqueios Emocionais
          </div>
          <div style="padding: 12px; background: white; border: 1px solid #E8E4DC; border-radius: 8px; font-size: 14px; color: #333;">
            🎯 <strong>Dia 4:</strong> Aumentando Motivação e Disciplina
          </div>
          <div style="padding: 12px; background: white; border: 1px solid #E8E4DC; border-radius: 8px; font-size: 14px; color: #333;">
            🧘 <strong>Dia 5:</strong> Controle da Ansiedade e Estresse
          </div>
          <div style="padding: 12px; background: white; border: 1px solid #E8E4DC; border-radius: 8px; font-size: 14px; color: #333;">
            ✨ <strong>Dia 6:</strong> Visualização do Seu Corpo Ideal
          </div>
          <div style="padding: 12px; background: white; border: 1px solid #E8E4DC; border-radius: 8px; font-size: 14px; color: #333;">
            😴 <strong>Dia 7:</strong> Sono Profundo e Regenerador
          </div>
          <div style="padding: 12px; background: white; border: 1px solid #E8E4DC; border-radius: 8px; font-size: 14px; color: #333;">
            💖 <strong>Dia 8:</strong> Autoestima e Amor Próprio
          </div>
        </div>
      </div>

      <!-- Suporte -->
      <div style="background: linear-gradient(135deg, #E8C4B8 0%, #D4A5A5 100%); border-radius: 10px; padding: 25px; margin: 30px 0; text-align: center;">
        <h3 style="color: white; font-size: 18px; margin: 0 0 10px 0;">
          💬 Precisa de Ajuda?
        </h3>
        <p style="color: white; font-size: 14px; margin: 0; opacity: 0.95;">
          Nossa equipe está disponível 24/7 para te apoiar nessa jornada
        </p>
      </div>

      <!-- Footer mensagem -->
      <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
        Estamos muito felizes em ter você conosco! ✨<br>
        Prepare-se para uma transformação incrível.
      </p>

    </div>

    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #E8E4DC;">
      <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.5;">
        Este é um email automático. Por favor, não responda.<br>
        © 2025 SoulSync. Todos os direitos reservados.
      </p>
    </div>

  </div>

  <!-- Espaçamento inferior -->
  <div style="height: 40px;"></div>

</body>
</html>
  `;
}
