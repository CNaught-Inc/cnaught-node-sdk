import type { CreditIssuance } from './CreditIssuance.js';
import type { Project } from './Project.js';

export interface ProjectWithCreditIssuances extends Project {
    credit_issuances: CreditIssuance[];
}