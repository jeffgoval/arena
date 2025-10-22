# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Arena Dona Santa** is a comprehensive web platform for managing sports arena reservations in Governador Valadares, Brazil. The project is currently in its initial phase with a static landing page deployed, with plans to expand into a full-featured reservation system.

### Current Implementation (Phase 1)

**Landing Page Features:**
- Static Next.js site with SSG (Static Site Generation)
- Marketing page showcasing arena facilities
- Sections: Hero, Infrastructure, Academia do Galo, Day Use, Sponsors, FAQ, CTA
- Native CSS animations with Intersection Observer API
- Mobile-first responsive design
- Deployed on Cloudflare Pages

### Planned Full Application (Phase 2+)

The complete system will feature:
1. **CORE Module** - Reservation system with autonomous teams, flexible cost sharing, and public invitations
2. **Escolinha Module** - Sports school management (Academia do Galo)
3. **Day Use Module** - Day-use package management with pool and bar access

## Tech Stack

**Current (Landing Page):**
- Next.js 15 (App Router, Static Export)
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Native CSS animations + Intersection Observer API

**Planned (Full Application):**
- Next.js 15+ (App Router with SSR)
- shadcn/ui components
- React Query (TanStack Query)
- Zod validation
- React Hook Form
- Supabase (Auth, Database, Storage)
- Asaas payment gateway
- WhatsApp Business API
- ViaCEP (Brazilian postal code API)

**Deployment:**
- Cloudflare Pages (static export)
- Output directory: `out/`
- Node.js version: 20 (configured via `.node-version`)

## Current Architecture

### File Structure
```
arena-dona-santa/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── AnimationObserver.tsx # Scroll animations controller
│   └── Testimonials.tsx      # Auto-rotating testimonials slider
├── lib/
│   └── utils.ts              # Utilities (cn helper)
├── public/
│   └── hero-arena.jpg        # Hero background image
├── SETUP/
│   ├── PRD.md                # Product Requirements Document (Portuguese)
│   ├── PROMPT.md             # Full app technical specs (Portuguese)
│   └── PROMPT_LANDING.md     # Landing page specs (Portuguese)
└── CLAUDE.md                 # This file
```

### Key Design Decisions

**Performance Optimizations:**
- No heavy animation libraries (Framer Motion, GSAP)
- CSS animations with GPU acceleration (transform/opacity only)
- Intersection Observer for scroll-triggered animations
- Lazy loading with Next.js Image component
- Minimal parallax effect (5% movement on hero)

**Color Palette:**
- Primary (Green): `#2D9F5D` - Sports theme
- Secondary (Blue): `#4F9CFF` - Trust/energy
- Accent (Orange): `#FF6B35` - Call-to-action
- Dark: `#1A1A1A`
- Light: `#FFFFFF`
- Gray: `#F5F5F5`

**Responsive Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## Future Architecture (Full Application)

### Planned Route Groups
- `(auth)` - Authentication routes (login, registration)
- `(dashboard)` - Protected routes for clients and managers
- `(public)` - Public routes (invitations, reservations)

### Planned Component Organization
- `components/ui/` - shadcn/ui components
- `components/modules/core/` - Reservations, teams, invitations
- `components/modules/escolinha/` - Classes, students, attendance
- `components/modules/dayuse/` - Packages, check-in
- `components/shared/` - Shared components (Header, Sidebar, Calendar)

### Planned Critical Features

**Autonomous Team System:**
- Teams created independently of reservations (reusable across multiple games)
- Members marked as "fixed" (always included) or "variable"
- Multiple teams per organizer
- One team per reservation

**Flexible Cost Sharing (Rateio):**
- Two modes: Percentage (must sum to 100%) or Fixed Value (sum ≤ reservation total)
- Configuration per reservation (not per team)
- Visual progress indicators
- "Split Equally" helper button

**Public Invitation System:**
- Unique links for each invitation batch
- Multiple batches per reservation
- Landing page for invitation acceptance
- Simplified registration for invitees
- Invitee panel with credit purchase

**User Roles:**
1. **Cliente (Customer)** - Creates reservations, manages teams, creates invitations
2. **Gestor (Manager)** - Full system access, court management, reports

## Development Commands

### Current Development (Landing Page)

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build static export for Cloudflare Pages
npm run build
# Output will be in /out directory

# Start production server (after build)
npm start

# Lint code
npm run lint
```

### Future Development (Full Application)

When implementing the full application with Supabase:

```bash
# Initialize Supabase locally
supabase init
supabase start

# Generate database types
npx supabase gen types typescript --local > src/types/database.types.ts

# Apply migrations
supabase db push

# Reset database
supabase db reset

# Generate new migration
supabase migration new <migration_name>

# Add shadcn/ui components
npx shadcn-ui@latest add <component-name>
```

## Animation System (Current Implementation)

The landing page uses a custom animation system optimized for performance:

**AnimationObserver Component** (`components/AnimationObserver.tsx`):
- Client-side component using Intersection Observer API
- Triggers CSS animations when elements enter viewport
- Handles parallax effect on hero section (5% movement)
- Animation classes: `.fade-in`, `.slide-in-left`, `.slide-in-right`

**CSS Animations** (`app/globals.css`):
- GPU-accelerated (uses only `transform` and `opacity`)
- Timing: 0.8s ease-out
- Applied via data-visible attribute toggle

**Testimonials Slider** (`components/Testimonials.tsx`):
- Auto-rotating every 5 seconds
- Smooth fade transitions
- Manual navigation with previous/next buttons

## Build Configuration

**Next.js Config** (`next.config.js`):
- `output: 'export'` - Static HTML export for Cloudflare Pages
- `images.unoptimized: true` - Required for static export
- `eslint.ignoreDuringBuilds: true` - Allows flexible linting
- `typescript.ignoreBuildErrors: false` - Enforces type safety

**Tailwind Config** (`tailwind.config.ts`):
- Content paths: `./pages`, `./components`, `./app`
- Custom colors defined (see Color Palette above)
- Font family: Inter

## Deployment (Cloudflare Pages)

See `DEPLOY.md` for complete deployment guide.

**Build Settings:**
- Framework preset: Next.js (Static HTML Export)
- Build command: `npm run build`
- Build output directory: `out`
- Node.js version: 20 (via `.node-version` file)

**Automatic Deployment:**
- Pushes to `main` branch trigger automatic builds
- Preview URLs generated for all commits
- Edge-optimized global CDN delivery

## Future Database Structure (Planned)

When implementing the full application with Supabase:

**CORE Module Tables:**
- `users` - User accounts (customers, managers)
- `courts` - Sports courts (Society, Beach Tennis, Volleyball, Footvolley)
- `schedules` - Time slots and pricing
- `reservations` - Court reservations
- `teams` - Autonomous teams (reusable)
- `team_members` - Team members (fixed/variable status)
- `reservation_participants` - Participants per reservation
- `invitations` - Public invitation batches
- `invitation_acceptances` - Accepted invitations
- `payments` - Payment records (Asaas integration)
- `transactions` - Financial history
- `reviews` - Game reviews
- `referrals` - Referral system

**Escolinha Module Tables:**
- `classes` - Sports classes (Academia do Galo)
- `students` - Enrolled students
- `attendance` - Class attendance records
- `teachers` - Teacher profiles and commissions

**Day Use Module Tables:**
- `packages` - Day use packages (pool + bar access)
- `addons` - Additional items/services
- `checkins` - Check-in records

**Important:** All tables will use Supabase Row Level Security (RLS) policies to enforce access control.

## Future Implementation Details (Planned)

**User Registration:**
- CPF and RG must be unique
- ViaCEP API integration for address auto-fill
- Auto-filled fields: logradouro, bairro, cidade, estado

**Reservation Types:**
1. **Avulsa** - One-time reservation
2. **Mensalista** - Monthly recurring (same day/time weekly for a month)
3. **Recorrente** - Custom recurring pattern

**Payment Methods:**
- Pix (via Asaas)
- Credit/Debit card (via Asaas)
- Accumulated credits
- Security deposit (caução) with pre-authorization and partial capture

**WhatsApp Notifications:**
- Automatic reminders (45min and 10min before game)
- Invitation acceptance notifications
- Post-game review requests
- Uses WhatsApp Business API templates

## Future File Organization (Planned)

When implementing the full application:
- **Validation schemas**: `src/lib/validations/*.schema.ts` (using Zod)
- **Custom hooks**: `src/hooks/use*.ts`
- **Services**: `src/services/<module>/*.service.ts`
- **Types**: `src/types/*.types.ts`
- **Utilities**: `src/lib/utils/*.ts` (currency, date, CPF validation)

## Important Reference Files

- `README.md` - Landing page documentation and deployment guide
- `DEPLOY.md` - Cloudflare Pages deployment instructions
- `SETUP/PRD.md` - Complete Product Requirements Document (Portuguese)
- `SETUP/PROMPT.md` - Full application technical specifications (Portuguese)
- `SETUP/PROMPT_LANDING.md` - Landing page specifications (Portuguese)

## Development Notes

**When working on the current landing page:**
- Keep performance optimizations in mind (no heavy libraries)
- Use only CSS animations with GPU acceleration
- Test on mobile devices (mobile-first approach)
- Maintain accessibility standards (contrast, semantic HTML)
- Optimize images before adding to `public/`

**When transitioning to full application:**
1. Remove `output: 'export'` from `next.config.js`
2. Install additional dependencies: shadcn/ui, Supabase, React Query, Zod, React Hook Form
3. Set up Supabase project and configure environment variables
4. Implement database migrations from `SETUP/PROMPT.md`
5. Follow the implementation priority order from PRD
