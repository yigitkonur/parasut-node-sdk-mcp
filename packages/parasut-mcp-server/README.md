# @yigitkonur/parasut-mcp-server

[![npm version](https://img.shields.io/npm/v/@yigitkonur/parasut-mcp-server.svg)](https://www.npmjs.com/package/@yigitkonur/parasut-mcp-server)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **UNOFFICIAL** MCP (Model Context Protocol) Server for the [Paraşüt](https://www.parasut.com/) API.
>
> **Not affiliated with Paraşüt.** This is a community-maintained project.

Use Claude AI to manage your Turkish accounting - invoices, contacts, products, e-fatura, and financial operations through natural conversation.

## Features

- **34 AI-Optimized Tools** - Intent-first design, not 1:1 API mapping
- **Confirmation Patterns** - Preview mode before executing financial operations
- **Double Confirmation** - Extra safety for irreversible e-invoice submissions to GİB
- **Smart Responses** - Every response includes next-step guidance
- **Error Recovery** - Helpful error messages with fix instructions
- **Turkish E-Invoicing** - Full support for e-Fatura, e-Arşiv, e-SMM

## Installation

### Global Install (Recommended)

```bash
pnpm add -g @yigitkonur/parasut-mcp-server
```

### Or use with npx

```bash
npx @yigitkonur/parasut-mcp-server
```

## Configuration

### Environment Variables

```bash
# Required
PARASUT_COMPANY_ID=123456
PARASUT_CLIENT_ID=your-client-id
PARASUT_CLIENT_SECRET=your-client-secret
PARASUT_USERNAME=your-username
PARASUT_PASSWORD=your-password

# Optional
PARASUT_BASE_URL=https://api.parasut.com/v4
DEBUG=true
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Claude Code

Add to your MCP settings:

```json
{
  "mcpServers": {
    "parasut": {
      "command": "npx",
      "args": ["@yigitkonur/parasut-mcp-server"],
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

## Available Tools (34 total)

### Contacts (4 tools)

| Tool | Description |
|------|-------------|
| `search_contacts` | Search customers/suppliers by name, email, or tax number |
| `get_contact` | Get detailed contact information with balance |
| `create_contact` | Create a new customer or supplier |
| `update_contact` | Update contact information |

### Sales Invoices (7 tools)

| Tool | Description |
|------|-------------|
| `search_invoices` | Search invoices by customer, date, or status |
| `get_invoice` | Get invoice details with line items and payments |
| `create_invoice` | Create a new sales invoice (requires confirmation) |
| `cancel_invoice` | Cancel an invoice (requires confirmation) |
| `recover_invoice` | Recover a cancelled invoice |
| `invoice_pdf` | Generate PDF for an invoice |
| `record_invoice_payment` | Record payment received (requires confirmation) |

### Purchase Bills (4 tools)

| Tool | Description |
|------|-------------|
| `search_bills` | Search purchase bills/expenses |
| `get_bill` | Get bill details |
| `create_bill` | Create a new purchase bill (requires confirmation) |
| `record_bill_payment` | Record payment to supplier (requires confirmation) |

### Products (4 tools)

| Tool | Description |
|------|-------------|
| `search_products` | Search products and services |
| `get_product` | Get product details with inventory |
| `create_product` | Create a new product |
| `update_product` | Update product information |

### E-Documents (4 tools)

| Tool | Description |
|------|-------------|
| `check_einvoice_inbox` | Check if contact is e-invoice registered |
| `send_einvoice` | Send invoice as e-Fatura (DOUBLE confirmation - irreversible!) |
| `send_earchive` | Send invoice as e-Arşiv (DOUBLE confirmation - irreversible!) |
| `send_esmm` | Send invoice as e-SMM (DOUBLE confirmation - irreversible!) |

### Financial (4 tools)

| Tool | Description |
|------|-------------|
| `list_accounts` | List bank/cash accounts with balances |
| `search_transactions` | Search financial transactions |
| `create_bank_fee` | Record a bank fee (requires confirmation) |
| `get_financial_summary` | Get receivables/payables overview |

### Inventory (2 tools)

| Tool | Description |
|------|-------------|
| `get_stock_levels` | Get current inventory levels |
| `search_stock_movements` | Search stock movement history |

### Organization (5 tools)

| Tool | Description |
|------|-------------|
| `list_categories` | List item categories |
| `list_tags` | List tags for organization |
| `list_employees` | List employees |
| `create_salary` | Record salary payment (requires confirmation) |
| `create_tax` | Record tax payment (requires confirmation) |

## Safety Features

### Confirmation Pattern

Financial operations require explicit confirmation:

```
User: Create an invoice for 5000 TL to Acme Corp

Claude: I'll create this invoice. Here's the preview:
- Customer: Acme Corp
- Amount: 5000 TL
- Net: 5000 TL, VAT: 1000 TL, Total: 6000 TL

⚠️ Call again with confirm=true to proceed.

User: Yes, confirm it

Claude: [Executes with confirm=true]
✅ Invoice #INV-2024-001 created successfully.
```

### Double Confirmation for E-Documents

E-invoices submitted to GİB (Turkish Tax Authority) are **irreversible**:

```
User: Send invoice #123 as e-fatura

Claude: ⚠️🚨 IRREVERSIBLE OPERATION 🚨⚠️

This will submit to GİB (Tax Authority) and CANNOT be undone!

To proceed, you must:
1. Set confirm=true
2. Set i_understand_this_is_irreversible="YES"

User: I understand, proceed with both confirmations

Claude: [Executes with both confirmations]
✅ E-invoice submitted to GİB successfully.
```

## Example Conversations

### Create and Send Invoice

```
User: Create an invoice for 10,000 TL consulting services to ABC Company,
      then send it as e-fatura

Claude: I'll help you with that. Let me:
1. Search for ABC Company
2. Create the invoice
3. Check if they're e-invoice registered
4. Send as e-fatura

[Executes step by step with confirmations]
```

### Financial Overview

```
User: What's our current financial position?

Claude: [Uses get_financial_summary]

Financial Summary:
- Receivables: 125,000 TL (15 open invoices)
- Payables: 45,000 TL (8 open bills)
- Net Position: +80,000 TL

Bank Accounts:
- İş Bankası: 50,000 TL
- Garanti: 32,000 TL
```

### Record Payments

```
User: Record that ABC Company paid 5000 TL for invoice #456

Claude: [Uses record_invoice_payment with preview]

Preview:
- Invoice: #456
- Customer: ABC Company
- Current remaining: 10,000 TL
- Payment: 5,000 TL
- New remaining: 5,000 TL

⚠️ Confirm to proceed...
```

## Design Philosophy

1. **Task-Shaped Tools** - Tools designed around user tasks, not API endpoints
2. **Under 40 Tools** - Well under the cognitive limit for AI tool selection
3. **Guided Responses** - Every response includes relevant next steps
4. **Error Recovery** - Errors explain what went wrong and how to fix it
5. **Safety First** - Confirmation patterns prevent accidental financial changes

## Development

```bash
# Clone the repository
git clone https://github.com/yigitkonur/mcp-parasut.git
cd mcp-parasut

# Install dependencies
pnpm install
# Build
pnpm build:mcp

# Run locally
pnpm start --workspace=@yigitkonur/parasut-mcp-server

# Type check
pnpm typecheck
```

## Disclaimer

**This is an UNOFFICIAL project.**

- Not affiliated with, endorsed by, or connected to Paraşüt
- Paraşüt is a trademark of Paraşüt Bilgi Teknolojileri A.Ş.
- Use at your own risk
- E-documents submitted to GİB are legally binding and irreversible

## License

MIT © [Yigit Konur](https://github.com/yigitkonur)

## Links

- [GitHub Repository](https://github.com/yigitkonur/mcp-parasut)
- [SDK Package](https://www.npmjs.com/package/@yigitkonur/parasut-node-sdk)
- [Paraşüt API Documentation](https://apidocs.parasut.com/)
- [MCP Protocol](https://modelcontextprotocol.io/)
