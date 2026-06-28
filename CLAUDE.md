# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

npm workspaces. All packages live in `packages/`. Run all commands from the repo root unless noted.

```
packages/
  kardamon/        # Svelte 5 card-game rendering library (IIFE Web Component)
  game-server/     # Fastify 4 + WebSocket — Hearts game engine + room management
  platform-api/    # Fastify 4 + Prisma — auth, scores, leaderboard
  hearts-client/   # Alpine.js static HTML served by game-server
```

## Commands

```bash
# From repo root
npm install               # install all workspaces
npm run setup             # install + build kardamon IIFE
npm run dev               # start game-server (3001) and platform-api (3002) concurrently
npm run build:kardamon    # build packages/kardamon/dist/lib/kardamon-game.js

# Within packages/kardamon/
npm run dev               # Vite dev server on :5173 (MockTransport, hot reload)
npm run build:lib         # IIFE bundle → dist/lib/kardamon-game.js
npm run check             # TypeScript + Svelte type check
npm run lint              # ESLint

# Within packages/platform-api/
npm run db:push           # create/sync SQLite schema (needs .env with DATABASE_URL)
npm run db:studio         # Prisma Studio GUI
```

## First-time setup

```bash
npm run setup
cp packages/game-server/.env.example packages/game-server/.env
cp packages/platform-api/.env.example packages/platform-api/.env
cd packages/platform-api && npm run db:push
```

Then open http://localhost:3001 after `npm run dev`.

## Commit conventions

commitlint (conventional commits, via husky). Subject case must not be StartCase or PascalCase. Use lowercase imperative style, e.g. `feat: add drag support`.

## kardamon architecture

State-driven, accessibility-first card game rendering client. Receives `GameState` from a server, renders it, sends `PlayerAction` back. Game-agnostic — server decides all logic.

```
packages/kardamon/src/
  lib/
    types/protocol.ts          # GameState, Player, Action, PlayerAction, CardId, CardSheet
    transport/
      transport.ts             # Transport interface
      websocket-transport.ts   # WebSocket implementation
      mock-transport.ts        # 4-player in-browser mock for development
    components/
      Card.svelte              # single card: sprite or text fallback; interactive or display
      Hand.svelte              # fan layout + action buttons
      OpponentArea.svelte      # opponent name, active indicator, stacked card backs
      TableArea.svelte         # play-group stack in table center
      GameTable.svelte         # CSS Grid layout; flying card animation; trick accumulation
  App.svelte                   # top-level; sets CardSheet context; picks transport
  element.ts                   # custom element entry point for build:lib
  main.ts                      # Svelte mount entry point for dev
```

### Protocol

Server → client: raw `GameState` JSON (no wrapper).
Client → server: raw `PlayerAction` JSON `{ type: string, cards: CardId[] }`.

`CardId` convention: `"{suit}-{rank}"` e.g. `hearts-A`, `spades-Q`, `clubs-2`.

**GameState fields:**
- `myId`: which player is local
- `players[]`: `{ id, name, seat, hand?, handCount, isActive, status? }`
- `table`: current-trick cards in play order (cumulative; cleared between tricks)
- `actions`: buttons to show (`requiresSelection: true` → disabled until cards selected)
- `phase?`, `message?`

### Table / trick rendering

`TableArea` renders `playGroups: { cards, rotation }[]`. Each play group is one player's turn, absolutely stacked at table center, rotated by `SLOT_ROTATION[slot]` to show which direction it arrived from. The cascade rule (`margin-left: -46px`, `z-index: var(--i)`) within each group must never change.

Flying card animation (`runFlyAnimation`) uses bbox center (`rect.left + rect.width/2`) for both source and destination positions — this is invariant under CSS rotation and avoids a visible jump when the real card is revealed.

### CardSheet / sprite rendering

`App.svelte` accepts a `cardSheet?: CardSheet` prop and puts it in context as a getter function (`setContext('kardamon:cardSheet', () => cardSheet)`) to avoid Svelte `state_referenced_locally` warnings. `Card.svelte` and `OpponentArea.svelte` read it via `getContext` + `$derived(getSheet?.())`. Falls back to text rendering if no sheet or card key not found.

## game-server architecture

```
packages/game-server/src/
  game/
    types.ts      # HeartsGame, GamePlayer, Phase, PassDirection, TrickEntry
    deck.ts       # DECK constant, suit/rank/rankValue/cardPoints/shuffle/dealDeck helpers
    hearts.ts     # pure game engine: createGame, startRound, submitPass, playCard,
                  #   settleTrick, trickComplete, currentActiveSeat, getStateFor
    bot.ts        # getBotPass, getBotPlay (simple strategy: dump Q♠/high hearts)
  room-manager.ts # RoomManager: joinGame, bot scheduling, trick-delay, result reporting
  server.ts       # Fastify, WebSocket /game route, static files, /rooms REST
```

### Game flow

1. First human joins → 3 bots fill seats → `startRound` → state broadcast
2. Passing phase: bots pass immediately; human selects 3 cards
3. Playing phase: active seat plays; after each card `handleAfterCard` runs
4. Trick complete (4 cards): broadcast complete trick, wait 1.5s, `settleTrick`, broadcast cleared table
5. Round over: broadcast scores for 4.5s, then `startRound`
6. Game over (any player ≥ 100): broadcast winner, optionally POST result to platform-api

### WebSocket connection

```
ws://localhost:3001/game?room=<id>&token=<jwt>&name=<name>
```

`token` is optional — if absent, player is anonymous with a generated ID. If present, verified with the shared `JWT_SECRET`.

## platform-api architecture

Fastify 4 + `@fastify/jwt` + bcrypt + Prisma (SQLite for dev).

```
packages/platform-api/src/
  routes/
    auth.ts    # POST /auth/register, POST /auth/login, GET /auth/me
    scores.ts  # GET /scores/leaderboard, GET /scores/me, POST /scores/games/result
  server.ts    # Fastify setup, jwt plugin, authenticate decorator
prisma/schema.prisma   # User, Game, GamePlayer models
```

`POST /scores/games/result` is an internal endpoint protected by `x-internal-api-key` header (shared with game-server via env var). Lower score wins in Hearts; leaderboard sorts by avgScore ascending.

## hearts-client

Single `index.html` (Alpine.js 3, no build step). Served by game-server as static files alongside `kardamon-game.js`, `cards.json`, `cards.png`.

Screens: auth (login/register/guest) → lobby (room list, create/join) → game (injects `<kardamon-game>` element).

## Environment variables

Both servers share the same `JWT_SECRET`. Change it in production.

| Var | Default | Used by |
|-----|---------|---------|
| `JWT_SECRET` | `dev-secret-change-in-production` | game-server, platform-api |
| `INTERNAL_API_KEY` | `dev-internal-key` | game-server (sends), platform-api (receives) |
| `PLATFORM_API_URL` | _(unset = disabled)_ | game-server |
| `DATABASE_URL` | `file:./dev.db` | platform-api |
| `PORT` | 3001 / 3002 | each server |
