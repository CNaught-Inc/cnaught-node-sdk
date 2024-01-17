import type { Portfolio } from './Portfolio.js';
import type { PortfolioCategoryAllocation } from './PortfolioCategoryAllocation.js';

export interface PortfolioWithCategoryAllocations extends Portfolio {
    category_allocations: PortfolioCategoryAllocation[];
}
