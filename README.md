# WWIH - What We Imagine Here

A Next.js application demonstrating dark UX patterns and hostile design. This is an educational project showcasing the frustrating patterns users encounter on the web.

> ⚠️ **Warning**: This application intentionally implements hostile UX patterns for educational purposes. Do not use these patterns in real applications!

## Features (Anti-Features)

### Navigation Chaos
- Moving navigation buttons that dodge your cursor
- Randomized link labels that misdirect users
- Breadcrumbs that lie about your location

### Form Hostility
- Self-unchecking checkboxes
- Random validation errors
- Fields that wipe themselves on "error"
- Impossible CAPTCHAs with sad emojis

### Dark Patterns
- Cookie banners that won't go away
- Consent forms with infinite scroll that resets
- Close buttons that run away from your cursor
- Misleading wizard progress bars

### Audio Annoyance
- Hover sounds (with backward volume control)
- Mute button that unmutes itself after 11 seconds

### Back Button Sabotage
- Traps users with history manipulation
- Shows confirmation modals when trying to leave

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Bun installed ([install guide](https://bun.sh))

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to experience the hostility.

### Build

```bash
bun build
```

### Lint & Type Check

```bash
bun lint
bun typecheck
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (renders WWIH)
│   └── globals.css         # Global styles
├── components/
│   └── WWIH.tsx            # Main dark pattern demo component
└── lib/
    ├── chaos.ts            # Random/seedy utilities
    ├── friction.ts         # UX friction patterns
    └── telemetry.ts        # Simulated tracking
```

## Educational Purpose

This project exists to:

1. **Demonstrate** common dark patterns users face
2. **Educate** developers on what NOT to do
3. **Raise awareness** of hostile design tactics

### Patterns Demonstrated

| Pattern | Description |
|---------|-------------|
| Confirmshaming | "Decline (Not Recommended)" buttons |
| Hidden costs | Mystery fees appearing later |
| Forced continuity | Impossible to cancel/close |
| Sneak into basket | Items added without consent |
| Roach motel | Easy to get in, hard to get out |
| Trick questions | Confusing wording in forms |
| Misdirection | Visual emphasis on wrong actions |

## License

MIT

---

*Remember: Just because you CAN implement these patterns doesn't mean you SHOULD. Build the web you want to use.*
