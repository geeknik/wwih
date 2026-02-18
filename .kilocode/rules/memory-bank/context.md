# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ Ready for development

The template is a Next.js 16 starter with TypeScript and Tailwind CSS 4, featuring a "WWIH" (What We Imagine Here) dark pattern demo component.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] WWIH dark pattern demo component
- [x] Fixed React hydration mismatch in WWIH component
- [x] Added cursor betrayal patterns (dodging buttons, label swapping)
- [x] Added tiny moving hitboxes with random positions
- [x] Enhanced misroutes with route pinball effect
- [x] Enhanced loop traps with rapid page bouncing
- [x] Added disappearing buttons and ghost buttons

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/WWIH.tsx` | Dark pattern demo | ✅ Enhanced |
| `src/lib/chaos.ts` | Chaos/random utilities | ✅ Ready |
| `src/lib/friction.ts` | Friction pattern utilities | ✅ Ready |
| `src/lib/telemetry.ts` | Tracking utilities | ✅ Enhanced |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The WWIH component now features enhanced dark patterns including cursor betrayal, route pinball, and multiple new button types.

## Key Technical Details

### Hydration Fix (2026-02-18)

The WWIH component had hydration mismatch errors because random values (`Math.random()`, `chaos.pick()`, `chaos.chance()`) were being called during initial render, causing different values on server vs client.

**Solution**: Initialize all random values with deterministic defaults using `useState`, then randomize them in a `useEffect` with `setTimeout` after hydration completes:
- `movingButtonPositions` - starts at `{x: 0, y: 0}`, randomized after mount
- `navItems` - starts in original order, shuffled after mount
- `heroTitle` - starts with first title, randomized after mount
- `requiredFields` - starts with all fields, randomized after mount
- `captchaEmojis` - starts with same emoji, randomized after mount
- `confettiPieces` - starts with static values, randomized after mount
- `breadcrumbLabel` - starts with first nav label, randomized after mount
- `fakePageLabel` - starts with 'store', randomized after mount
- `wizardPrevLabel` - starts with 'Go Back', randomized after mount
- `wizardNextLabel` - starts with 'Continue (Mistake)', randomized after mount

### New Dark Patterns (2026-02-18)

**Cursor Betrayal**:
- `dodgingButtonPos` - Accept button that dodges cursor on hover (60% chance)
- `labelsSwapped` - Accept/Reject labels swap on hover (40% chance with cooldown)

**Tiny Hitbox**:
- `tinyHitboxPos` - 20px button that moves randomly every 2s, sometimes disappears

**Disappearing Buttons**:
- `disappearingBtnVisible` - Button that appears/disappears every 3s
- `ghostButtonPos` - Faint ghost button that moves every 1.5s

**Route Pinball**:
- After 2+ back attempts, triggers rapid page changes (pinball effect)
- Number of bounces scales with back attempt count

**Enhanced Misroutes**:
- Misroute chance increased from 30% to 45%
- Navigation history tracked for loop detection
- `pinballCount` tracked in telemetry

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| 2026-02-18 | Added cursor betrayal, tiny hitboxes, disappearing buttons, route pinball, enhanced misroutes |
| 2026-02-18 | Fixed hydration mismatch in WWIH component by deferring random values to useEffect |
| Initial | Template created with base setup |
