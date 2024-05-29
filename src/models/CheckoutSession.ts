/** Checkout Session representing a user's session as they pay for a one-time purchase of carbon credits. */
export interface CheckoutSession {
    id: string;
    amount_kg: number;
    price_usd_cents: number;
    success_url: string;
    cancel_url: string;
    checkout_url: string;
    state: CheckoutSessionStatus;
    expires_on: string;
    completed_on: string;
    portfolio_id: string;
    subaccount_id?: string;
    order_description?: string;
    order_webhook_url?: string;
}

export type CheckoutSessionStatus = 'open' | 'complete' | 'expired';
