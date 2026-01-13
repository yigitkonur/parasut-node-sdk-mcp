/**
 * Inventory Tools
 *
 * Tools for stock levels and inventory tracking.
 */
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatList } from '../utils/response.js';
import { handleError } from '../utils/errors.js';
// ============================================================================
// Schemas
// ============================================================================
const GetStockLevelsSchema = z.object({
    product_id: z.string().optional().describe('Filter by product ID'),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(100),
});
const SearchStockMovementsSchema = z.object({
    product_id: z.string().optional().describe('Filter by product ID'),
    date_start: z.string().optional().describe('Start date'),
    date_end: z.string().optional().describe('End date'),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(100),
});
// ============================================================================
// Tool Definitions
// ============================================================================
export const inventoryTools = [
    {
        name: 'get_stock_levels',
        description: `
<usecase>
Get current stock levels for products.
Use when: Checking inventory quantities, verifying stock before invoicing.
Do NOT use when: Looking for stock history (use search_stock_movements instead).
</usecase>

<example>
get_stock_levels()
get_stock_levels(product_id="12345")
</example>

<returns>
Stock levels with: id, stock_count per warehouse.
</returns>
    `.trim(),
        inputSchema: {
            type: 'object',
            properties: {
                product_id: { type: 'string', description: 'Filter by product ID' },
                page: { type: 'number', default: 1 },
                limit: { type: 'number', default: 100 },
            },
        },
    },
    {
        name: 'search_stock_movements',
        description: `
<usecase>
Search for stock movement history.
Use when: Viewing inbound/outbound inventory changes, tracking stock history.
Do NOT use when: Just checking current levels (use get_stock_levels instead).
</usecase>

<example>
search_stock_movements(product_id="12345")
search_stock_movements(date_start="2024-01-01")
</example>

<returns>
List of stock movements showing quantity changes and timestamps.
</returns>
    `.trim(),
        inputSchema: {
            type: 'object',
            properties: {
                product_id: { type: 'string', description: 'Filter by product ID' },
                date_start: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                date_end: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                page: { type: 'number', default: 1 },
                limit: { type: 'number', default: 100 },
            },
        },
    },
];
// ============================================================================
// Handlers
// ============================================================================
export async function handleGetStockLevels(args) {
    try {
        const params = GetStockLevelsSchema.parse(args);
        const client = getClient();
        const filter = {};
        if (params.product_id)
            filter['product_id'] = params.product_id;
        const response = await client.inventoryLevels.list({
            filter,
            page: { number: params.page, size: params.limit },
            include: ['product', 'warehouse'],
        });
        const levels = response.data.map((level) => ({
            id: level.id,
            stock_count: level.attributes.stock_count,
            // Relationships would be in included
        }));
        return formatList(levels, {
            totalCount: response.meta.total_count,
            currentPage: response.meta.current_page,
            totalPages: response.meta.total_pages,
        }, {
            nextSteps: [
                { action: 'View movement history', example: 'search_stock_movements(product_id="<id>")' },
            ],
        });
    }
    catch (error) {
        return handleError(error, { operation: 'Get stock levels' });
    }
}
export async function handleSearchStockMovements(args) {
    try {
        const params = SearchStockMovementsSchema.parse(args);
        const client = getClient();
        const filter = {};
        if (params.product_id)
            filter['product_id'] = params.product_id;
        if (params.date_start)
            filter['date'] = params.date_start;
        const response = await client.stockMovements.list({
            filter,
            page: { number: params.page, size: params.limit },
        });
        return formatList(response.data, {
            totalCount: response.meta.total_count,
            currentPage: response.meta.current_page,
            totalPages: response.meta.total_pages,
        });
    }
    catch (error) {
        return handleError(error, { operation: 'Search stock movements' });
    }
}
//# sourceMappingURL=inventory.js.map