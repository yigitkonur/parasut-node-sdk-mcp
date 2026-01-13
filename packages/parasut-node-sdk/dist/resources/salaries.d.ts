/**
 * Salaries Resource (Maaş)
 *
 * Manage salary records.
 */
import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource, JsonApiResponse } from '../generated/types.js';
export interface SalaryAttributes {
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly total_paid?: number;
    readonly archived?: boolean;
    readonly remaining?: number;
    description: string;
    issue_date: string;
    due_date: string;
    net_total: number;
}
export interface Salary extends JsonApiResource<SalaryAttributes> {
    type: 'salaries';
}
export interface SalaryFilters {
    issue_date?: string;
    due_date?: string;
    employee_id?: number;
}
export declare class SalariesResource extends BaseResource<Salary, SalaryAttributes, SalaryFilters> {
    constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>);
    archive(id: string | number): Promise<JsonApiResponse<Salary>>;
    unarchive(id: string | number): Promise<JsonApiResponse<Salary>>;
    pay(id: string | number, payload: {
        data: {
            type: 'payments';
            attributes: {
                date: string;
                amount: number;
                notes?: string;
            };
            relationships?: {
                account?: {
                    data: {
                        id: string;
                        type: 'accounts';
                    };
                };
            };
        };
    }): Promise<JsonApiResponse<JsonApiResource>>;
}
//# sourceMappingURL=salaries.d.ts.map