# Ludara

A gamified idea board built around a pack-opening and commit mechanic. Users open a
pack revealing a hand of 3 ideas, commit to one, and see a leaderboard of winning ideas.

## User flow
1. User lands on Ludara and sees a single unopened pack
2. User clicks the pack — card reveal animation plays, 3 idea cards are shown
3. User is prompted "Which idea is most interesting?"
4. User commits one card (swipe up on mobile, drag to drop zone on desktop)
5. User is routed to /leaderboard showing all-time vote counts
6. User can navigate back to home to open another pack

## Stack
- Next.js 14, TypeScript (strict mode, no `any`)
- Tailwind CSS, Framer Motion
- Zustand with localStorage persistence
- Deployed on Vercel

## Key concepts
- **Commit** — the action of selecting a card as the winner. It is consumed and the
  user is routed to the leaderboard.
- **Hand** — a set of 3 randomly drawn ideas presented to the user
- **Pack** — the unopened pack shown on landing. Clicking it triggers the reveal
  animation and draws a fresh hand.

## Architecture
- `data/cards.ts` — static IDEAS array (30 ideas, 6 categories) and LUDARA_PACK
  constant used for theming
- `lib/hand.ts` — getRandomHand(n) utility, returns n unique ideas with no duplicates
- `store/sessionStore.ts` — Zustand store, single source of truth for session state
- `app/leaderboard/page.tsx` — leaderboard view ranked by vote count
- `types/` — shared TypeScript types

## Session state (Zustand, persisted to localStorage)
- `hasPlayed` (boolean) — whether the user has committed a card this session
- `scores` (Record<string, number>) — all-time vote counts per idea id
- `currentHand` (CardType[] | null) — the active hand, not persisted, derived fresh
  on rehydration

## Landing page state machine (ephemeral, resets on every page load)
- `"pack"` — single clickable pack shown, calls initSession() on click
- `"reveal"` — CardReveal rendered with currentHand and LUDARA_PACK
- `"done"` — not used directly, commitCard() triggers router.push("/leaderboard")

## Component notes
- `CardReveal` / `DesktopFan` / `MobileCarousel` — animation and interaction
  components. Internals can be edited when necessary.
- Card hover lift on desktop: tracked via hoveredIndex local state in DesktopFan,
  animated with Framer Motion variants, not Tailwind
- Card description legibility: dark scrim behind description text area in CardFace
- `Pack` type is still used for theming — LUDARA_PACK provides neutral Ludara values

## Explicitly cut from MVP
- Daily pack restrictions / time-gating
- Pack rarity tiers
- Streaks and rewards
- User accounts / auth
- Categories filter
- User-submitted ideas
- Ads

## Conventions
- Mobile-first, single codebase, min-width breakpoints
- Animation: explicit CSS variables and Framer Motion variants — not Tailwind
- Conventional commit messages (feat:, fix:, chore:)
- Commit `package-lock.json`, gitignore `.claude/`
- Verify checkpoint criteria before committing each phase