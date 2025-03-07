import type { Portfolio } from './Portfolio.js';
import type { PortfolioCategoryAllocation } from './PortfolioCategoryAllocation.js';

export interface PortfolioWithCategoryAllocations extends Portfolio {
    checkout_price_per_kg_usd_cents: number;
    api_price_per_kg_usd_cents: number;
    category_allocations: PortfolioCategoryAllocation[];
}
