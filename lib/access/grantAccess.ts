import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendAccessEmail } from '@/lib/email/sendAccessEmail';

export async function grantAccess(input: { email: string; name: string; planType: string }): Promise<void> {
  const { email, name, planType } = input;
  const token = crypto.randomBytes(32).toString('hex');

  await prisma.user.upsert({
    where: { email },
    update: { status: 'active', name: name || undefined },
    create: {
      email,
      name: name || email.split('@')[0],
      status: 'active',
      plan: 'standard',
      password: '',
    },
  });

  const result = await sendAccessEmail({ token, email, name: name || email.split('@')[0], planType });
  if (!result.success) {
    console.error('⚠️ Acesso concedido, mas falha ao enviar email:', result.error);
  }
}
