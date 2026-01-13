/**
 * Shipment Documents Resource (İrsaliye)
 *
 * Manage shipment/delivery documents.
 */

import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource } from '../generated/types.js';

export interface ShipmentDocumentAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  document_no?: string;
  document_date?: string;
  description?: string;
  shipment_type?: 'inbound' | 'outbound' | 'transfer';
}

export interface ShipmentDocument extends JsonApiResource<ShipmentDocumentAttributes> {
  type: 'shipment_documents';
}

export interface ShipmentDocumentFilters {
  document_date?: string;
  shipment_type?: 'inbound' | 'outbound' | 'transfer';
}

export class ShipmentDocumentsResource extends BaseResource<
  ShipmentDocument,
  ShipmentDocumentAttributes,
  ShipmentDocumentFilters
> {
  constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>) {
    super({
      ...config,
      basePath: '/shipment_documents',
      resourceType: 'shipment_documents',
    });
  }
}
