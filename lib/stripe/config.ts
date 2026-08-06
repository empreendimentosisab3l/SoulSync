export const TRIAL_DAYS = 3;
export const CURRENCY = 'brl' as const;
export const ACCESS_FEE_AMOUNT = 490;      // R$ 4,90 em centavos
export const SUBSCRIPTION_AMOUNT = 3990;   // R$ 39,90 em centavos

export function getStripePriceIds(): { accessFee: string; subscription: string } {
  const accessFee = process.env.STRIPE_PRICE_ACCESS_FEE;
  const subscription = process.env.STRIPE_PRICE_SUBSCRIPTION;
  if (!accessFee || !subscription) {
    throw new Error('STRIPE_PRICE_ACCESS_FEE e STRIPE_PRICE_SUBSCRIPTION devem estar configuradas');
  }
  return { accessFee, subscription };
}
