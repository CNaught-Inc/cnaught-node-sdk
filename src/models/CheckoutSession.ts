/** Checkout Session representing a user's session as they pay for a one-time purchase of carbon credits. */
export interface CheckoutSession {
    id: string;
    checkout_url: string;
    status: CheckoutSessionStatus;
    amount_kg: number;
    price_usd_cents: number;
}

export type CheckoutSessionStatus = 'open' | 'complete' | 'expired';