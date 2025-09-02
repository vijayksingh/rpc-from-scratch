# Lesson 02: Transport (HTTP + JSON)

## Why this lesson?
Serialization gives us bytes; transport moves them between client and server. We'll implement a minimal HTTP POST transport to send and receive RPC messages.

## Mental model
- Client sends a serialized `RPCRequest` via HTTP POST body.
- Server deserializes, runs a handler, serializes an `RPCResponse` and returns it.
- We always echo the `id` to match request↔response.

## What you'll build
- An HTTP server that accepts POST requests with JSON bodies and returns JSON responses
- A client function that sends requests and parses responses
- Basic CORS handling and method gating

## Files you'll edit
- `src/core/transport.ts` (currently a scaffold that throws "Not implemented")

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

## Step-by-step (suggested)
1. Implement `createServer` with CORS headers and OPTIONS handling.
2. Reject non-POST with 405 and a small JSON error (shape consistent with error envelope later).
3. Read request body, deserialize to `RPCRequest`.
4. Invoke handler, serialize `RPCResponse`, return 200.
5. Catch errors and return a 500 error envelope (use serializer helper).
6. Implement `sendRequest` that posts JSON and parses JSON response.

## Tests (Red)
- Echo handler returns structured `result` (id echoed, method included).
- Non-POST returns 405 with JSON error body.
- OPTIONS is handled (200 with no body required).
- Handler throw maps to 500 error envelope via serializer helper.
- Client supports a basic timeout (default or configurable).

## Pitfalls to avoid
- Reading request body incorrectly (ensure `end` event completes).
- Not setting `Content-Type: application/json` on responses.
- Forgetting to echo `id` (router/procedures will rely on it).

## Acceptance (Green)
All transport tests pass; logs OK; responses do not leak stacks.

## Refactor
Extract helpers and improve readability without changing behavior.

## Learn
Document HTTP vs alternatives and POST-only rationale in Architecture Decisions.

## Rubric
- Correctness (tests pass), clarity (readable server/client code), safety (no stack leaks), discipline (CORS + method gating).
