/**
 * Transactions Resource (İşlem)
 *
 * Manage financial transactions.
 */
import { BaseResource } from './BaseResource.js';
export class TransactionsResource extends BaseResource {
    constructor(config) {
        super({
            ...config,
            basePath: '/transactions',
            resourceType: 'transactions',
        });
    }
}
//# sourceMappingURL=transactions.js.map