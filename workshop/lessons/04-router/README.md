# Lesson 04: Router

## Why this lesson?
We need to dispatch incoming requests (`method` + `params`) to the correct procedure. The router maps names to procedures and provides context to handlers.

## Mental model
- Register procedures under method names: `router.add('user.get', proc)`.
- On request: look up by `method`, validate input via the procedure, call the handler with `{ input, ctx }`.
- Always echo `id`; unknown methods return 404 error envelopes.

## What you'll build
- A `Router` that can register procedures and handle a single RPC request.
- A `createRouter()` factory that returns `{ add, handle }`.

## Files you'll edit
- `src/core/router.ts` (scaffold to be implemented)

## How to run
- Focused tests: `npm run test:router`

## Objective
Route an `RPCRequest` to the correct procedure and return an `RPCResponse`.

## Constraints
- Unknown method → 404 error envelope.
- Exceptions from handlers → 500 error envelope.
- Echo the incoming `id` on success and error.

## Step-by-step (suggested)
1. Implement `createRouter()` with an internal map of method → procedure.
2. Implement `add(name, procedure)` to register.
3. Implement `handle({ request, ctx })`:
   - find procedure; if missing → 404 error
   - run procedure `.call({ input: request.params, ctx })`
   - wrap result in `RPCResponse` using serializer helpers

## Tests (Red)
- Unknown method returns 404 and echoes `id`.
- Known method runs and returns `result`.
- Handler error becomes 500 error envelope.
- Context object reaches the handler.

## Pitfalls to avoid
- Not echoing `id` on errors.
- Leaking exception stacks.

## Acceptance (Green)
All router tests pass; behavior is consistent with earlier lessons.

## Refactor
Extract router types and keep API minimal.

## Learn
Record server routing trade-offs in Architecture Decisions.
