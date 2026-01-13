/**
 * Employees Resource (Çalışan)
 *
 * Manage employee records.
 */
import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource, JsonApiResponse } from '../generated/types.js';
export interface EmployeeAttributes {
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly balance?: number;
    readonly trl_balance?: number;
    readonly archived?: boolean;
    name: string;
    email?: string;
    tckn?: string;
    iban?: string;
}
export interface Employee extends JsonApiResource<EmployeeAttributes> {
    type: 'employees';
}
export interface EmployeeFilters {
    name?: string;
    email?: string;
}
export declare class EmployeesResource extends BaseResource<Employee, EmployeeAttributes, EmployeeFilters> {
    constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>);
    /**
     * Archives an employee.
     */
    archive(id: string | number): Promise<JsonApiResponse<Employee>>;
    /**
     * Unarchives an employee.
     */
    unarchive(id: string | number): Promise<JsonApiResponse<Employee>>;
}
//# sourceMappingURL=employees.d.ts.map