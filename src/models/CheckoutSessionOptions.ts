import type { NotificationConfig } from './NotificationConfig.js';

export interface CheckoutSessionOptions {
    amount_kg: number;
    success_url: string;
    cancel_url: string;
    portfolio_id?: string;
    description?: string;
    notification_config?: NotificationConfig;
}
