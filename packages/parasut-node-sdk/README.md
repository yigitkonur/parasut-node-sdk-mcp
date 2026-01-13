# @yigitkonur/parasut-node-sdk

[![npm version](https://img.shields.io/npm/v/@yigitkonur/parasut-node-sdk.svg)](https://www.npmjs.com/package/@yigitkonur/parasut-node-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **UNOFFICIAL** Type-safe TypeScript SDK for the [Paraşüt](https://www.parasut.com/) API v4.
>
> **Not affiliated with Paraşüt.** This is a community-maintained project.

## Features

- **100% Type-Safe** - Full TypeScript with maximum strict mode
- **Resource Tree Pattern** - Intuitive `client.contacts.list()` API
- **OAuth with Auto-Refresh** - Handles token management automatically
- **Pagination Helpers** - Async iterators for seamless pagination
- **Rate Limiting** - Built-in token bucket rate limiter (10 req/10s)
- **Retry Logic** - Automatic retry with exponential backoff
- **Zero Dependencies** - Uses native `fetch` (Node.js 18+)

## Installation

```bash
npm install @yigitkonur/parasut-node-sdk
```

**Requirements:** Node.js 18+ (uses native fetch)

## Quick Start

```typescript
import { ParasutClient } from '@yigitkonur/parasut-node-sdk';

const client = new ParasutClient({
  companyId: 123456,
  credentials: {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    username: 'your-username',
    password: 'your-password',
  },
});

// List contacts with filtering
const { data: contacts, meta } = await client.contacts.list({
  filter: { name: 'Acme' },
  page: { number: 1, size: 25 },
});

console.log(`Found ${meta.total_count} contacts`);
```

## Authentication

### OAuth Credentials (Recommended)

```typescript
const client = new ParasutClient({
  companyId: 123456,
  credentials: {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    username: 'your-username',
    password: 'your-password',
  },
});
```

The SDK automatically:
- Obtains an access token on first request
- Refreshes the token before it expires
- Retries with a new token if a request returns 401

### Static Access Token

For testing or when managing tokens yourself:

```typescript
const client = new ParasutClient({
  companyId: 123456,
  accessToken: 'your-access-token',
});
```

### Custom Token Storage

```typescript
import { ParasutClient, TokenStorage, OAuthToken } from '@yigitkonur/parasut-node-sdk';

class RedisTokenStorage implements TokenStorage {
  async get(): Promise<OAuthToken | null> {
    const data = await redis.get('parasut_token');
    return data ? JSON.parse(data) : null;
  }

  async set(token: OAuthToken): Promise<void> {
    await redis.set('parasut_token', JSON.stringify(token));
  }

  async clear(): Promise<void> {
    await redis.del('parasut_token');
  }
}

const client = new ParasutClient({
  companyId: 123456,
  credentials: { /* ... */ },
  tokenStorage: new RedisTokenStorage(),
});
```

## Configuration

```typescript
const client = new ParasutClient({
  // Required
  companyId: 123456,

  // Authentication (one required)
  credentials: { clientId, clientSecret, username, password },
  // OR
  accessToken: 'static-token',

  // Optional
  baseUrl: 'https://api.parasut.com/v4',  // Default
  timeout: 30000,                          // Request timeout (ms)
  tokenStorage: customStorage,             // Custom token persistence

  // Rate limiting (default: enabled)
  rateLimit: {
    enabled: true,
    requestsPerWindow: 10,
    windowMs: 10000,
  },

  // Retry (default: enabled)
  retry: {
    enabled: true,
    maxRetries: 3,
    initialDelayMs: 100,
    maxDelayMs: 10000,
  },
});
```

## Resources

| Resource | Accessor | Description |
|----------|----------|-------------|
| Accounts | `client.accounts` | Cash and bank accounts |
| Contacts | `client.contacts` | Customers and suppliers |
| Products | `client.products` | Goods and services |
| Sales Invoices | `client.salesInvoices` | Sales invoices |
| Sales Offers | `client.salesOffers` | Quotes and proposals |
| Purchase Bills | `client.purchaseBills` | Supplier invoices/expenses |
| E-Archives | `client.eArchives` | E-archive documents |
| E-Invoices | `client.eInvoices` | E-invoice documents |
| E-Invoice Inboxes | `client.eInvoiceInboxes` | E-invoice recipient lookup |
| E-SMMs | `client.eSmms` | Freelancer receipts |
| Bank Fees | `client.bankFees` | Bank charges |
| Salaries | `client.salaries` | Employee salaries |
| Taxes | `client.taxes` | Tax records |
| Employees | `client.employees` | Employee records |
| Inventory Levels | `client.inventoryLevels` | Stock levels |
| Stock Movements | `client.stockMovements` | Stock history |
| Tags | `client.tags` | Labels for organizing |
| Item Categories | `client.itemCategories` | Product/expense categories |
| Transactions | `client.transactions` | Financial transactions |

## CRUD Operations

### List Resources

```typescript
// Basic list
const { data, meta } = await client.contacts.list();

// With filtering
const { data } = await client.contacts.list({
  filter: { name: 'Acme', account_type: 'customer' },
});

// With pagination
const { data, meta } = await client.contacts.list({
  page: { number: 2, size: 25 },
});

// With sorting
const { data } = await client.contacts.list({
  sort: '-created_at',  // Prefix with - for descending
});

// With included relationships
const { data, included } = await client.salesInvoices.list({
  include: ['contact', 'details', 'payments'],
});
```

### Get Single Resource

```typescript
const { data: contact } = await client.contacts.get(123);

// With relationships
const { data: invoice, included } = await client.salesInvoices.get(456, {
  include: ['contact', 'details', 'payments'],
});
```

### Create Resource

```typescript
const { data: newContact } = await client.contacts.create({
  data: {
    type: 'contacts',
    attributes: {
      name: 'Acme Corporation',
      email: 'info@acme.com',
      account_type: 'customer',
      tax_number: '1234567890',
    },
  },
});
```

### Update Resource

```typescript
const { data: updated } = await client.contacts.update(123, {
  data: {
    id: '123',
    type: 'contacts',
    attributes: { email: 'new-email@acme.com' },
  },
});
```

### Delete Resource

```typescript
await client.contacts.delete(123);
```

## Pagination

### Async Iterator (Recommended)

```typescript
// Iterate all contacts
for await (const contact of client.contacts.iterate()) {
  console.log(contact.attributes.name);
}

// With options
for await (const invoice of client.salesInvoices.iterate({
  pageSize: 25,
  maxPages: 10,
  filter: { invoice_status: 'open' },
})) {
  await processInvoice(invoice);
}
```

### Get All Resources

```typescript
const allContacts = await client.contacts.listAll();
console.log(`Total: ${allContacts.length} contacts`);
```

### Helper Methods

```typescript
const count = await client.contacts.count();
const exists = await client.contacts.exists(123);
const first = await client.contacts.first({ filter: { account_type: 'customer' } });
```

## Special Operations

### Archive/Unarchive

```typescript
await client.salesInvoices.archive(invoiceId);
await client.salesInvoices.unarchive(invoiceId);
```

### Cancel/Recover

```typescript
await client.salesInvoices.cancel(invoiceId);
await client.salesInvoices.recover(invoiceId);
```

### Payments

```typescript
await client.salesInvoices.pay(invoiceId, {
  data: {
    type: 'payments',
    attributes: {
      amount: 1000.00,
      date: '2024-01-15',
    },
    relationships: {
      account: { data: { id: '1', type: 'accounts' } },
    },
  },
});
```

## E-Documents

E-documents are created asynchronously:

```typescript
// Submit and wait for completion
const { data: eArchive } = await client.eArchives.submitAndWait({
  data: {
    type: 'e_archives',
    relationships: {
      sales_invoice: { data: { id: '123', type: 'sales_invoices' } },
    },
  },
});

// Get PDF URL
const { url, expiresAt } = await client.eArchives.pdf(eArchiveId);
```

## Error Handling

```typescript
import {
  ParasutApiError,
  ParasutAuthError,
  ParasutNotFoundError,
  ParasutValidationError,
  ParasutRateLimitError,
  ParasutNetworkError,
} from '@yigitkonur/parasut-node-sdk';

try {
  await client.contacts.get(999999);
} catch (error) {
  if (error instanceof ParasutNotFoundError) {
    console.log('Contact not found');
  } else if (error instanceof ParasutValidationError) {
    console.log('Validation errors:', error.errors);
  } else if (error instanceof ParasutAuthError) {
    console.log('Authentication failed');
  } else if (error instanceof ParasutRateLimitError) {
    console.log('Rate limited, retry after:', error.retryAfterMs);
  }
}
```

## TypeScript Types

```typescript
import type {
  Contact,
  ContactAttributes,
  ContactFilters,
  SalesInvoice,
  SalesInvoiceAttributes,
  Product,
  ProductAttributes,
} from '@yigitkonur/parasut-node-sdk';

function processContact(contact: Contact) {
  const attrs: ContactAttributes = contact.attributes;
  console.log(attrs.name, attrs.email);
}
```

## Disclaimer

**This is an UNOFFICIAL project.**

- Not affiliated with, endorsed by, or connected to Paraşüt
- Paraşüt is a trademark of Paraşüt Bilgi Teknolojileri A.Ş.
- Use at your own risk

## License

MIT © [Yigit Konur](https://github.com/yigitkonur)

## Links

- [GitHub Repository](https://github.com/yigitkonur/parasut-node-sdk-mcp)
- [Paraşüt API Documentation](https://apidocs.parasut.com/)
- [MCP Server Package](https://www.npmjs.com/package/@yigitkonur/parasut-mcp-server)
