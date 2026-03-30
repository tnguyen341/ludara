# Ludara

A gamified idea board built around a pack-opening and commit mechanic. Users open a pack revealing a hand of 3 ideas, commit to one, and see a leaderboard of winning ideas.

## User flow
1. User lands on Ludara
2. They open a pack — a hand of 3 ideas is revealed via card animation
3. They commit one card from the hand — their pick
4. They are taken to the leaderboard showing all-time vote counts
5. One pack per session — no re-opening in MVP

## Stack
- Next.js 14, TypeScript (strict mode, no `any`)
- Tailwind CSS, Framer Motion
- Zustand with localStorage persistence
- Deployed on Vercel

## Key concepts
- **Commit** — the action of selecting a card as the winner. It is consumed and the user is taken to the leaderboard.
- **Hand** — a set of 3 randomly drawn ideas presented to the user
- **Pack** — the opening sequence that reveals the hand

## Architecture
- `data/cards.ts` — static seeded IDEAS array (30 ideas, 6 categories)
- `lib/hand.ts` — getRandomHand(n) utility
- `store/sessionStore.ts` — Zustand store, single source of truth for session state
- `types/` — shared TypeScript types

## Session state
- `hasPlayed` (boolean) — whether the user has committed a card this session
- `scores` (Record<string, number>) — all-time vote counts per idea id
- `currentHand` ([CardType, CardType, CardType] | null) — the active hand

## Conventions
- Mobile-first, single codebase, min-width breakpoints
- Conventional commit messages (feat:, fix:, chore:)
- Verify checkpoint criteria before committing each phase