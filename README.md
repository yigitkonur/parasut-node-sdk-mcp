# Paraşüt Node.js SDK & MCP Server

[![npm version](https://img.shields.io/npm/v/@yigitkonur/parasut-node-sdk.svg)](https://www.npmjs.com/package/@yigitkonur/parasut-node-sdk)
[![npm version](https://img.shields.io/npm/v/@yigitkonur/parasut-mcp-server.svg)](https://www.npmjs.com/package/@yigitkonur/parasut-mcp-server)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **UNOFFICIAL** TypeScript SDK and MCP (Model Context Protocol) Server for the [Paraşüt](https://www.parasut.com/) API v4.
>
> **This project is not affiliated with, endorsed by, or connected to Paraşüt in any way.**

A monorepo containing two packages for Turkish accounting and e-invoicing:

| Package | Description | Install |
|---------|-------------|---------|
| **[@yigitkonur/parasut-node-sdk](./packages/parasut-node-sdk)** | Type-safe TypeScript SDK | `npm i @yigitkonur/parasut-node-sdk` |
| **[@yigitkonur/parasut-mcp-server](./packages/parasut-mcp-server)** | MCP Server for Claude AI | `npm i -g @yigitkonur/parasut-mcp-server` |

## Features

### SDK Features

- **100% Type-Safe** - Full TypeScript with maximum strict mode
- **Complete API Coverage** - All Paraşüt v4 endpoints
- **OAuth 2.0** - Automatic token refresh
- **Rate Limiting** - Built-in token bucket (10 req/10s)
- **Retry Logic** - Exponential backoff for transient errors
- **Zero Dependencies** - Uses native `fetch` (Node.js 18+)
- **JSON:API Compliant** - Proper request/response handling

### MCP Server Features

- **34 AI-Optimized Tools** - Intent-first design, not 1:1 API mapping
- **Confirmation Patterns** - Preview mode for financial operations
- **Double Confirmation** - Extra safety for irreversible e-document submissions
- **Smart Responses** - Next-step guidance and recovery instructions
- **Turkish E-Invoicing** - e-Fatura, e-Arşiv, e-SMM support

## Quick Start

### SDK Usage

```bash
npm install @yigitkonur/parasut-node-sdk
```

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

// List all customers
const { data: contacts } = await client.contacts.list({
  filter: { account_type: 'customer' },
});

// Create an invoice
const { data: invoice } = await client.salesInvoices.create({
  data: {
    type: 'sales_invoices',
    attributes: {
      item_type: 'invoice',
      issue_date: '2024-01-15',
      currency: 'TRL',
    },
    relationships: {
      contact: { data: { id: '12345', type: 'contacts' } },
    },
  },
});
```

### MCP Server Usage

```bash
npm install -g @yigitkonur/parasut-mcp-server
```

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "parasut": {
      "command": "parasut-mcp",
      "env": {
        "PARASUT_COMPANY_ID": "123456",
        "PARASUT_CLIENT_ID": "your-client-id",
        "PARASUT_CLIENT_SECRET": "your-client-secret",
        "PARASUT_USERNAME": "your-username",
        "PARASUT_PASSWORD": "your-password"
      }
    }
  }
}
```

Then ask Claude:

> "Show me all unpaid invoices from this month"
>
> "Create an invoice for 5000 TL consulting services to Acme Corp"
>
> "Send invoice #1234 as e-fatura"

## Supported Operations

| Category | Operations |
|----------|------------|
| **Contacts** | Search, create, update customers/suppliers |
| **Sales Invoices** | Create, cancel, recover, record payments, generate PDF |
| **Purchase Bills** | Create expenses, record supplier payments |
| **Products** | Manage products and services catalog |
| **E-Documents** | e-Fatura, e-Arşiv, e-SMM (with double confirmation) |
| **Financial** | Accounts, transactions, bank fees |
| **Inventory** | Stock levels and movements |
| **Organization** | Categories, tags, employees, salaries, taxes |

## TypeScript Strictness

Both packages use maximum TypeScript strictness:

```
strict: true
exactOptionalPropertyTypes: true
noUncheckedIndexedAccess: true
noPropertyAccessFromIndexSignature: true
noImplicitOverride: true
+ 15 more strict checks
```

## Requirements

- **Node.js** >= 18.0.0
- **Paraşüt API Credentials** (OAuth 2.0)

## Getting API Credentials

1. Log in to [Paraşüt](https://app.parasut.com)
2. Go to **Settings → API → Applications**
3. Create a new application
4. Note your **Client ID** and **Client Secret**
5. Your **Company ID** is in the URL: `app.parasut.com/{COMPANY_ID}/...`

## Development

```bash
# Clone
git clone https://github.com/yigitkonur/parasut-node-sdk-mcp.git
cd parasut-node-sdk-mcp

# Install
npm install

# Build all
npm run build

# Type check
npm run typecheck
```

## Disclaimer

**This is an UNOFFICIAL project.**

- Not affiliated with, endorsed by, or connected to Paraşüt
- Paraşüt is a trademark of Paraşüt Bilgi Teknolojileri A.Ş.
- Use at your own risk
- The maintainers are not responsible for any issues arising from use

## License

MIT © [Yigit Konur](https://github.com/yigitkonur)

## Links

- [Paraşüt API Documentation](https://apidocs.parasut.com/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Report Issues](https://github.com/yigitkonur/parasut-node-sdk-mcp/issues)
