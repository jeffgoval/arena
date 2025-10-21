# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arena Dona Santa is a complete sports arena management platform built with Next.js 14, TypeScript, and Supabase. The system manages court reservations, autonomous teams, flexible cost splitting, and public invitations with integrated payment processing.

**Architecture Pattern**: Modular monolith with 3 main modules (CORE, Escolinha, Day Use)

**Current Phase**: Phase 1 - Foundation (migrating from static landing to full application)

## Tech Stack

**Frontend**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui components
- React Query (TanStack Query) for state management
- Zod for validation
- React Hook Form for form handling
- Framer Motion for animations

**Backend**
- Supabase (BaaS)
- PostgreSQL (Supabase managed)
- Supabase Auth (authentication)
- Supabase Storage (file storage)
- Supabase Edge Functions (serverless)

**Integrations**
- Asaas (Brazilian payment gateway - Pix, credit/debit cards, collateral)
- WhatsApp Business API (automated notifications)
- ViaCEP API (Brazilian address autocomplete)
- Resend/SendGrid (email notifications)

**Deploy**
- Cloudflare Pages (hosting)
- CDN automatic (Cloudflare)

## Key Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build application
npm run build

# Start production server
npm start

# Supabase commands (when Supabase CLI installed)
npx supabase start          # Start local Supabase
npx supabase db reset       # Reset database
npx supabase migration new  # Create new migration
```

## Architecture

### Module Structure
The application follows a modular monolith pattern with 3 main modules:

1. **CORE Module (MVP Priority)** - Court reservations and team management
2. **Escolinha Module** - School classes and student management
3. **Day Use Module** - Day use packages and capacity control

### Folder Structure (Modular)

```
app/
├── (auth)/              # Authentication routes (login, register)
├── (dashboard)/         # Protected dashboard routes
│   ├── cliente/         # Client/organizer dashboard
│   └── gestor/          # Manager/admin dashboard
├── (public)/            # Public routes
│   ├── page.tsx         # Landing page (existing)
│   ├── convite/[id]/    # Public invitation acceptance
│   └── reservas/        # Public reservation flow
├── api/                 # API routes
└── layout.tsx

components/
├── ui/                  # shadcn/ui components
├── modules/             # Feature modules
│   ├── core/
│   │   ├── reservas/    # Reservation components
│   │   ├── turmas/      # Team components
│   │   ├── convites/    # Invitation components
│   │   └── rateio/      # Cost splitting components
│   ├── escolinha/       # School module
│   └── dayuse/          # Day use module
├── shared/              # Shared components (Header, Sidebar, etc)
├── layouts/             # Layout components
├── home/                # Landing page sections (existing)
└── landing/             # Landing orchestrator (existing)

lib/
├── supabase/
│   ├── client.ts        # Client-side Supabase
│   ├── server.ts        # Server-side Supabase
│   └── middleware.ts    # Auth middleware
├── validations/         # Zod schemas
├── utils/               # Utility functions (currency, date, cpf)
└── constants.ts

hooks/                   # Custom React hooks
services/                # API services
├── core/                # CORE module services
├── escolinha/           # School module services
├── dayuse/              # Day use module services
└── integrations/        # External integrations (Asaas, WhatsApp, ViaCEP)

types/                   # TypeScript types
└── database.types.ts    # Generated from Supabase

supabase/
├── migrations/          # Database migrations
└── functions/           # Edge Functions
```

### Key Concepts

**1. Autonomous Teams System**
- Teams are independent entities (not tied to specific reservations)
- One client can have multiple teams
- Same team can be reused across multiple reservations
- Members can be marked as "fixed" (always included) or "variable" (optional)
- Teams are linked to reservations in a 1-to-1 relationship (1 reservation = max 1 team)

**2. Flexible Cost Splitting (Rateio)**
- Two modes: Percentage or Fixed Value
- **Percentage Mode**: Each member pays a % of total (must sum to 100%)
- **Fixed Value Mode**: Each member pays a specific R$ amount
  - If total < reservation value: organizer pays difference
  - If total > reservation value: validation error
  - Allows R$ 0.00 for free participants
- Configuration is per-reservation, not per-team

**3. Public Invitations System**
- Invitations don't pre-identify participants
- Organizer defines: # of slots + price per slot
- System generates unique public link
- Anyone with link can accept invitation
- Multiple invitation batches per reservation (different prices)
- Guests who accept get full profile in platform

**4. Guest Profile System**
- Guests who accept invitations get complete profiles
- Can view upcoming games, history, balance
- Can purchase credits in advance
- Credits automatically used for future paid invitations

**5. Financial Flow**
- Organizer can use collateral (pre-authorization on card)
- System debits partially as participants pay
- Game "closes" 2h before (final calculation)
- Organizer pays remaining balance after (team + invitations)

### Database Schema (PostgreSQL via Supabase)

**Core Tables:**
- `users` - Users (organizers, guests, managers)
- `courts` - Sports courts
- `schedules` - Court availability schedule
- `reservations` - Court reservations
- `teams` - Autonomous teams (reusable)
- `team_members` - Team members (fixed/variable)
- `reservation_participants` - Participants per reservation
- `invitations` - Public invitation batches
- `invitation_acceptances` - Invitation accepts
- `payments` - Payment records
- `transactions` - Financial transaction history
- `reviews` - Game reviews
- `referrals` - Referral program

**User Types:**
- `organizer` - Creates reservations and teams
- `guest` - Accepts invitations, gets full profile
- `manager` - Admin access to entire system
- `both` - Can be both organizer and guest

**Reservation Types:**
- `single` - One-time reservation
- `monthly` - Monthly recurring (same time each month)
- `recurring` - Weekly recurring (same time each week)

## Important Business Rules

### Teams (Turmas)
- RN-008: Client can have unlimited teams
- RN-009: Each reservation can have max 1 team linked
- RN-010: Same team can be linked to multiple reservations
- RN-011: Team can be created before, during, or after reservation
- RN-013: Fixed members are auto-included when linking team
- RN-014: Variable members are optional per reservation

### Cost Splitting (Rateio)
- RN-016: Split mode configured per reservation (not per team)
- RN-017: Percentage mode must sum to exactly 100%
- RN-018: Fixed value mode cannot exceed reservation total
- RN-019: If fixed value sum < total, organizer pays difference
- RN-020: Participants can have R$ 0.00 (free)
- RN-022: Rateio can be edited until 2h before game

### Invitations
- RN-024: Invitations are public (don't pre-identify participants)
- RN-025: Same reservation can have multiple invitation batches
- RN-026: Total participants cannot exceed court capacity
- RN-027: Invitations close automatically 2h before game
- RN-030: Guest who accepts invitation gets full platform profile

### Financial
- RN-033: Collateral reserves full amount but charges only confirmed
- RN-040: Game closes 2h before - organizer pays remaining balance
- RN-041: Guest credits auto-used for paid invitations
- RN-043-045: Cancellation policy (24h=100%, 12-24h=50%, <12h=0%)

## Development Guidelines

### TypeScript
- Path alias: `@/*` maps to project root
- Generate types from Supabase: `npx supabase gen types typescript`
- Use Zod schemas for all form validations

### Styling
- Tailwind CSS with shadcn/ui components
- Mobile-first responsive design
- Color palette: Green (primary), Blue (secondary), Orange (accent)
- Dark mode support via class strategy

### State Management
- React Query for server state
- Optimistic updates for better UX
- Cache invalidation on mutations

### Security
- Row Level Security (RLS) on all Supabase tables
- CPF and RG must be unique (RN-049)
- Password hashing with bcrypt (cost 12+)
- JWT authentication with refresh tokens

### Forms
- Use React Hook Form + Zod
- ViaCEP integration for address autocomplete (RN-050)
- Real-time validation feedback
- Clear error messages in Portuguese

## Contact Information
- Phone: (33) 99158-0013
- Location: Governador Valadares, MG
- Email: contato@arenadonasanta.com.br
- Instagram: @arenadonasanta

## Documentation References
- Complete PRD: `SETUP/PRD.md` (2760 lines)
- Implementation prompt: `SETUP/PROMPT.md`
