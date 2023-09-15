import { NotificationConfig } from './NotificationConfig';

export interface BaseOrderOptions {
    metadata?: string;
    description?: string;
    notification_config?: NotificationConfig;
    portfolio_id?: string;
}

