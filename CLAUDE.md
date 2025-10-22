# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Arena Dona Santa** is a comprehensive sports arena reservation platform for Governador Valadares, Brazil. The project has **transitioned from Phase 1 (landing page) to Phase 2 (full application)** with Supabase authentication, dashboard pages, and the CORE module implementation underway.

### Current Status (Phase 2 - Active Development)

**Implemented Features:**
- Landing page with modular components (Hero, Infrastructure, Academia do Galo, Day Use, etc.)
- Supabase authentication system with SSR
- Route-based authentication middleware
- Dashboard layouts for Cliente (Customer) and Gestor (Manager)
- Courts (Quadras) management with schedules and blocks
- Teams (Turmas) management
- Reservations (Reservas) system with cost-sharing (rateio) and invitations
- Public invitation acceptance flow
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

**Future Integrations:**
- Asaas payment gateway
- WhatsApp Business API
- ViaCEP (Brazilian postal code API)

**Deployment:**
- Node.js version: 20 (configured via `.node-version`)
- Supports SSR (no longer static export)

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
│   │   │   │   └── turmas/            # Teams module
│   │   │   ├── gestor/                # Manager dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   └── quadras/           # Courts management
│   │   │   └── layout.tsx             # Dashboard layout
│   │   ├── (public)/                  # Public route group
│   │   │   ├── convite/[token]/       # Invitation acceptance
│   │   │   └── layout.tsx             # Public layout
│   │   ├── page.tsx                   # Landing page
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── landing/                   # Landing page components
│   │   ├── modules/core/              # Business logic components
│   │   │   ├── quadras/               # Courts forms
│   │   │   └── turmas/                # Teams forms
│   │   ├── shared/forms/              # Reusable form inputs
│   │   └── providers/                 # React context providers
│   ├── hooks/
│   │   ├── auth/                      # Auth hooks (useUser)
│   │   ├── core/                      # Business hooks with React Query
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
│   │   └── core/                      # API service layer
│   │       └── courts.service.ts      # Courts CRUD operations
│   └── types/
│       ├── *.types.ts                 # TypeScript type definitions
│       └── database.types.ts          # Generated Supabase types (if exists)
├── middleware.ts                      # Auth middleware (route protection)
├── public/                            # Static assets
├── supabase/                          # Supabase config
├── docs/                              # Project documentation
├── SETUP/                             # Setup guides and specifications
│   ├── PRD.md                         # Product Requirements (Portuguese)
│   └── PROMPT.md                      # Technical specs (Portuguese)
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
- `(dashboard)` - Protected pages requiring authentication
- `(public)` - Public pages (invitations, landing)

**Authentication:**
- Middleware protects `/cliente/*` and `/gestor/*` routes
- Redirects unauthenticated users to `/auth`
- Redirects authenticated users from `/auth` to `/cliente`
- Uses Supabase SSR with cookie-based sessions

## Critical Implementation Details

### Authentication System

**Middleware** (`middleware.ts`):
- Checks authentication for protected routes
- Uses `@supabase/ssr` for server-side auth
- Matches `/cliente/:path*`, `/gestor/:path*`, `/auth`

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

**Important:** Database migrations are not fully tracked in `supabase/migrations`. Reference the remote database schema or docs for complete structure.

## Important Configuration

### Next.js Config

**Key Settings:**
- **NO** `output: 'export'` (removed to support SSR)
- `images.unoptimized: true` (for Supabase images)
- `experimental.serverActions` enabled
- `typescript.ignoreBuildErrors: false` (enforces type safety)

### Environment Variables

Required in `.env.local` (see `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

### Color Palette

Defined in `tailwind.config.ts`:
- Primary (Green): `#2D9F5D` - Sports theme
- Secondary (Blue): `#4F9CFF` - Trust/energy
- Accent (Orange): `#FF6B35` - Call-to-action

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

### Authentication Best Practices

- Use `useUser()` hook in client components
- Use `createClient()` from `lib/supabase/server.ts` in server components
- Check `user.profile.role` for authorization
- Middleware handles route protection automatically

## Landing Page

**Current Components:**
- `Hero` - Hero section with parallax
- `Infrastructure` - Arena facilities showcase
- `Modalidades` - Sports modalities
- `AcademiaGalo` - Academia do Galo section
- `Escolinha` - Sports school info
- `DayUse` - Day use packages
- `Patrocinadores` - Sponsors section
- `Features` - Platform features
- `Diferenciais` - Differentiators
- `Contact` - Contact form
- `FinalCTA` - Final call-to-action
- `Footer` - Footer with links

**Animation System:**
- `AnimationObserver` component handles scroll animations
- CSS animations with GPU acceleration (transform/opacity only)
- Intersection Observer API for scroll triggers

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

### Test Database Connection

Use helper scripts in project root:
- `inspect-db.mjs` - Inspect database schema
- `test-auth-flow.mjs` - Test authentication flow
- `check-trigger.mjs` - Check database triggers

### Common Issues

**"User not authenticated":**
- Check `.env.local` has correct Supabase keys
- Verify middleware is running
- Check cookie storage in browser

**TypeScript errors:**
- Run `npm run lint` to see all errors
- Ensure types are imported from correct locations
- Regenerate database types if schema changed

**Build errors:**
- Clear `.next` folder: `rd /s /q .next` (Windows) or `rm -rf .next` (Unix)
- Reinstall dependencies: `npm install`
- Check for missing environment variables

## Important Reference Files

- `README.md` - Project overview and setup
- `SETUP/PRD.md` - Complete Product Requirements (Portuguese)
- `SETUP/PROMPT.md` - Full technical specifications (Portuguese)
- `docs/AUTH_SUPABASE.md` - Authentication setup guide
- `docs/PLANEJAMENTO.md` - Development planning
- `docs/PROGRESSO.md` - Development progress tracking
- `.env.example` - Environment variables template

## Future Modules (Not Yet Implemented)

### Escolinha Module
Sports school management for Academia do Galo (classes, students, attendance, teachers)

### Day Use Module
Day-use package management with pool and bar access (packages, addons, check-ins)

### Payment Integration
Asaas payment gateway (Pix, credit/debit cards, security deposits)

### WhatsApp Notifications
WhatsApp Business API integration (reminders, confirmations, reviews)

## Notes

- Project is in **active development** - Phase 2 implementation
- Landing page is complete and can coexist with dashboard
- Database schema is maintained remotely (Supabase hosted)
- All user-facing text is in Portuguese (Brazilian)
- Focus is on CORE module (reservations, teams, invitations)
