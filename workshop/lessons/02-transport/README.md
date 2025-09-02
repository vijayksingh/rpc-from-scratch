# Lesson 02: Transport (HTTP + JSON)

## Why this lesson?
Serialization gives us bytes; transport moves them between client and server. We'll implement a minimal HTTP POST transport to send and receive RPC messages.

## What you'll build
- An HTTP server that accepts POST requests with JSON bodies and returns JSON responses
- A client function that sends requests and parses responses
- Basic CORS handling and method gating

## Files you'll edit
- `src/core/transport.ts` (will be scaffolded to throw until implemented)

## How to run
- Focused tests: `npm run test:transport`
- Manual demo (later): `npm run dev:transport`

## Objective
Implement JSON-over-HTTP POST round-trip between client and server.

## Constraints
- Use Node `http` only; no frameworks.
- Handle CORS OPTIONS preflight.
- Return 405 for non-POST.
- Do not leak stack traces in responses.

## Tests (Red)
- Echo handler returns structured `result` (id echoed, method included).
- Non-POST returns 405 with JSON error body.
- OPTIONS is handled (200 with no body required).
- Handler throw maps to 500 error envelope via serializer helper.
- Client supports a basic timeout (default or configurable).

## Acceptance (Green)
All transport tests pass; logs OK; responses do not leak stacks.

## Refactor
Extract helpers and improve readability without changing behavior.

## Learn
Document HTTP vs alternatives and POST-only rationale in Architecture Decisions.
