# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Arena Dona Santa** is a comprehensive sports arena reservation platform for Governador Valadares, Brazil. The project has **transitioned from Phase 1 (landing page) to Phase 2 (full application)** with Supabase authentication, dashboard pages, and the CORE module implementation underway.

### Current Status (Phase 2 - Active Development)

**Implemented Features:**
- Landing page with modular components (Hero, Infrastructure, Academia do Galo, Day Use, etc.)
- Supabase authentication system with SSR
- Route-based authentication middleware with role-based caching
- Dashboard layouts for Cliente (Customer) and Gestor (Manager)
- Courts (Quadras) management with schedules and blocks
- Teams (Turmas) management
- Reservations (Reservas) system with cost-sharing (rateio) and invitations
- Public invitation acceptance flow
- Referral system (Indicações)
- Monthly members (Mensalistas) management
- Payment integration structure (Asaas)
- WhatsApp notifications service
- Evaluation/review system (Avaliações)
- shadcn/ui component library integration
- React Query (TanStack Query) for data fetching
- Zod validation schemas
- Custom form components (CPF, CEP, WhatsApp)

**Architecture:**
- Next.js 15 App Router with SSR (no longer static export)
- TypeScript with strict typing
- Modular component architecture
- Service layer pattern with React Query hooks
- Row Level Security (RLS) on Supabase

### Tech Stack

**Core Technologies:**
- Next.js 15 (App Router, SSR/SSG)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- React Query (TanStack Query v5)
- Zod validation
- React Hook Form
- shadcn/ui components
- Lucide React icons
- date-fns (date utilities)
- Axios (HTTP client)

**Active Integrations:**
- Asaas payment gateway
- WhatsApp Business API
- ViaCEP (Brazilian postal code API)

**Deployment:**
- Platform: Vercel
- Region: São Paulo (gru1) - optimized for Brazil
- Node.js version: 20 (configured via `.node-version`)
- SSR enabled (no static export)

**Development Environment:**
- Primary OS: Windows (commands optimized for Windows)
- Alternative support: Unix/macOS (cross-platform compatible)
- Package manager: npm (not yarn or pnpm)

## Development Commands

### Essential Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Supabase Commands

**IMPORTANT:** Supabase is configured but migrations are managed manually. The `supabase/migrations` directory exists but may not contain all schema definitions. The database schema is maintained remotely.

```bash
# Check Supabase status
supabase status

# Pull remote schema (if needed)
supabase db pull

# Generate TypeScript types from database
npx supabase gen types typescript --linked > src/types/database.types.ts

# Execute SQL on remote database
supabase db execute --file path/to/file.sql

# Create new migration (use carefully)
supabase migration new <migration_name>
```

### Adding shadcn/ui Components

```bash
# Add specific component
npx shadcn@latest add <component-name>

# Example: add dialog
npx shadcn@latest add dialog
```

### Debugging with Node Scripts

The `scripts/` directory contains 40+ utilities for debugging and testing. Key scripts include:

**Authentication & Users:**
```bash
node scripts/test-signup.mjs              # Test auth signup flow
node scripts/check-auth-role.mjs          # Check user role assignments
node scripts/check-users-schema.mjs       # Verify users table schema
node scripts/check-all-user-columns.mjs   # Check all user table columns
```

**Database Schema:**
```bash
node scripts/check-db-structure.mjs       # Comprehensive schema check
node scripts/list-all-tables.mjs          # List all database tables
node scripts/check-table-schema.mjs       # Verify specific table structure
node scripts/check-table-columns.mjs      # Check table columns
node scripts/refresh-schema-cache.mjs     # Refresh Supabase schema cache
```

**Migrations:**
```bash
node scripts/apply-security-migration.mjs # Apply security updates
node scripts/check-migration.mjs          # Verify migration status
node scripts/exec-sql-direct.mjs          # Execute SQL directly
node scripts/apply-rls-fix.mjs            # Apply RLS policy fixes
```

**Environment & Deployment:**
```bash
node scripts/check-vercel-env.mjs         # Check Vercel environment variables
node scripts/check-vercel-env.mjs --fix   # Fix Vercel environment variables
node scripts/test-supabase-keys.mjs       # Test Supabase connection
```

**Feature-Specific:**
```bash
node scripts/check-creditos-table.mjs     # Verify credits system
node scripts/test-asaas-integration.mjs   # Test payment integration
node scripts/test-convites-now.mjs        # Test invitations system
node scripts/check-aceites-schema.mjs     # Check invitation acceptance schema
```

**Note:** All scripts use ESM modules (.mjs) and connect directly to Supabase. See `docs/README-SCRIPTS.md` for complete documentation.

## Architecture Overview

### Directory Structure

```
arena-dona-santa/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                    # Auth route group
│   │   │   ├── auth/page.tsx          # Unified auth page (login/register tabs)
│   │   │   └── layout.tsx             # Auth layout
│   │   ├── (dashboard)/               # Protected route group
│   │   │   ├── cliente/               # Customer dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── reservas/          # Reservations module
│   │   │   │   ├── turmas/            # Teams module
│   │   │   │   ├── convites/          # Invitations
│   │   │   │   ├── creditos/          # Credits management
│   │   │   │   ├── indicacoes/        # Referrals
│   │   │   │   └── jogos/             # Games history
│   │   │   ├── gestor/                # Manager dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── quadras/           # Courts management
│   │   │   │   └── metricas/          # Metrics dashboard
│   │   │   └── layout.tsx             # Dashboard layout
│   │   ├── (cliente)/                 # Cliente-specific public routes
│   │   │   ├── avaliar/[reservaId]/   # Review reservation
│   │   │   └── convites/              # View invitation details
│   │   ├── (gestor)/                  # Gestor-specific routes
│   │   │   └── gestor/                # Manager features (agenda, avaliacoes)
│   │   ├── (public)/                  # Public route group
│   │   │   ├── convite/[token]/       # Invitation acceptance
│   │   │   └── layout.tsx             # Public layout
│   │   ├── api/                       # API routes
│   │   │   ├── auth/                  # Auth endpoints
│   │   │   ├── reservas/              # Reservation endpoints
│   │   │   ├── convites/              # Invitation endpoints
│   │   │   ├── avaliacoes/            # Review endpoints
│   │   │   ├── indicacoes/            # Referral endpoints
│   │   │   ├── creditos/              # Credits endpoints
│   │   │   ├── jogos/                 # Games endpoints
│   │   │   ├── pagamentos/            # Payment webhooks
│   │   │   ├── whatsapp/              # WhatsApp webhooks
│   │   │   ├── webhooks/              # External webhooks
│   │   │   └── notificacoes/          # Notification endpoints
│   │   ├── design-system/             # Component showcase page
│   │   ├── page.tsx                   # Landing page
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── landing/                   # Landing page components
│   │   ├── modules/                   # Feature-specific components
│   │   │   ├── core/                  # Core business logic components
│   │   │   ├── indicacoes/            # Referral components
│   │   │   └── [other modules]/       # Other feature modules
│   │   ├── shared/                    # Shared/reusable components
│   │   │   ├── forms/                 # Form inputs (CPF, CEP, WhatsApp)
│   │   │   └── loading/               # Loading skeletons
│   │   ├── reservas/                  # Reservation components
│   │   ├── convites/                  # Invitation components
│   │   ├── auth/                      # Auth-specific components
│   │   ├── admin/                     # Admin components
│   │   └── providers/                 # React context providers
│   ├── hooks/
│   │   ├── auth/                      # Auth hooks (useUser)
│   │   ├── core/                      # Business hooks with React Query
│   │   │   ├── useTurmas.ts           # Teams management
│   │   │   ├── useQuadras.ts          # Courts management
│   │   │   ├── useHorarios.ts         # Court schedules
│   │   │   ├── useReservas.ts         # Reservations (customer)
│   │   │   ├── useConvites.ts         # Invitations
│   │   │   ├── useReservasGestor.ts   # Reservations (manager)
│   │   │   ├── useQuadrasHorarios.ts  # Combined courts/schedules
│   │   │   ├── useMetricasGestor.ts   # Manager metrics
│   │   │   ├── useAvaliacoes.ts       # Reviews/ratings
│   │   │   ├── useCreditos.ts         # Credits system
│   │   │   ├── useIndicacoes.ts       # Referrals
│   │   │   ├── useJogos.ts            # Games history
│   │   │   └── useCourts.ts           # Courts (alternative)
│   │   ├── useConvitesPendentes.ts    # Pending invitations polling
│   │   ├── useIndicacoes.ts           # Referrals tracking
│   │   ├── useDebounce.ts             # Debounce utility hook
│   │   ├── useErrorHandler.ts         # Centralized error handling
│   │   └── use-toast.ts               # Toast notifications
│   ├── lib/
│   │   ├── supabase/                  # Supabase clients
│   │   │   ├── client.ts              # Client-side Supabase
│   │   │   └── server.ts              # Server-side Supabase
│   │   ├── validations/               # Zod schemas
│   │   ├── utils/                     # Utility functions
│   │   │   ├── cpf.ts                 # CPF validation/formatting
│   │   │   ├── phone.ts               # WhatsApp formatting
│   │   │   └── cep.ts                 # CEP validation
│   │   └── utils.ts                   # cn() helper
│   ├── services/
│   │   ├── core/
│   │   │   └── courts.service.ts      # Courts CRUD operations
│   │   ├── auth/
│   │   │   └── auth.service.ts        # Authentication service
│   │   ├── integrations/              # External integrations
│   │   │   └── viacep.ts              # CEP lookup service
│   │   ├── indicacoes.service.ts      # Referral service
│   │   ├── indicacoes-mock.service.ts # Mock data for referrals
│   │   ├── mensalistas.service.ts     # Monthly members service
│   │   ├── pagamentoService.ts        # Payment service (Asaas)
│   │   ├── whatsappService.ts         # WhatsApp notifications
│   │   └── notificacaoService.ts      # General notifications
│   ├── types/
│   │   ├── *.types.ts                 # TypeScript type definitions
│   │   ├── creditos.types.ts          # Credits types
│   │   └── database.types.ts          # Generated Supabase types (if exists)
│   └── constants/                     # Application constants
├── middleware.ts                      # Auth middleware (route protection)
├── scripts/                           # Debugging and utility scripts
│   ├── test-signup.mjs                # Test auth signup flow
│   ├── check-db-schema.mjs            # Verify database schema
│   ├── check-user-role.mjs            # Check role assignments
│   ├── check-rls-policies.mjs         # Verify RLS policies
│   └── apply-migration.mjs            # Manual migration helper
├── public/                            # Static assets
├── supabase/                          # Supabase config
│   ├── config.toml                    # Supabase configuration
│   └── migrations/                    # Database migrations (partial)
├── docs/                              # Project documentation
│   ├── *_AUDIT.md                     # Module audits
│   ├── *_IMPROVEMENTS.md              # Improvement tracking
│   ├── AUTH_SUPABASE.md               # Auth setup guide
│   ├── PLANEJAMENTO.md                # Development planning
│   └── PROGRESSO.md                   # Progress tracking
├── SETUP/                             # Setup guides and specifications
│   ├── PRD.md                         # Product Requirements (Portuguese)
│   └── PROMPT.md                      # Technical specs (Portuguese)
├── vercel.json                        # Vercel deployment config
├── next.config.js                     # Next.js configuration
├── .env.example                       # Environment variables template
└── CLAUDE.md                          # This file
```

### Key Architecture Patterns

**Service Layer Pattern:**
- Services in `src/services/` handle all Supabase interactions
- Services export object with methods (e.g., `courtsService.getAll()`)
- Services are called by React Query hooks, not directly by components

**React Query Hook Pattern:**
- Hooks in `src/hooks/core/` wrap services with React Query
- Query hooks return `useQuery()` results
- Mutation hooks return `useMutation()` with automatic cache invalidation
- Hooks handle toast notifications for success/error states

**Example Flow:**
```
Component → Hook (useCreateCourt) → Service (courtsService.create) → Supabase
```

**Route Groups:**
- `(auth)` - Authentication pages (login/register)
- `(dashboard)` - Protected pages requiring authentication (both cliente and gestor)
- `(cliente)` - Cliente-specific routes (reviews, invitation details)
- `(gestor)` - Gestor-specific routes (agenda, manager features)
- `(public)` - Public pages (invitation acceptance, landing)

**Authentication:**
- Middleware protects `/cliente/*` and `/gestor/*` routes
- Redirects unauthenticated users to `/auth`
- **Important:** Authenticated users are redirected from `/` (landing) and `/auth` based on role
  - Admin/Gestor → `/gestor`
  - Cliente → `/cliente`
- Uses Supabase SSR with cookie-based sessions

## Critical Implementation Details

### Authentication System

**Middleware** (`middleware.ts`):
- Checks authentication for protected routes
- Uses `@supabase/ssr` for server-side auth
- Matches `/cliente/:path*`, `/gestor/:path*`, `/auth`, and `/`
- **Role-based caching optimization:**
  - Caches user role in HTTP-only cookies for 5 minutes
  - Reduces database queries by checking role from:
    1. Cookie cache (fastest)
    2. JWT metadata
    3. Database query (fallback)
  - Cache timestamp tracked to ensure freshness
- **Rate Limiting:**
  - Implemented at middleware level using in-memory store
  - Different limits for different routes:
    - Auth routes: Stricter limits to prevent brute force
    - Payment routes: Protected limits for financial operations
    - API routes: Standard limits for general API calls
    - Dashboard routes: More relaxed limits for authenticated users
  - Returns 429 status with `Retry-After` header when exceeded
  - Tracks by client IP with support for proxy headers (Vercel, Cloudflare)
  - Includes `X-RateLimit-*` headers in all responses
- **Security Logging:**
  - Logs unauthorized access attempts
  - Tracks rate limit violations
  - Records privilege escalation attempts
  - Monitors banned/suspended user access
  - All security events logged via `lib/security/security-logger.ts`
- **Critical:** All responses have `Cache-Control: no-store` headers to prevent cross-user data leaks

**Supabase Clients:**
- **Client-side** (`lib/supabase/client.ts`): For client components
- **Server-side** (`lib/supabase/server.ts`): For server components and actions

**User Hook** (`hooks/auth/useUser.ts`):
- Returns `{ data, isLoading, error }` with user + profile
- Profile includes: `nome_completo`, `cpf`, `role`, `saldo_creditos`, etc.
- Cached for 5 minutes

### Service Layer

**Pattern:**
```typescript
// Service (src/services/core/courts.service.ts)
export const courtsService = {
  async getAll(): Promise<Court[]> {
    const { data, error } = await supabase
      .from('quadras')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data || [];
  },
};

// Hook (src/hooks/core/useCourts.ts)
export function useCourts() {
  return useQuery({
    queryKey: ['courts'],
    queryFn: courtsService.getAll,
  });
}

// Component usage
const { data: courts, isLoading } = useCourts();
```

### Validation Schemas

**Pattern** (`lib/validations/*.schema.ts`):
```typescript
import { z } from 'zod';

export const courtSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  tipo: z.enum(['society', 'beach_tennis', 'volei', 'futvolei']),
  // ...
});

export type CourtFormData = z.infer<typeof courtSchema>;
```

### Custom Form Components

**CPF Input** (`components/shared/forms/InputCPF.tsx`):
- Auto-formats as user types (###.###.###-##)
- Validates CPF algorithm

**CEP Input** (`components/shared/forms/InputCEP.tsx`):
- Auto-formats (#####-###)
- Integrates with ViaCEP API to auto-fill address

**WhatsApp Input** (`components/shared/forms/InputWhatsApp.tsx`):
- Auto-formats (##) #####-####
- Validates Brazilian phone format

### Loading States and Error Handling

**Skeleton Components** (`components/shared/loading/`):
- `ReservaSkeleton.tsx` - Reservation card skeleton
- Provides smooth loading experience
- Built with `components/ui/skeleton.tsx` (shadcn/ui)

**Error Handler Hook** (`hooks/useErrorHandler.ts`):
- Centralized error handling replacing `alert()`
- Provides toast notifications for errors and success
- Includes contextual logging for debugging
- **Usage:**
  ```typescript
  const { handleError, handleSuccess } = useErrorHandler();
  try {
    await mutation.mutateAsync(data);
    handleSuccess('Operation successful');
  } catch (error) {
    handleError(error, 'ComponentName', 'User-friendly message');
  }
  ```

**Debounce Hook** (`hooks/useDebounce.ts`):
- 300ms debounce for search filters
- Reduces unnecessary API calls
- Improves search performance

### Database Tables (Current Schema)

**Core Tables:**
- `users` - User accounts and profiles
- `quadras` - Sports courts
- `horarios` - Court schedules (time slots + pricing)
- `court_blocks` - Court unavailability blocks
- `turmas` - Teams (autonomous, reusable)
- `turma_membros` - Team members
- `reservas` - Court reservations
- `reserva_participantes` - Reservation participants
- `rateios` - Cost sharing configurations
- `convites` - Invitation batches
- `aceites_convite` - Invitation acceptances
- `indicacoes` - Referral system
- `mensalistas` - Monthly members
- `avaliacoes` - Reviews and ratings
- `pagamentos` - Payment records
- `notificacoes` - User notifications

**Important:** Database migrations are not fully tracked in `supabase/migrations`. Reference the remote database schema or docs for complete structure.

### API Routes

The application includes API routes for webhooks and server-side operations:

**Structure:**
- `api/auth/*` - Authentication endpoints (signup, login, session)
- `api/reservas/*` - Reservation CRUD and status updates
- `api/convites/*` - Invitation management and acceptance
- `api/avaliacoes/*` - Review submission and retrieval
- `api/indicacoes/*` - Referral system endpoints
- `api/creditos/*` - Credits management
- `api/jogos/*` - Games history tracking
- `api/pagamentos/*` - Asaas payment webhooks
- `api/whatsapp/*` - WhatsApp webhook handlers
- `api/webhooks/*` - General webhook endpoints
- `api/notificacoes/*` - Notification triggers and cron jobs

**Important Notes:**
- All API routes use server-side Supabase client for security
- Webhooks validate signatures/tokens before processing
- Rate limiting should be considered for production
- Use `CRON_SECRET_TOKEN` to protect scheduled notification endpoints

## Important Configuration

### Next.js Config

**Key Settings:**
- **NO** `output: 'export'` (removed to support SSR)
- `images.unoptimized: true` (for Supabase images)
- `reactStrictMode: true` (development best practice)
- `compiler.removeConsole: true` (in production only)
- `experimental.optimizePackageImports` for `lucide-react` and UI components
- `poweredByHeader: false` (security)
- `compress: true` (performance)
- Environment variable fallbacks for build time
- `typescript.ignoreBuildErrors: false` (enforces type safety - default)

### Vercel Configuration

**Deployment Settings:**
- Region: `gru1` (São Paulo, Brazil) for optimal latency with Brazilian users
- Framework: Next.js (auto-detected)
- Node.js version: 20 (via `.node-version` file)
- Build command: `npm run build`
- Output directory: `.next` (default for Next.js)

**Environment Variables:**
- Configure all env vars from `.env.example` in Vercel dashboard
- Use `node scripts/check-vercel-env.mjs` to verify Vercel env vars
- Use `node scripts/check-vercel-env.mjs --fix` to sync local → Vercel
- Remember: Changes to env vars require redeployment

### Environment Variables

Required in `.env.local` (see `.env.example`):
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Next.js
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=

# Asaas Payment Gateway
ASAAS_API_KEY=
ASAAS_ENVIRONMENT=         # "sandbox" or "production"
ASAAS_WEBHOOK_SECRET=

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=

# System
CRON_SECRET_TOKEN=         # For scheduled notifications
```

### Color Palette

Defined in `tailwind.config.ts`:
- Primary (Green): `#2D9F5D` - Sports theme
- Secondary (Blue): `#4F9CFF` - Trust/energy
- Accent (Orange): `#FF6B35` - Call-to-action

### TypeScript Configuration

**Path Aliases:**
- `@/*` maps to `src/*` - use this for all imports
- Example: `import { Button } from '@/components/ui/button'`
- Example: `import { createClient } from '@/lib/supabase/client'`

**Strict Mode:**
- Strict type checking is enabled (`strict: true`)
- Type errors will fail the build (no `ignoreBuildErrors`)
- Always run `npx tsc --noEmit` before committing to catch type errors

**Compiler Options:**
- Target: ES2017 for optimal compatibility
- Module: ESNext with bundler resolution
- JSX: preserve (handled by Next.js)
- Supports async/await natively

### Security Headers

The middleware automatically adds comprehensive security headers to all responses:

**Cache Control:**
- `Cache-Control: no-store, no-cache, must-revalidate, private`
- `Pragma: no-cache` and `Expires: 0`
- Critical for preventing cross-user data leaks in financial systems

**Security Headers:**
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Referrer control
- `Strict-Transport-Security` - Forces HTTPS (production only)
- `Permissions-Policy` - Restricts dangerous browser features (geolocation, microphone, camera, payment)

**Content Security Policy (CSP):**
- Comprehensive CSP with Vercel Analytics support
- Restricts script sources to self and trusted domains
- Prevents inline scripts except where necessary
- Blocks frame embedding and object loading
- Enforces upgrade to HTTPS

**Note:** All responses include these headers automatically via middleware.

## Development Guidelines

### When Creating New Features

1. **Define Types** - Create type definitions in `src/types/*.types.ts`
2. **Create Validation Schema** - Add Zod schema in `src/lib/validations/*.schema.ts`
3. **Implement Service** - Add CRUD methods to service in `src/services/`
4. **Create Hooks** - Wrap service with React Query in `src/hooks/core/`
5. **Build Components** - Create forms/UI in `src/components/modules/`
6. **Add Routes** - Create pages in appropriate route group

### When Working with Forms

- Use React Hook Form with Zod resolver
- Use shadcn/ui Form components
- Custom inputs available: InputCPF, InputCEP, InputWhatsApp
- Always handle loading and error states
- Show toast notifications on success/error

### When Working with Data

- **NEVER** call Supabase directly from components
- Always use service layer methods
- Always wrap services with React Query hooks
- Use proper query keys for caching
- Invalidate queries after mutations
- Use `useErrorHandler` for consistent error handling (not `alert()`)
- Implement loading skeletons for better UX
- Apply `useDebounce` to search/filter inputs

### Authentication Best Practices

- Use `useUser()` hook in client components
- Use `createClient()` from `lib/supabase/server.ts` in server components
- Check `user.profile.role` for authorization
- Middleware handles route protection automatically
- Remember: role is cached for 5 minutes in middleware

## Debugging Tips

### Check Authentication State

```typescript
// In client component
const { data: user, isLoading } = useUser();
console.log('User:', user?.profile);

// In server component
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### Common Issues

**"User not authenticated":**
- Check `.env.local` has correct Supabase keys
- Verify middleware is running by checking browser Network tab
- Check cookie storage in browser DevTools
- Clear role cache cookies (pattern: `user-role-*`, `user-role-ts-*`)
- Run `node scripts/test-supabase-keys.mjs` to verify connection
- Check if user is banned/suspended in database

**TypeScript errors:**
- Run `npm run lint` to see all errors
- Ensure types are imported from correct locations
- Regenerate database types if schema changed: `npx supabase gen types typescript --linked > src/types/database.types.ts`

**Build errors:**
- Clear `.next` folder:
  - Windows: `rd /s /q .next` or `rmdir /s /q .next`
  - Unix/macOS: `rm -rf .next`
- Clear build info:
  - Windows: `del tsconfig.tsbuildinfo`
  - Unix/macOS: `rm tsconfig.tsbuildinfo`
- Reinstall dependencies: `npm install` (all platforms)
- Check for missing environment variables in `.env.local`
- Verify all required env vars match `.env.example`

**Dependency warnings:**
- Project uses ESLint 9+ (not v8) to avoid deprecation warnings
- Old glob/rimraf warnings may appear from nested dependencies - these are safe to ignore

## Important Reference Files

### Core Documentation
- `README.md` - Project overview and setup
- `SETUP/PRD.md` - Complete Product Requirements (Portuguese)
- `SETUP/PROMPT.md` - Full technical specifications (Portuguese)
- `.env.example` - Environment variables template

### Technical Guides
- `docs/AUTH_SUPABASE.md` - Authentication setup guide
- `docs/PLANEJAMENTO.md` - Development planning
- `docs/PROGRESSO.md` - Development progress tracking
- `docs/DESIGN_SYSTEM.md` - Design system specifications
- `docs/VIACEP_INTEGRATION.md` - CEP integration guide
- `docs/SISTEMA_NOTIFICACOES_AUTOMATICAS.md` - Automated notifications

### Module Documentation
- `docs/DASHBOARD_AUDIT.md` & `docs/DASHBOARD_IMPROVEMENTS.md` - Dashboard status
- `docs/RESERVAS_AUDIT.md` & `docs/RESERVAS_IMPROVEMENTS.md` - Reservations status
- `docs/TURMAS_AUDIT.md` & `docs/TURMAS_IMPROVEMENTS.md` - Teams status
- `docs/CONVITES_AUDIT.md` & `docs/CONVITES_IMPROVEMENTS.md` - Invitations status
- `docs/JOGOS_AUDIT.md` & `docs/JOGOS_IMPROVEMENTS.md` - Games history status
- `docs/INDICACOES_AUDIT.md` & `docs/INDICACOES_IMPROVEMENTS.md` - Referrals status
- `docs/CREDITOS_AUDIT.md` & `docs/CREDITOS_IMPROVEMENTS.md` - Credits status

**Note:** Audit files document current state and issues, while Improvements files track applied fixes and enhancements.

## Future Modules (Not Yet Implemented)

### Escolinha Module
Sports school management for Academia do Galo (classes, students, attendance, teachers)

### Day Use Module
Day-use package management with pool and bar access (packages, addons, check-ins)

## Recent Improvements (2025)

The following improvements have been recently implemented:

**Performance & UX:**
- Migrated all major hooks to React Query for better caching
- Implemented `useDebounce` hook (300ms) for search filters
- Added skeleton loading states (`components/shared/loading/`)
- Replaced all `alert()` calls with toast notifications

**Error Handling:**
- Created centralized `useErrorHandler` hook
- Standardized error messages across the application
- Added contextual logging for debugging

**Data Management:**
- Optimized `useConvitesPendentes` with React Query (1min polling)
- Improved cache strategies (30s stale time, 5min garbage collection)
- Added automatic query invalidation after mutations

**New Modules:**
- Credits system (`creditos`) - fully implemented
- Games history (`jogos`) - tracking and reviews
- Enhanced referral system (`indicacoes`) - with bonuses

**Documentation:**
- Added audit documents for all major modules
- Created improvement tracking files
- Documented known issues and fixes

## Development Status & Focus

**Current Focus Areas:**
1. **CORE Module** - Reservations, teams, invitations (primary focus)
2. **Credits System** - Fully functional, ongoing refinements
3. **Referral System** - Complete with bonus tracking
4. **Notifications** - WhatsApp integration active

**Stabilization Phase:**
- Recent audits identified areas for improvement
- Most critical issues have been addressed
- Focus on polish, testing, and documentation

**Not Yet Started:**
- Escolinha module (sports school management)
- Day Use module (pool and bar packages)

## Notes

- Project is in **active development** - Phase 2 implementation
- Landing page is complete and can coexist with dashboard
- Database schema is maintained remotely (Supabase hosted)
- All user-facing text is in Portuguese (Brazilian)
- Focus is on CORE module (reservations, teams, invitations)
- Deployed on **Vercel** in São Paulo region for optimal Brazilian performance
- **Design System** - View component showcase at `/design-system` route
