# Ludara

A gamified idea board built around a single, deliberate interaction — committing to one
idea over others.

## What is it?

Ludara presents you with a hand of ideas and asks a simple question: *which is most
interesting?* You commit to one. Over time, a ranked leaderboard emerges from the
collective weight of those decisions.

The core insight is that forced commitment surfaces genuine preference more accurately
than passive browsing or upvoting. Scrolling is easy. Choosing is honest.

## Why I built it

Most idea discovery tools optimize for volume — more content, more votes, more noise.
Ludara takes the opposite position. One pack. One commit. One signal added to the
board.

The mechanic is inspired by max-diff scaling in survey methodology, where asking people
to choose between options rather than rate them independently produces more reliable
preference data. Ludara applies that principle to everyday idea exploration.

Plus, I LOVE card games. Could you tell?

## The experience

1. Land on a single unopened pack
2. Click to reveal a hand of three ideas via a card animation sequence
3. Read them. One will pull at you more than the others.
4. Commit it — drag it up and release
5. See where it lands on the leaderboard

## Stack

- **Next.js 14** — app router, TypeScript throughout
- **Framer Motion** — all card animations and interaction sequences
- **Zustand** — session state with localStorage persistence
- **Tailwind CSS** — layout and typography
- **Vercel** — deployment and preview environments

## Status

MVP complete. Actively exploring post-MVP directions including daily pack cadence,
idea categories, and user-submitted ideas.