# Lesson 05: Client Proxy (Type-Safe Calls)

## Why this lesson?
We want remote calls to feel like local function calls while preserving types. A client proxy maps method names to typed functions that send RPC requests under the hood.

## Mental model
- Define a client with a map of method → input schema.
- Calling a method serializes `{ id, method, params }`, sends via transport, and returns `result` or throws on `error`.
- Types enforce correct inputs at compile time.

## What you'll build
- `createClient({ url, procedures })` that returns a typed object with methods for each procedure.
- Each method: `(input) => Promise<result>`; throws on error envelopes.

## Files you'll edit
- `src/core/client.ts` (scaffold to be implemented)

## How to run
- Focused runtime tests: `npm run test:client`
- Type tests (compile-time): `npm run test:client:types`

## Objective
Create a typed client that wraps the transport and enforces input shapes.

## Constraints
- No frameworks; rely on existing transport later.
- For this lesson, pass a `procedures` definition using Zod schemas.
- Do not leak server error stacks; throw clean errors on `error` envelopes.

## Step-by-step (suggested)
1. Define `ClientDefinitions` as `Record<name, { input: ZodTypeAny }>`.
2. Implement `createClient({ url, procedures })` that builds functions for each key.
3. Each function constructs an RPC request, calls transport, returns `result`, or throws on `error`.
4. Ensure the function parameter type is inferred from the Zod schema.

## Tests (Red)
- Calls transport with correct `{ method, params }` and returns unwrapped `result`.
- Throws when response contains `error`.
- Type tests ensure wrong inputs cause compile-time errors.

## Pitfalls to avoid
- Forgetting to echo the request `id`.
- Returning the raw `RPCResponse` instead of unwrapped `result`.

## Acceptance (Green)
All client tests pass; type tests validate input shapes.

## Refactor
Extract helper types and keep the client API minimal.

## Learn
Document how client types relate to procedure/router metadata in Architecture Decisions.
