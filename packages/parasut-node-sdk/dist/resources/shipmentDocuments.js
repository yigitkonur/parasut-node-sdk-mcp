/**
 * Shipment Documents Resource (İrsaliye)
 *
 * Manage shipment/delivery documents.
 */
import { BaseResource } from './BaseResource.js';
export class ShipmentDocumentsResource extends BaseResource {
    constructor(config) {
        super({
            ...config,
            basePath: '/shipment_documents',
            resourceType: 'shipment_documents',
        });
    }
}
//# sourceMappingURL=shipmentDocuments.js.map