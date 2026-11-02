# ARKAI Hospitality AI — REST API

Independent demonstration backend for the Agentplace Full-Stack Engineer assessment.

Stack: Next.js Route Handlers, TypeScript, Neon PostgreSQL. No real hotel or booking system is connected. Rates and inventory are synthetic demonstration records.

## Endpoints

- `GET /api/health` — service health (does not check database).
- `GET /api/rooms` — hotel room catalogue.
- `GET /api/availability?checkIn=2027-01-10&checkOut=2027-01-13&adults=2&children=0&rooms=1` — room inventory and illustrative estimates.
- `POST /api/quote` with JSON `{ "roomId": "ocean-view-suite", "checkIn": "2027-01-10", "checkOut": "2027-01-13", "adults": 2, "children": 0, "rooms": 1 }` — illustrative subtotal; taxes/fees and final total intentionally omitted until business rules are defined.

Responses contain `demo: true`; no endpoint makes a booking. Inventory is reduced by overlapping rows in `bookings` but is not locked or reserved. This is a demonstration, not a production booking engine.

## Setup

1. Create a **separate** Neon project and configure `DATABASE_URL` privately in Vercel (Production and Preview). Never commit it.
2. Run `db/001_initial.sql` in the **dedicated demonstration database only**, after verifying the Neon project and database identity.
3. Install dependencies with `npm install`, then run `npm run build` and `npm test`.
4. Link the dedicated Vercel project and deploy. Check `/api/health`, `/api/rooms`, availability and quote with live HTTP requests.

## Next steps

Connect Agentplace's server-side tool to the deployed HTTPS endpoints and independently verify real tool invocations. Add API authentication/rate limiting, proper occupancy rules, taxes/fees, audit logs and OpenAPI documentation before any production use.
